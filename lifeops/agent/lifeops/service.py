import os

from dotenv import load_dotenv
from strands.models import (BedrockModel)
from .models import (DocumentAnalysis)
from .observer import (LifeOpsObserver)
from .planner import (LifeOpsPlanner)
from .guardian import (evaluate_plan)
from .executor import (LifeOpsExecutor)
from .tools.subscriptions import (
    analyse_subscription_change,
    find_latest_subscription,
    record_subscription,
)
from .autonomy import (get_autonomy_settings)

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
        subscription_change = None

        planner_context = {}
        
        if subscription_change:
            planner_context["subscription"] = subscription_change
        plan = self.planner.plan(event, context=planner_context)

        autonomy_settings = (get_autonomy_settings(user_id))
        guardian = (evaluate_plan(plan, autonomy_settings))
        execution = (
            self.executor.execute(
                user_id=user_id,
                document=document,
                plan=plan,
                guardian=guardian,
                autonomy_settings=autonomy_settings,
                context=planner_context,
            )
        )

        if (document.vendor and document.total):
            vendor_lower = (document.vendor.lower())

            known_subscriptions = [
                "spotify",
                "netflix",
                "disney",
                "youtube",
                "amazon prime",
                "notion",
                "adobe",
                "dropbox",
                "icloud",
            ]

            is_subscription = any(vendor in vendor_lower for vendor in known_subscriptions)

            if is_subscription:
                previous = (find_latest_subscription(user_id=user_id, vendor=document.vendor))
                subscription_change = (analyse_subscription_change(previous=previous, current_amount=document.total))
                record_subscription(
                    user_id=user_id,
                    vendor=document.vendor,
                    amount=document.total,
                    currency=document.currency,
                    document_id=document.documentId,
                )

        return {
            "event": event.model_dump(),
            "plan": plan.model_dump(),
            "guardian": guardian.model_dump(),
            "execution": execution,
            "autonomy": autonomy_settings.model_dump(),
            "intelligence": {"subscription", subscription_change}
        }