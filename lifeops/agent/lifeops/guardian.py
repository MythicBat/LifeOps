from typing import Literal
from pydantic import BaseModel
from .models import (LifeOpsPlan)

class GuardianDecision(BaseModel):
    level: Literal[
        "auto",
        "decision",
        "confirm",
    ]
    permitted: bool
    reason: str

AUTO_ACTIONS = {
    "create_life_object",
    "create_obligation",
    "schedule_reminder",
    "archive_receipt",
    "track_subscription",
    "track_warranty",
    "track_renewal",
    "add_appointment",
    "create_decision",
    "no_action",
}

HIGH_RISK_ACTIONS = {
    "make_payment",
    "cancel_service",
    "submit_form",
    "sign_agreement",
    "share_sensitive_data",
}

def evaluate_plan(plan: LifeOpsPlan) -> GuardianDecision:
    action_types = {
        action.type for action in plan.actions
    }

    if (action_types & HIGH_RISK_ACTIONS):
        return GuardianDecision(
            level="confirm",
            permitted=False,
            reason=("The plan contains " "a consequential action."),
        )

    if ("create_decision" in action_types):
        return GuardianDecision(
            level="decision",
            permitted=True,
            reason=("LifeOps may prepare this decision, but the user must choose the outcome."),
        )

    if action_types.issubset(AUTO_ACTIONS):
        return GuardianDecision(
            level="auto",
            permitted=True,
            reason=("All actions are " "low-risk LifeOps " "operations."),
        )

    return GuardianDecision(
        level="confirm",
        permitted=False,
        reason=("The plan contains an " "unknown action."),
    )