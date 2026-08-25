import json
import re
from typing import Any

class AgentOutputError(ValueError):
    pass

def extract_json_object(
        raw: Any
) -> dict:
    text = str(raw).strip()

    if not text:
        raise AgentOutputError("Agent returned an empty response.")

    # Remove common markdown fences.
    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    # First try the entire response
    try:
        parsed = json.loads(text)

        if not parsed.isinstance(parsed, dict):
            raise AgentOutputError("Expected a JSON object")

        return parsed
    except json.JSONDecodeError:
        pass

    # Fallback:
    # to locate the first plausible JSON object in the response.
    start = text.find(
        "{"
    )
    end = text.rfind(
        "}"
    )

    if (start == -1 or end == -1 or end <= start):
        raise AgentOutputError("No JSON object found in agent response.")

    candidate = text[
        start: end + 1
    ]

    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as error:
        raise AgentOutputError("Agent returned invalid JSON.") from error

    if not isinstance(parsed, dict):
        raise AgentOutputError("Expected a JSON object.")

    return parsed