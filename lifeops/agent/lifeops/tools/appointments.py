from ..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

from boto3.dynamodb.conditions import (Attr)


def add_appointment(
    user_id: str,
    title: str,
    appointment_date: str,
    start_time: str,
    end_time: str | None = None,
    location: str | None = None,
    provider: str | None = None,
    document_id: str | None = None,
) -> dict:

    table = get_table(
        "DYNAMODB_APPOINTMENTS_TABLE"
    )

    appointment_id = new_id(
        "apt"
    )

    item = {
        "id":
            appointment_id,

        "userId":
            user_id,

        "title":
            title,

        "appointmentDate":
            appointment_date,

        "startTime":
            start_time,

        "endTime":
            end_time,

        "location":
            location,

        "provider":
            provider,

        "status":
            "scheduled",

        "documentId":
            document_id,

        "createdAt":
            utc_now(),

        "updatedAt":
            utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(
            item
        )
    )

    return {
        "success":
            True,

        "appointmentId":
            appointment_id,
    }

def find_appointment_conflicts(
        user_id: str,
        appointment_date: str,
        start_time: str,
) -> list[dict]:
    table = get_table("DYNAMODB_APPOINTMENTS_TABLE")

    response = table.scan(
        FilterExpression=(
            Attr("userId").eq(user_id) &
            Attr("appointmentDate").eq(appointment_date) &
            Attr("startTime").eq(start_time)
        )
    )

    return response.get("Items", [])