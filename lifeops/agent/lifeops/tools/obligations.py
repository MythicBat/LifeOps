from strands import tool
from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

@tool
def create_obligation(
    user_id: str,
    life_object_id: str,
    title: str,
    due_date: str,
    amount: float = 0,
) -> dict:
    """
    Create a LifeOps obligation
    associated with a LifeObject.

    Use this for bills, deadlines,
    renewals, appointments and
    other time-bound commitments.
    """

    table = get_table("DYNAMODB_OBLIGATIONS_TABLE")
    obligation_id = new_id("obi")
    item = {
        "id": obligation_id,
        "userId": user_id,
        "lifeObjectId": life_object_id,
        "title": title,
        "dueDate": due_date,
        "amount": amount,
        "status": "open",
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "obligationId": obligation_id,
        "message": "Obligation created.",
    }