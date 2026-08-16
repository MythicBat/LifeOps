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

lifeops = LifeOpsService()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "lifeops-agent",
    }

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