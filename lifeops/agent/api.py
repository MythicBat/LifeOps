import os
import boto3

from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from lifeops.models import DocumentAnalysis
from lifeops.service import LifeOpsService

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