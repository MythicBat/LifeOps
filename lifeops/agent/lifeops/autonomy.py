from .database import (
    clean_for_dynamodb,
    get_table,
    utc_now
)

from .models import (AutonomySettings)

DEFAULT_SETTINGS = (AutonomySettings())

def get_autonomy_settings(user_id: str) -> AutonomySettings:
    table = get_table("DYNAMODB_AUTONOMY_TABLE")

    response = table.get_item(
        Key={"userId": user_id}
    )

    item = response.get("Item")

    if not item:
        save_autonomy_settings(
            user_id=user_id,
            settings=DEFAULT_SETTINGS,
        )

        return DEFAULT_SETTINGS

    return AutonomySettings(
        everydayAdmin=item.get("everydayAdmin", "auto"),
        money=item.get("money", "ask"),
        appointments=item.get("appointments", "ask"),
        subscriptions=item.get("subscriptions", "ask"),
        documents=item.get("documents", "auto"),
        warranties=item.get("warranties", "auto"),
        renewals=item.get("renewals", "ask"),
    )

def save_autonomy_settings(
        user_id: str,
        settings: AutonomySettings,
) -> dict:
    table = get_table("DYNAMODB_AUTONOMY_TABLE")

    item = {
        "userId": user_id,
        **settings.model_dump(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return item
