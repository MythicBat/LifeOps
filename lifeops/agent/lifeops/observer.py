import json

from strands import Agent

from .models import (
    DocumentAnalysis,
    ObservedEvent,
)

from .prompts import (
    OBSERVER_PROMPT,
)

from .tools.subscriptions import (find_latest_subscription)

class LifeOpsObserver:
    def __init__(
        self,
        model,
    ):
        self.agent = Agent(
            model=model,
            system_prompt=
                OBSERVER_PROMPT,
        )

    def observe(
        self,
        document:
            DocumentAnalysis,
    ) -> ObservedEvent:

        prompt = f"""
Analyse this LifeOps document event:

{document.model_dump_json(indent=2)}

Return only valid JSON matching:

{{
  "eventType": "...",
  "title": "...",
  "summary": "...",
  "confidence": 0.0
}}
"""

        response = self.agent(prompt)
        text = str(response).strip()
        text = text.removeprefix(
            "```json"
        )
        text = text.removeprefix(
            "```"
        )
        text = text.removesuffix(
            "```"
        )
        data = json.loads(
                text.strip()
            )

        return ObservedEvent(
            **data
        )