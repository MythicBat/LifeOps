import os

from bedrock_agentcore.runtime import BedrockAgentCoreApp
from lifeops.service import LifeOpsService
from lifeops.models import DocumentAnalysis

app = BedrockAgentCoreApp()

lifeops = LifeOpsService()

@app.entrypoint
def invoke(payload: dict):
    """
    AgentCore Runtime entrypoint.

    Expected payload example:

    {
        "action": "process_document",
        "userId": "...",
        "document": {
            ...
        }
    }
    """

    action = payload.get("action")
    user_id = payload.get("userId")

    if not user_id:
        return {
            "success": False,
            "error": "userId is required.",
        }

    if action == "process_document":
        raw_document = payload.get("document")

        if not raw_document:
            return {
                "success": False,
                "error": "document is required."
            }

        document = DocumentAnalysis(**raw_document)
        result = lifeops.process_document(
            document=document,
            user_id=user_id,
        )

        return {
            "success": True,
            "result": result
        }

    return {
        "success": False,
        "error": f"Unknown action: {action}"
    }

if __name__ == "__main__":
    app.run()