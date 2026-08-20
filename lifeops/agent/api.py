import os
import boto3

from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from lifeops.models import DocumentAnalysis
from lifeops.service import LifeOpsService
from lifeops.dashboard import (get_dashboard_summary, get_user_items)
from lifeops.ask_agent import ( ask_lifeops )
from lifeops.life_graph import ( build_life_graph )

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
    userId: str = ("demo-user")
    sessionId: (str | None) = None

region = os.getenv("AWS_REGION")
dynamodb = boto3.resource("dynamodb", region_name=region)

lifeops = LifeOpsService()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "lifeops-agent",
    }

@app.get("/decisions")
def get_decisions(user_id: str = "demo-user"):
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
def dashboard(user_id: str = "demo-user"):
    try:
        return {
            "success": True,
            "dashboard": get_dashboard_summary(user_id),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/vault")
def vault(user_id: str = "demo-user"):
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

        return {
            "success": True,
            "vault": {
                "lifeObjects": life_objects,
                "warranties": warranties,
                "renewals": renewals,
                "subscriptions": subscriptions,
                "appointments": appointments,
            },
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/upcoming")
def upcoming(user_id: str = "demo-user"):
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

@app.get("/graph")
def graph(user_id: str = "demo-user"):
    try:
        return {
            "success": True,
            "graph": build_life_graph(user_id),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/process-document")
def process_document(document: DocumentAnalysis):
    try:
        result = lifeops.process_document(
            document=document,
            user_id="demo-user",
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
def resolve_decision(decision_id: str, request: ResolveDecisionRequest):
    table_name = os.getenv("DYNAMODB_DECISIONS_TABLE")

    if not table_name:
        raise HTTPException(status_code=500, detail=("Decision table is not configured"))

    table = dynamodb.Table(table_name)

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
def ask(request: AskLifeOpsRequest):
    try:
        return {
            "success": True,

            **ask_lifeops(
                user_id=request.userId,
                message=request.message,
                session_id=request.sessionId,
            ),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))