import json
import os

from strands import Agent
from strands.models import (BedrockModel)

from .dashboard import (get_user_items, get_dashboard_summary)
from .tools.briefs import (save_brief)

BRIEF_PROMPT = """
You are the LifeOps Daily Brief agent.

Create a short personal-life operational brief
using ONLY the authoritative state provided.

This is a consumer life-management product,
not a workplace productivity assistant.

Never invent:
- meetings
- team syncs
- staff
- clients
- system audits
- security updates
- operational guidelines
- tasks that are not present in the provided state

Only mention actual:
- bills
- subscriptions
- appointments
- renewals
- warranties
- decisions
- actions LifeOps really handled

If a section has no real items, omit it.

Return plain text only.

Do NOT use markdown.
Do NOT use:
**bold**
# headings
bullet markdown symbols

Use this style:

You're clear today.

Handled
Electricity bill tracked and reminder scheduled.

Coming up
Dental appointment on 27 August at 3:30 PM.

Needs you
Spotify increased by $2 per month.

Keep the whole brief concise enough to read
in roughly 15-20 seconds.

If nothing meaningful needs attention, say:
"You're clear today. LifeOps is watching the routine things."
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
            "recentActivity": [
                {
                    "summary": run.get("summary"),
                    "actions": run.get("actions", []),
                    "createdAt": run.get("createdAt"),
                }

                for run in dashboard["recentRuns"]
            ],
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
