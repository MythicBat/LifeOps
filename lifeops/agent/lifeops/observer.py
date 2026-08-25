import json

from strands import Agent

from .models import (
    DocumentAnalysis,
    ObservedEvent,
)

from .prompts import (
    OBSERVER_PROMPT,
    AUTHORITATIVE_DATA_RULES,
    JSON_OUTPUT_RULES,
)

from .tools.subscriptions import (find_latest_subscription)
from .parsing import (AgentOutputError, extract_json_object)

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

{AUTHORITATIVE_DATA_RULES}

{JSON_OUTPUT_RULES}
"""
        
        try:

            response = self.agent(prompt)
            data = extract_json_object(response)

            event = ObservedEvent(**data)

            event.summary = (event.summary[:400])

            return event
        except Exception as error:
            print("Observer fallback:", error)

            return ObservedEvent(
                eventType="document_detected",
                category="general",
                confidence=0.0,
                summary=(
                    f"Document from "
                    f"{document.vendor or 'unknown source'}"
                ),
                requiresAttention=False,
            )