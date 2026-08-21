from typing import Literal
from pydantic import BaseModel
from .models import (LifeOpsPlan, AutonomySettings)

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

ACTION_CATEGORY = {
    "create_life_object":
        "documents",

    "archive_receipt":
        "documents",

    "create_obligation":
        "everydayAdmin",

    "schedule_reminder":
        "everydayAdmin",

    "track_subscription":
        "subscriptions",

    "track_warranty":
        "warranties",

    "track_renewal":
        "renewals",

    "add_appointment":
        "appointments",

    "create_decision":
        "everydayAdmin",

    "no_action":
        "everydayAdmin",
}

def evaluate_plan(
    plan: LifeOpsPlan,
    settings: AutonomySettings,
) -> GuardianDecision:

    action_types = {
        action.type
        for action in plan.actions
    }

    # --------------------------------
    # HARD SAFETY BOUNDARY
    # --------------------------------

    if (
        action_types
        & HIGH_RISK_ACTIONS
    ):
        return GuardianDecision(
            level="confirm",
            permitted=False,

            reason=(
                "This plan contains "
                "a consequential action "
                "that always requires "
                "explicit approval."
            ),
        )

    # --------------------------------
    # USER AUTONOMY SETTINGS
    # --------------------------------

    categories = set()

    for action_type in action_types:

        category = (
            ACTION_CATEGORY.get(
                action_type
            )
        )

        if category:
            categories.add(
                category
            )

    modes = []

    settings_dict = (
        settings.model_dump()
    )

    for category in categories:

        mode = settings_dict.get(
            category,
            "ask",
        )

        modes.append(
            mode
        )

    # OBSERVE is the most restrictive.
    if "observe" in modes:

        return GuardianDecision(
            level="decision",
            permitted=False,

            reason=(
                "Your autonomy settings "
                "allow LifeOps to observe "
                "this category but not "
                "execute actions."
            ),
        )

    # ASK means preparation is okay,
    # but execution should wait.
    if "ask" in modes:

        # Creating a Decision is itself
        # safe and needs to be persisted.
        if (
            action_types
            == {
                "create_decision"
            }
        ):
            return GuardianDecision(
                level="decision",
                permitted=True,

                reason=(
                    "LifeOps may prepare "
                    "the decision for you."
                ),
            )

        return GuardianDecision(
            level="decision",
            permitted=False,

            reason=(
                "Your autonomy settings "
                "require LifeOps to ask "
                "before acting in this "
                "category."
            ),
        )

    # All relevant categories = AUTO.
    return GuardianDecision(
        level="auto",
        permitted=True,

        reason=(
            "Your autonomy settings "
            "allow LifeOps to handle "
            "these safe actions "
            "automatically."
        ),
    )

def evaluate_action(
        action_type: str,
        settings: AutonomySettings,
) -> GuardianDecision:
    if (action_type in HIGH_RISK_ACTIONS):
        return GuardianDecision(
            level="confirm",
            permitted=False,
            reason=(
                "This action always requires explicit approval."
            ),
        )

    # Creating a decision is always safe
    if (action_type == "create_decision"):
        return GuardianDecision(
            level="decision",
            permitted=True,
            reason=(
                "LifeOps may prepare a decision for you."
            ),
        )

    category = (ACTION_CATEGORY.get(action_type, "everydayAdmin"))
    mode = (settings.model_dump().get(category, "ask"))

    if mode == "auto":
        return GuardianDecision(
            level="auto",
            permitted=True,
            reason=(
                f"{category} is configured for automatic handling."
            ),
        )

    if mode == "ask":
        return GuardianDecision(
            level="decision",
            permitted=False,
            reason=(
                f"{category} is confiured to ask first."
            ),
        )

    return GuardianDecision(
        level="decision",
        permitted=False,
        reason=(
            f"{category} is configured for observation only."
        ),
    )