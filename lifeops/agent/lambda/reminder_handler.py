import json

def handler(event, context):
    print(
        json.dumps(
            {
                "message": "LifeOps reminder fired",
                "event": event,
            }
        )
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"success": True})
    }