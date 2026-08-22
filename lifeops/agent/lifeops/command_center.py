import json
import os

from strands import Agent
from strands.models import BedrockModel

from .dashboard import (get_user_items)
from .models import (LifeOpsCommandResult)

COMMAND_PROMPT = """
You are the LifeOps Command Center.

You receive authoritative operational state
about a user's life.

Your job is to turn a command into a concise
structured operational result.

IMPORTANT:

- Use only the provided state.
- Never invent bills, appointments, subscriptions,
  renewals, warranties or decisions.
- Do not claim an external action happened unless
  the state confirms it.
- Prefer short summaries.
- Surface only meaningful things.
- Routine items already handled should not become
  unnecessary alerts.
- Pending decisions should be clearly separated.
- Financial calculations provided in state are
  authoritative. Do not recalculate or guess them.

For "Clean up my month":

1. Review pending decisions.
2. Review open obligations.
3. Review upcoming renewals.
4. Review appointments.
5. Review warranties.
6. Review subscriptions.
7. Summarise what is already under control.
8. Highlight only the items the user must act on.

Return ONLY valid JSON matching:

{
  "title": "...",
  "summary": "...",
  "reviewedCount": 0,
  "handledCount": 0,
  "attentionCount": 0,
  "metrics": [
    {
      "label": "...",
      "value": "..."
    }
  ],
  "items": [
    {
      "id": "...",
      "type": "decision",
      "title": "...",
      "description": "...",
      "value": "...",
      "actionLabel": "Review",
      "decisionId": "..."
    }
  ]
}
"""

class CommandCenterService:
    def __init__(self):
        region = os.getenv("AWS_REGION")
        model_id = os.getenv("BEDROCK_MODEL_ID")

        if not model_id:
            raise RuntimeError("BEDROCK ID is missing.")

        self.agent = Agent(
            model=BedrockModel(
                model_id=model_id,
                region_name=region,
                temperature=0.1,
            ),
            system_prompt=COMMAND_PROMPT,
        )

    def build_state(
        self,
        user_id: str,
    ) -> dict:

        obligations = get_user_items(
            "DYNAMODB_OBLIGATIONS_TABLE",
            user_id,
        )

        decisions = get_user_items(
            "DYNAMODB_DECISIONS_TABLE",
            user_id,
        )

        subscriptions = get_user_items(
            "DYNAMODB_SUBSCRIPTIONS_TABLE",
            user_id,
        )

        warranties = get_user_items(
            "DYNAMODB_WARRANTIES_TABLE",
            user_id,
        )

        renewals = get_user_items(
            "DYNAMODB_RENEWALS_TABLE",
            user_id,
        )

        appointments = get_user_items(
            "DYNAMODB_APPOINTMENTS_TABLE",
            user_id,
        )

        runs = get_user_items(
            "DYNAMODB_AGENT_RUNS_TABLE",
            user_id,
        )

        return {
            "obligations": [
                item
                for item in obligations
                if item.get("status") == "open"
            ],

            "decisions": [
                item
                for item in decisions
                if item.get("status") == "pending"
            ],

            "subscriptions":
                subscriptions,

            "warranties": [
                item
                for item in warranties
                if item.get("status") == "active"
            ],

            "renewals": [
                item
                for item in renewals
                if item.get("status") == "upcoming"
            ],

            "appointments": [
                item
                for item in appointments
                if item.get("status") == "scheduled"
            ],

            "recentRuns":
                sorted(
                    runs,
                    key=lambda item:
                        item.get(
                            "createdAt",
                            "",
                        ),
                    reverse=True,
                )[:10],
        }

    def run(self, user_id: str, command: str) -> LifeOpsCommandResult:
        state = self.build_state(user_id)
        reviewed_count = sum([
            len(state["obligations"]),
            len(state["decisions"]),
            len(state["subscriptions"]),
            len(state["warranties"]),
            len(state["renewals"]),
            len(state["appointments"]),
        ])
        attention_count = len(state["decisions"])

        prompt = f"""
USER COMMAND:

{command}

AUTHORITATIVE LIFE STATE:

{json.dumps(
    state,
    indent=2,
    default=str
)}
"""
        response = self.agent(prompt)

        text = str(response).strip()

        text = text.removeprefix("```json")

        text = text.removeprefix("```")

        text.removesuffix("```")

        data = json.loads(text.strip())

        result = (LifeOpsCommandResult(**data))

        result.reviewedCount = (reviewed_count)
        result.attentionCount = (attention_count)

        return result