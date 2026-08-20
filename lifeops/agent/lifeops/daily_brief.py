import json
import os

from strands import Agent
from strands.models import (BedrockModel)

from .dashboard import (get_user_items, get_dashboard_summary)
from .tools.briefs import (save_brief)

BRIEF_PROMPT = """
You are the LifeOps Daily Brief agent.

Create a very short morning operational brief.

The user should understand their day in under 20 seconds.

Use ONLY the authoritative data provided.

Structure:

1. Opening:
   - "You're clear today." if nothing urgent
   - otherwise briefly state what needs attention.

2. Handled:
   Mention at most 3 useful things LifeOps recently handled.

3. Coming up:
   Mention at most 3 important upcoming items.

4. Needs you:
   Mention pending decisions only.

Do not overwhelm the user.

Do not mention database terminology, LifeObjects, DynamoDB or agent runs.

Do not event anything.

Tone:
Calm, premium, concise.
"""

class DailyBriefService:
    def __init__(self):
        region = os.getenv("AWS_REGION")
        model_id = os.getenv("BEDROCK_MODEL_ID")

        if not model_id:
            raise RuntimeError("BEDROCK_MODEL_ID is missing.")

        self.agent = Agent(
            model=BedrockModel(
                model_id=model_id,
                region_name=region,
                temperature=0.1,
            ),
            system_prompt=BRIEF_PROMPT,
        )

    def generate(self, user_id: str) -> str:
        dashboard = (get_dashboard_summary(user_id))

        obligations = (
            get_user_items(
                "DYNAMODB_OBLIGATIONS_TABLE",
                user_id,
            )
        )

        renewals = (
            get_user_items(
                "DYNAMODB_RENEWALS_TABLE",
                user_id,
            )
        )

        appointments = (
            get_user_items(
                "DYNAMODB_APPOINTMENTS_TABLE",
                user_id,
            )
        )

        warranties = (
            get_user_items(
                "DYNAMODB_WARRANTIES_TABLE",
                user_id,
            )
        )

        decisions = (
            get_user_items(
                "DYNAMODB_DECISIONS_TABLE",
                user_id,
            )
        )

        state = {
            "recentActivity": dashboard["recentRuns"],
            "obligations": obligations,
            "renewals": renewals,
            "appointments": appointments,
            "warranties": warranties,
            "pendingDecisions": [
                item for item in decisions if item.get("status") == "pending"
            ],
        }

        prompt = f"""
Create today's LifeOps brief.

AUTHORITATIVE LIFE STATE:

{json.dumps(
    state,
    indent=2,
    default=str
)}
"""
        response = (self.agent(prompt))
        content = str(response)

        save_brief(
            user_id=user_id,
            content=content
        )

        return content
