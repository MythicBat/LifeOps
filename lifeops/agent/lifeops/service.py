import os

from dotenv import load_dotenv
from strands.models import (BedrockModel)
from .models import (DocumentAnalysis)
from .observer import (LifeOpsObserver)
from .planner import (LifeOpsPlanner)
from .guardian import (evaluate_plan)
from .executor import (LifeOpsExecutor)

load_dotenv()

class LifeOpsService:
    def __init__(self):
        region = os.getenv("AWS_REGION")

        model_id = os.getenv("BEDROCK_MODEL_ID")

        if not region:
            raise RuntimeError("AWS_REGION is missing.")
        if not model_id:
            raise RuntimeError("BEDROCK_MODEL_ID is missing.")

        self.model = BedrockModel(
            model_id=model_id,
            region_name=region,
            temperature=0.1,
        )

        self.observer = LifeOpsObserver(self.model)
        self.planner = LifeOpsPlanner(self.model)
        self.executor = LifeOpsExecutor()

    def process_document(self, document: DocumentAnalysis, user_id: str = "demo-user"):
        event = self.observer.observe(document)
        plan = self.planner.plan(event)
        guardian = (evaluate_plan(plan))
        execution = (
            self.executor.execute(
                user_id=user_id,
                document=document,
                plan=plan,
                guardian=guardian,
            )
        )

        return {
            "event": event.model_dump(),
            "plan": plan.model_dump(),
            "guardian": guardian.model_dump(),
            "execution": execution,
        }