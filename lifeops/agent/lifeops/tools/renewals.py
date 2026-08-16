from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

def track_renewal(
        user_id: str,
        title: str,
        provider: str | None,
        renewal_date: str,
        amount: float | None = None,
        category: str = "other",
        document_id: str | None = None,
) -> dict:
    table = get_table("DYNAMODB_RENEWALS_TABLE")
    renewal_id = new_id("ren")

    item = {
        "id": renewal_id,
        "userId": user_id,
        "title": title,
        "provider": provider,
        "renewalDate": renewal_date,
        "amount": amount,
        "category": category,
        "status": "upcoming",
        "documentId": document_id,
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "renewalId": renewal_id,
    }