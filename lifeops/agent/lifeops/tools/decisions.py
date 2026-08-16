from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

def create_decision(
        user_id: str,
        title: str,
        description: str,
        category: str,
        options: list[str],
        metadata: dict | None = None,
) -> dict:
    table = get_table("DYNAMODB_DECISIONS_TABLE")
    decision_id = new_id("dec")

    item = {
        "id": decision_id,
        "userId": user_id,
        "title": title,
        "description": description,
        "category": category,
        "options": options,
        "status": "pending",
        "metadata": (metadata or {}),
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "decisionId": decision_id,
        "status": "pending",
    }