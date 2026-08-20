import json
import os
import uuid

from strands import Agent
from bedrock_agentcore.memory.integrations.strands.config import ( AgentCoreMemoryConfig )
from bedrock_agentcore.memory.integrations.strands.session_manager import ( AgentCoreMemorySessionManager )

from .dashboard import ( get_user_items )

ASK_LIFEOPS_PROMPT = """
You are LifeOps.

You are a calm personal operations agent.

Your job is not to chat for the sake of chatting.
Your job is to help the user understand and manage the operational parts of their life.

You may receive two forms of context:

1. AUTHORITATIVE LIFE STATE
   Facts retrieved from LifeOps databases.

2. MEMORY
   Preferences and conversational context learned from previous conversations.

IMPORTANT RULES:

- Treat AUTHORITATIVE LIFE STATE as the source of truth for dates, amounts, appointments,
  warranties, subscriptions, renewals, and decisions.

- Never invent a bill, appointment, renewal, warranty, subscription or deadline.

- Memory may help personalize recommendations, but must never override authoritative data.

- Never claim an action has been completed unless the LifeOps execution system confirms it.

- If something requires user approval, clearly explain the decision instead of pretending to perform it.

- Be concise.

- Prioritize what actually needs attention.

- If everything is under control, say so.

Your tone should feel like a highly competent personal chief of staff.
"""

def build_life_state(user_id: str) -> dict:
    obligations = get_user_items("DYNAMODB_OBLIGATIONS_TABLE", user_id)

    decisions = get_user_items("DYNAMODB_DECISIONS_TABLE", user_id)

    subscriptions = get_user_items("DYNAMODB_SUBSCRIPTIONS_TABLE", user_id)

    warranties = get_user_items("DYNAMODB_WARRANTIES_TABLE", user_id)

    renewals = get_user_items("DYNAMODB_RENEWALS_TABLE", user_id)

    appointments = get_user_items("DYNAMODB_APPOINTMENTS_TABLE", user_id)

    pending_decisions = [
        item for item in decisions if item.get("status") == "pending"
    ]

    active_obligations = [
        item for item in obligations if item.get("status") == "open"
    ]

    active_warranties = [
        item for item in warranties if item.get("status") == "active"
    ]

    upcoming_renewals = [
        item for item in renewals if item.get("status") == "upcoming"
    ]

    scheduled_appointments = [
        item for item in appointments if item.get("status") == "scheduled"
    ]

    return {
        "obligations": active_obligations,
        "decisions": pending_decisions,
        "subscriptions": subscriptions,
        "warranties": active_warranties,
        "renewals": upcoming_renewals,
        "appointments": scheduled_appointments,
    }

def ask_lifeops(
        user_id: str,
        message: str,
        session_id: str | None = None
) -> dict:
    memory_id = os.getenv("AGENTCORE_MEMORY_ID")
    region = os.getenv("AWS_REGION")

    if not memory_id:
        raise RuntimeError("AGENTCORE_MEMORY_ID is missing.")

    if not session_id:
        session_id = str(uuid.uuid4())

    life_state = build_life_state(user_id)

    memory_config = (
        AgentCoreMemoryConfig(
            memory_id=memory_id,
            actor_id=user_id,
            session_id=session_id,
        )
    )

    prompt = f"""
AUTHORITATIVE LIFE STATE

{json.dumps(
    life_state,
    indent=2,
    default=str
)}

USER MESSAGE:

{message}
"""
    with AgentCoreMemorySessionManager(
        agentcore_memory_config=memory_config,
        region_name=region,
    ) as session_manager:
        agent = Agent(
            system_prompt=ASK_LIFEOPS_PROMPT,
            session_manager=session_manager,
        )

        result = agent(prompt)

    text = str(result)

    return {
        "answer": text,
        "sessionId": session_id,
    }