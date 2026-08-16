from decimal import Decimal
from boto3.dynamodb.conditions import Key

from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now
)

def normalize_vendor(vendor:str) -> str:
    return (
        vendor.strip().lower()
            .replace(" premium", "")
            .replace(" pty ltd", "")
            .replace(" ltd", "")
    )

def find_latest_subscription(
        user_id: str,
        vendor: str,
) -> dict | None:
    table = get_table("DYNAMODB_SUBSCRIPTIONS_TABLE")

    user_vendor_key = (
        f"{user_id}#"
        f"{normalize_vendor(vendor)}"
    )

    response = table.query(
        IndexName=("UserVendorCreatedAtIndex"),
        KeyConditionExpression=(
            Key("userVendorKey").eq(user_vendor_key)
        ),
        ScanIndexForward=False,
        Limit=1,
    )

    items = response.get("Items", [])

    return (
        items[0] if items else None
    )

def record_subscription(
        user_id: str,
        vendor: str,
        amount: float,
        currency: str | None = None,
        document_id: str | None = None,
) -> dict:
    table = get_table("DYNAMODB_SUBSCRIPTIONS_TABLE")

    subscription_id = new_id("sub")

    item = {
        "id": subscription_id,
        "userId": user_id,
        "vendor": vendor,
        "vendorKey": normalize_vendor(vendor),
        "userVendorKey": (f"{user_id}#"
                          f"{normalize_vendor(vendor)}"),
        "amount": amount,
        "currency": currency or "AUD",
        "documentId": document_id,
        "createdAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "subscriptionId": subscription_id,
    }

def analyse_subscription_change(
        previous: dict | None,
        current_amount: float,
) -> dict:
    if not previous:
        return {
            "hasHistory": False,
            "changed": False,
            "previousAmount": None,
            "currentAmount": current_amount,
            "monthlyDifference": None,
            "annualImpact": None,
            "precentageChange": None,
        }

    previous_amount = float(previous["amount"])
    difference = (current_amount - previous_amount)
    changed = abs(difference) >= 0.01
    percentage = ((difference/previous_amount)*100 if previous_amount else 0)

    return {
        "hasHistory": True,
        "changed": changed,
        "previousAmount": round(previous_amount, 2),
        "currentAmount": round(current_amount, 2),
        "monthlyDifference": round(difference, 2),
        "annualImpact": round(difference * 12, 2),
        "percentageChange": round(percentage, 1),
    }