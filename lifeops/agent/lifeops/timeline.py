from datetime import (
    datetime,
    timezone,
)

from .dashboard import (
    get_user_items,
)


def parse_date(
    value: str | None,
):
    if not value:
        return None

    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%Y-%m-%dT%H:%M:%S",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(
                value[:19],
                fmt,
            )
        except ValueError:
            continue

    try:
        return datetime.fromisoformat(
            value.replace(
                "Z",
                "+00:00",
            )
        ).replace(
            tzinfo=None
        )

    except ValueError:
        return None


def build_timeline(
    user_id: str,
) -> list[dict]:

    runs = get_user_items(
        "DYNAMODB_AGENT_RUNS_TABLE",
        user_id,
    )

    obligations = get_user_items(
        "DYNAMODB_OBLIGATIONS_TABLE",
        user_id,
    )

    appointments = get_user_items(
        "DYNAMODB_APPOINTMENTS_TABLE",
        user_id,
    )

    renewals = get_user_items(
        "DYNAMODB_RENEWALS_TABLE",
        user_id,
    )

    warranties = get_user_items(
        "DYNAMODB_WARRANTIES_TABLE",
        user_id,
    )

    decisions = get_user_items(
        "DYNAMODB_DECISIONS_TABLE",
        user_id,
    )

    timeline = []

    # --------------------------------
    # AUTONOMOUS ACTIVITY
    # --------------------------------

    for run in runs:

        timeline.append({
            "id":
                run.get("id"),

            "kind":
                "activity",

            "title":
                run.get(
                    "summary",
                    "LifeOps handled something",
                ),

            "description":
                format_actions(
                    run.get(
                        "actions",
                        [],
                    )
                ),

            "date":
                run.get(
                    "createdAt"
                ),

            "status":
                run.get(
                    "status",
                    "completed",
                ),

            "priority":
                4,
        })

    # --------------------------------
    # OPEN OBLIGATIONS
    # --------------------------------

    for item in obligations:

        if (
            item.get("status")
            != "open"
        ):
            continue

        amount = item.get(
            "amount"
        )

        description = (
            f"${float(amount):.2f} due"
            if amount is not None
            else "Upcoming obligation"
        )

        timeline.append({
            "id":
                item.get("id"),

            "kind":
                "obligation",

            "title":
                item.get(
                    "title",
                    "Obligation",
                ),

            "description":
                description,

            "date":
                item.get(
                    "dueDate"
                ),

            "status":
                "upcoming",

            "priority":
                1,
        })

    # --------------------------------
    # APPOINTMENTS
    # --------------------------------

    for item in appointments:

        if (
            item.get("status")
            != "scheduled"
        ):
            continue

        details = []

        if item.get("startTime"):
            details.append(
                item["startTime"]
            )

        if item.get("location"):
            details.append(
                item["location"]
            )

        timeline.append({
            "id":
                item.get("id"),

            "kind":
                "appointment",

            "title":
                item.get(
                    "title",
                    "Appointment",
                ),

            "description":
                " · ".join(details),

            "date":
                item.get(
                    "appointmentDate"
                ),

            "status":
                "upcoming",

            "priority":
                2,
        })

    # --------------------------------
    # RENEWALS
    # --------------------------------

    for item in renewals:

        if (
            item.get("status")
            != "upcoming"
        ):
            continue

        timeline.append({
            "id":
                item.get("id"),

            "kind":
                "renewal",

            "title":
                item.get(
                    "title",
                    "Renewal",
                ),

            "description":
                "Review before renewal",

            "date":
                item.get(
                    "renewalDate"
                ),

            "status":
                "upcoming",

            "priority":
                2,
        })

    # --------------------------------
    # WARRANTIES
    # --------------------------------

    for item in warranties:

        if (
            item.get("status")
            != "active"
        ):
            continue

        timeline.append({
            "id":
                item.get("id"),

            "kind":
                "warranty",

            "title":
                (
                    f"{item.get('productName', 'Product')} warranty"
                ),

            "description":
                "Coverage expiry",

            "date":
                item.get(
                    "expiryDate"
                ),

            "status":
                "later",

            "priority":
                3,
        })

    # --------------------------------
    # PENDING DECISIONS
    # --------------------------------

    for item in decisions:

        if (
            item.get("status")
            != "pending"
        ):
            continue

        timeline.append({
            "id":
                item.get("id"),

            "kind":
                "decision",

            "title":
                item.get(
                    "title",
                    "Decision needed",
                ),

            "description":
                item.get(
                    "description",
                    "LifeOps needs your input.",
                ),

            "date":
                item.get(
                    "createdAt"
                ),

            "status":
                "needs-you",

            "priority":
                0,
        })

    timeline.sort(
        key=lambda item: (
            parse_date(
                item.get("date")
            )
            or datetime.max,

            item.get(
                "priority",
                10,
            ),
        )
    )

    return timeline


def format_actions(
    actions: list,
) -> str:

    if not actions:
        return (
            "Handled by LifeOps"
        )

    names = [
        str(action)
        .replace(
            "_",
            " ",
        )
        .title()

        for action in actions
    ]

    return " · ".join(
        names[:3]
    )