import json

from strands import Agent
from .models import (
    LifeOpsPlan,
    ObservedEvent,
)
from .prompts import (PLANNER_PROMPT)

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
"""
        response = self.agent(prompt)
        text = str(response).strip()
        text = text.removeprefix("```json")
        text = text.removeprefix("```")
        text = text.removesuffix("```")
        data = json.loads(text.strip())

        return LifeOpsPlan(**data)