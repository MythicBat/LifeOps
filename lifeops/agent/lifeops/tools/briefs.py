from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now
)

def save_brief(
        user_id: str,
        content: str
) -> dict:
    table = get_table("DYNAMODB_BRIEFS_TABLE")
    brief_id = new_id("brief")

    item = {
        "id": brief_id,
        "userId": user_id,
        "content": content,
        "createdAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return item
