import json

from strands import Agent
from .models import (
    LifeOpsPlan,
    ObservedEvent,
)
from .prompts import (PLANNER_PROMPT, AUTHORITATIVE_DATA_RULES, JSON_OUTPUT_RULES)
from .parsing import (extract_json_object)

class LifeOpsPlanner:
    def __init__(self, model):
        self.agent = Agent(
            model=model,
            system_prompt=PLANNER_PROMPT,
        )

    def plan(self, event: ObservedEvent, context: dict | None = None) -> LifeOpsPlan:
        prompt = f"""
Create a LifeOps action plan for:

EVENT:
{event.model_dump_json(indent=2)}

ADDITIONAL CONTEXT:
{json.dumps(context or {}, indent=2)}

Return only valid JSON matching:

{{
    "goal": "...",
    "riskLevel": "low",
    "requiresUser": false,
    "actions": [
        {{
            "type": "create_life_object",
            "reason": "..."
        }}
    ],
    "briefing": "..."
}}

{AUTHORITATIVE_DATA_RULES}

{JSON_OUTPUT_RULES}
"""
        response = self.agent(prompt)
        data = extract_json_object(response)

        plan = LifeOpsPlan(**data)
        plan.goal = (plan.goal[:160])
        plan.briefing = (plan.briefing[:700])

        for action in plan.actions:
            if action.reason:
                action.reason = (action.reason[:400])

        return plan