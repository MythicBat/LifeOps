import json
import os

from strands import Agent
from strands.models import BedrockModel

from .dashboard import get_user_items
from .models import (
    CommandMetric,
    LifeOpsCommandResult,
)
from .parsing import extract_json_object
from .prompts import (
    AUTHORITATIVE_DATA_RULES,
    JSON_OUTPUT_RULES,
)


COMMAND_PROMPT = f"""
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
- Do not invent financial metrics.
- Do not invent savings.
- Do not change deterministic counts supplied
  by application code.

For "Clean up my month":

1. Review pending decisions.
2. Review open obligations.
3. Review upcoming renewals.
4. Review appointments.
5. Review warranties.
6. Review subscriptions.
7. Summarise what is already under control.
8. Highlight only the items the user must act on.

Return exactly this JSON structure:

{{
  "title": "string",
  "summary": "string",
  "reviewedCount": 0,
  "handledCount": 0,
  "attentionCount": 0,
  "metrics": [],
  "items": [
    {{
      "id": null,
      "type": "decision",
      "title": "string",
      "description": "string",
      "value": null,
      "actionLabel": "Review",
      "decisionId": null
    }}
  ]
}}

Allowed item types:

- handled
- attention
- decision
- upcoming
- saving
- info

{AUTHORITATIVE_DATA_RULES}

{JSON_OUTPUT_RULES}
"""


class CommandCenterService:
    def __init__(self):
        region = os.getenv(
            "AWS_REGION",
            "ap-southeast-2",
        )

        model_id = os.getenv(
            "BEDROCK_MODEL_ID"
        )

        if not model_id:
            raise RuntimeError(
                "BEDROCK_MODEL_ID is missing."
            )

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


    def run(
        self,
        user_id: str,
        command: str,
    ) -> LifeOpsCommandResult:

        state = self.build_state(
            user_id
        )


        # --------------------------------
        # DETERMINISTIC COUNTS
        # --------------------------------

        reviewed_count = sum([
            len(
                state[
                    "obligations"
                ]
            ),
            len(
                state[
                    "decisions"
                ]
            ),
            len(
                state[
                    "subscriptions"
                ]
            ),
            len(
                state[
                    "warranties"
                ]
            ),
            len(
                state[
                    "renewals"
                ]
            ),
            len(
                state[
                    "appointments"
                ]
            ),
        ])


        attention_count = len(
            state[
                "decisions"
            ]
        )


        # Count recent successful handled actions
        handled_count = 0

        for run in state[
            "recentRuns"
        ]:
            actions = (
                run.get(
                    "actions",
                    []
                )
                or []
            )

            handled_count += len(
                actions
            )


        # --------------------------------
        # DETERMINISTIC FINANCIAL IMPACT
        # --------------------------------

        known_annual_impact = 0.0


        for decision in state[
            "decisions"
        ]:

            metadata = (
                decision.get(
                    "metadata",
                    {}
                )
                or {}
            )

            annual = metadata.get(
                "annualImpact"
            )

            if annual is None:
                continue

            try:
                annual_value = float(
                    annual
                )

            except (
                TypeError,
                ValueError,
            ):
                continue

            if annual_value > 0:
                known_annual_impact += (
                    annual_value
                )


        deterministic_metrics = {
            "reviewedCount":
                reviewed_count,

            "handledCount":
                handled_count,

            "attentionCount":
                attention_count,

            "knownAnnualImpact":
                round(
                    known_annual_impact,
                    2,
                ),
        }


        # --------------------------------
        # MODEL
        # --------------------------------

        prompt = f"""
USER COMMAND:

{command}


AUTHORITATIVE LIFE STATE:

{json.dumps(
    state,
    indent=2,
    default=str,
)}


DETERMINISTIC METRICS:

{json.dumps(
    deterministic_metrics,
    indent=2,
)}


The values in DETERMINISTIC METRICS are authoritative.

Do not change:
- reviewedCount
- handledCount
- attentionCount

Do not create financial metrics that are not
present in DETERMINISTIC METRICS.

If knownAnnualImpact is 0, do not claim there
are savings or annual financial impact.
"""


        response = self.agent(
            prompt
        )


        data = extract_json_object(
            response
        )


        result = LifeOpsCommandResult(
            **data
        )


        # --------------------------------
        # OVERRIDE MODEL-CONTROLLED FACTS
        # --------------------------------

        result.reviewedCount = (
            reviewed_count
        )

        result.handledCount = (
            handled_count
        )

        result.attentionCount = (
            attention_count
        )


        # --------------------------------
        # BUILD METRICS OURSELVES
        # --------------------------------

        result.metrics = []


        if attention_count > 0:
            result.metrics.append(
                CommandMetric(
                    label=
                        "Needs you",

                    value=
                        str(
                            attention_count
                        ),
                )
            )


        if known_annual_impact > 0:
            result.metrics.append(
                CommandMetric(
                    label=
                        "Known annual impact",

                    value=(
                        f"${known_annual_impact:.2f}/year"
                    ),
                )
            )


        # --------------------------------
        # UI-SAFETY LIMITS
        # --------------------------------

        result.title = (
            result.title[
                :120
            ]
        )

        result.summary = (
            result.summary[
                :600
            ]
        )


        for item in result.items:
            item.title = (
                item.title[
                    :120
                ]
            )

            if item.description:
                item.description = (
                    item.description[
                        :700
                    ]
                )


        return result