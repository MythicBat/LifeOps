from strands import tool

from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

@tool
def create_life_object(
    user_id: str,
    object_type: str,
    title: str,
    source: str,
    metadata: dict,
) -> dict:
    """
    Create a persistent LifeOps LifeObject.

    Use this for bills, receipts,
    subscriptions, appointments,
    warranties, renewals, and other
    everyday-life objects.
    """

    table = get_table("DYNAMBODB_LIFEOBJECTS_TABLE")
    object_id = new_id("obj")
    item = {
        "id": object_id,
        "userId": user_id,
        "type": object_type,
        "title": title,
        "status": "active",
        "source": source,
        "metadata": metadata,
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "objectId": object_id,
        "message": "LifeObject created.",
    }