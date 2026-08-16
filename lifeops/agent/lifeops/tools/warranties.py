from datetime import (datetime, timedelta)

from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

def calculate_warranty_expiry(
        purchase_date: str,
        months: int = 12,
) -> str | None:
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%d-%m-%Y",
    ]

    parsed = None

    for fmt in formats:
        try:
            parsed = datetime.strptime(purchase_date, fmt)
            break
        except ValueError:
            continue

    if not parsed:
        return None

    # Good enough for the first version
    expiry = (
        parsed + timedelta(days=months * 30)
    )

    return expiry.strftime("%Y-%m-%d")

def track_warranty(
        user_id: str,
        product_name: str,
        vendor: str | None,
        purchase_date: str,
        purchase_amount: float | None,
        warranty_months: int = 12,
        document_id: str | None = None
) -> dict:
    table = get_table("DYNAMODB_WARRANTIES_TABLE")
    warranty_id = new_id("war")

    expiry = (
        calculate_warranty_expiry(purchase_date, warranty_months)
    )

    item = {
        "id": warranty_id,
        "userId": user_id,
        "productName": product_name,
        "vendor": vendor,
        "purchaseDate": purchase_date,
        "purchasedAmount": purchase_amount,
        "warrantyMonths": warranty_months,
        "expiryDate": expiry,
        "status": "active",
        "documentId": document_id,
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "warrantyId": warranty_id,
        "expiryDate": expiry,
    }

def warranty_reminder_time(expiry_date: str) -> str | None:
    try:
        parsed = datetime.strptime(expiry_date, "%Y-%m-%d")
    except ValueError:
        return None

    reminder = (parsed - timedelta(days=30))

    reminder = reminder.replace(
        hour=9,
        minute=0,
        second=0,
    )

    return reminder.strftime("%Y-%m-%dT%H:%M:%S")