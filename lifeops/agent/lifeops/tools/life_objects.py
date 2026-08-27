from strands import tool

from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

from boto3.dynamodb.conditions import Attr

def document_already_processed(
        user_id: str,
        document_id: str,
) -> bool:
    table = get_table("DYNAMODB_LIFEOBJECTS_TABLE")

    response = table.scan(
        FilterExpression=(
            Attr("userId").eq(user_id) &
            Attr("documentId").eq(document_id)
        )
    )

    return bool(
        response.get("Items")
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

    table = get_table("DYNAMODB_LIFEOBJECTS_TABLE")
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