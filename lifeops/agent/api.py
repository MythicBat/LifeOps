import os
import boto3

from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from lifeops.models import (DocumentAnalysis, AutonomySettings)
from lifeops.service import LifeOpsService
from lifeops.dashboard import (get_dashboard_summary, get_user_items)
from lifeops.ask_agent import ( ask_lifeops )
from lifeops.life_graph import ( build_life_graph )
from lifeops.daily_brief import (DailyBriefService)
from lifeops.autonomy import (
    get_autonomy_settings,
    save_autonomy_settings,
)
from lifeops.command_center import (CommandCenterService)
from lifeops.timeline import (build_timeline)
from lifeops.notifications import (build_notifications)
from lifeops.auth import (require_user)

app = FastAPI(
    title="LifeOps Agent API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResolveDecisionRequest(BaseModel):
    option: str

class AskLifeOpsRequest(BaseModel):
    message: str
    sessionId: (str | None) = None

class CommandRequest(BaseModel):
    command: str

region = os.getenv("AWS_REGION")
dynamodb = boto3.resource("dynamodb", region_name=region)

lifeops = LifeOpsService()
daily_brief_service = (DailyBriefService())
command_center = (CommandCenterService())

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "lifeops-agent",
    }

@app.get("/decisions")
def get_decisions(user_id: str = Depends(require_user)):
    try:
        table_name = os.getenv("DYNAMODB_DECISIONS_TABLE")

        if not table_name:
            raise RuntimeError("DYNAMODB_DECISIONS_TABLE is missing")

        table = dynamodb.Table(table_name)
        response = table.scan(
            FilterExpression=(
                Attr("userId").eq(user_id) & Attr("status").eq("pending")
            )
        )

        return {
            "success": True,
            "decisions": response.get("Items", []),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/dashboard")
def dashboard(user_id: str = Depends(require_user)):
    try:
        return {
            "success": True,
            "dashboard": get_dashboard_summary(user_id),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/vault")
def vault(user_id: str = Depends(require_user)):
    try:
        life_objects = (
            get_user_items("DYNAMODB_LIFEOBJECTS_TABLE", user_id)
        )

        warranties = (
            get_user_items("DYNAMODB_WARRANTIES_TABLE", user_id)
        )

        renewals = (
            get_user_items("DYNAMODB_RENEWALS_TABLE", user_id)
        )

        subscriptions = (
            get_user_items("DYNAMODB_SUBSCRIPTIONS_TABLE", user_id)
        )

        appointments = (
            get_user_items("DYNAMODB_APPOINTMENTS_TABLE", user_id)
        )

        obligations = (get_user_items("DYNAMODB_OBLIGATIONS_TABLE", user_id))

        items = []

        # Bills / obligations
        for item in obligations:
            items.append({
                "id": item.get("id"),
                "category": "money",
                "type": "obligation",
                "title": item.get("title", "Bill"),
                "subtitle": item.get("vendor", "Obligation"),
                "amount": item.get("amount"),
                "currency": item.get("currency", "AUD"),
                "date": item.get("dueDate"),
                "status": item.get("status", "open"),
                "raw": item,
            })

        # Subscriptions
        latest_subscriptions = {}

        for item in subscriptions:
            vendor_key = (item.get("vendorKey") or item.get("vendor", "unknown").lower().strip())

            existing = (latest_subscriptions.get(vendor_key))

            if (not existing or item.get("createdAt", "") > existing.get("createdAt", "")):
                latest_subscriptions[
                    vendor_key
                ] = item

        for item in (latest_subscriptions.values()):
            items.append({
                "id": item.get("id"),
                "category": "subscriptions",
                "type": "subscription",
                "title": item.get("vendor", "Subscription"),
                "subtitle": "Subscription",
                "amount": item.get("amount"),
                "currency": item.get("currency", "AUD"),
                "date": item.get("createdAt"),
                "status": item.get("status", "active"),
                "raw": item,
            })

        # Warranties
        for item in warranties:
            items.append({
                "id": item.get("id"),
                "category": "products",
                "type": "warranty",
                "title": item.get("productName", "Product"),
                "subtitle": "Warranty",
                "date": item.get("expiryDate"),
                "status": item.get("status", "active"),
                "raw": item,
            })

        # Renewals
        for item in renewals:
            items.append({
                "id": item.get("id"),
                "category": "money",
                "type": "renewal",
                "title": item.get("title", "Renewal"),
                "subtitle": "Renewal",
                "amount": item.get("amount"),
                "currency": item.get("currency", "AUD"),
                "date": item.get("renewalDate"),
                "status": item.get("status", "upcoming"),
                "raw": item,
            })

        # Appointments
        for item in appointments:
            items.append({
                "id": item.get("id"),
                "category": "health",
                "type": "appointment",
                "title": item.get("title", "Appointment"),
                "subtitle": item.get("location", "Appointment"),
                "date": item.get("appointmentDate"),
                "time": item.get("startTime"),
                "status": item.get("status", "scheduled"),
                "raw": item,
            })

        # Original uploaded LifeObjects
        for item in life_objects:
            items.append({
                "id": item.get("id"),
                "category": "documents",
                "type": item.get("type", "document"),
                "title": item.get("title", item.get("vendor", "Document")),
                "subtitle": "LifeObject",
                "date": item.get("createdAt"),
                "status": "stored",
                "raw": item,
            })

        return {
            "success": True,
            "vault": {
                "lifeObjects": life_objects,
                "warranties": warranties,
                "renewals": renewals,
                "subscriptions": subscriptions,
                "appointments": appointments,
                "obligations": obligations,
                "items": items,
            },
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/upcoming")
def upcoming(user_id: str = Depends(require_user)):
    try:
        obligations = (
            get_user_items("DYNAMODB_OBLIGATIONS_TABLE", user_id)
        )

        warranties = (
            get_user_items("DYNAMODB_WARRANTIES_TABLE", user_id)
        )

        renewals = (
            get_user_items("DYNAMODB_RENEWALS_TABLE", user_id)
        )

        appointments = (
            get_user_items("DYNAMODB_APPOINTMENTS_TABLE", user_id)
        )

        items = []

        for obligation in obligations:
            if (obligation.get("status") != "open"):
                continue

            items.append({
                "id": obligation["id"],
                "type": "obligation",
                "title": obligation.get("title", "Upcoming obligation"),
                "date": obligation.get("dueDate"),
                "amount": obligation.get("amount"),
            })

        for warranty in warranties:
            if (warranty.get("status") != "active"):
                continue

            items.append({
                "id": warranty["id"],
                "type": "warranty",
                "title": (f"{warranty.get('productName', 'Product')} " "warranty"),
                "date": warranty.get("expiryDate"),
            })

        for renewal in renewals:
            if (renewal.get("status") != "upcoming"):
                continue

            items.append({
                "id": renewal["id"],
                "type": "renewal",
                "title": renewal.get("title", "Renewal"),
                "date": renewal.get("renewalDate"),
                "amount": renewal.get("amount"),
            })

        for appointment in appointments:
            if (appointment.get("status") != "scheduled"):
                continue

            items.append({
                "id": appointment["id"],
                "type": "appointment",
                "title": appointment.get("title", "Appointment"),
                "date": appointment.get("appointmentDate"),
                "time": appointment.get("startTime"),
                "location": appointment.get("location"),
            })

        return {
            "success": True,
            "items": items,
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/notifications")
def notifications(user_id: str = Depends(require_user)):
    try:
        return {
            "success": True,
            "notifications": build_notifications(user_id)
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/graph")
def graph(user_id: str = Depends(require_user)):
    try:
        return {
            "success": True,
            "graph": build_life_graph(user_id),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/daily-brief")
def daily_brief(user_id: str = Depends(require_user)):
    try:
        brief = (daily_brief_service.generate(user_id))

        return {
            "success": True,
            "brief": brief,
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/timeline")
def timeline(user_id: str = Depends(require_user)):
    try:
        return {
            "success": True,
            "items": build_timeline(user_id),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/autonomy")
def autonomy(user_id: str = Depends(require_user)):
    settings = (
        get_autonomy_settings(user_id)
    )

    return {
        "success": True,
        "settings": settings.model_dump(),
    }

@app.put("/autonomy")
def update_autonomy(
    settings: AutonomySettings,
    user_id: str = Depends(require_user),
):
    saved = save_autonomy_settings(
        user_id=user_id,
        settings=settings,
    )

    return {
        "success": True,
        "settings": saved,
    }

@app.post("/process-document")
def process_document(document: DocumentAnalysis, user_id: str = Depends(require_user)):
    try:
        result = lifeops.process_document(
            document=document,
            user_id=user_id,
        )

        return {
            "success": True,
            "result": result,
        }
    except Exception as error:
        print("LifeOps agent error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

@app.post("/decisions/{decision_id}/resolve")
def resolve_decision(decision_id: str, request: ResolveDecisionRequest, user_id: str = Depends(require_user)):
    table_name = os.getenv("DYNAMODB_DECISIONS_TABLE")

    if not table_name:
        raise HTTPException(status_code=500, detail=("Decision table is not configured"))

    table = dynamodb.Table(table_name)

    existing = table.get_item(
        Key={
            "id": decision_id
        }
    ).get("Item")

    if (not existing or existing.get("userId") != user_id):
        raise HTTPException(status_code=400, detail="Decision not found.")

    response = table.update_item(
        Key={
            "id": decision_id
        },
        UpdateExpression=(
            "SET #status = :status, "
            "selectedOption = :option, "
            "resolvedAt = :resolved"
        ),
        ExpressionAttributeNames={
            "#status": "status",
        },
        ExpressionAttributeValues={
            ":status": "resolved",
            ":option": request.option,
            ":resolved": __import__("datetime").datetime.now(
                __import__("datetime").timezone.utc
            ).isoformat(),
        },
        ReturnValues="ALL_NEW",
    )

    return {
        "success": True,
        "decision": response.get("Attributes"),
    }

@app.post("/ask")
def ask(request: AskLifeOpsRequest, user_id: str = Depends(require_user)):
    try:
        return {
            "success": True,

            **ask_lifeops(
                user_id=user_id,
                message=request.message,
                session_id=request.sessionId,
            ),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/command")
def command(request: CommandRequest, user_id: str = Depends(require_user)):
    try:
        result = (command_center.run(
            user_id=user_id,
            command=request.command,
        ))

        return {
            "success": True,
            "result": result.model_dump()
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))