from datetime import (
    datetime,
    timedelta,
)

from .dashboard import (
    get_user_items,
)

from .timeline import (
    parse_date,
)


def build_notifications(
    user_id: str,
) -> list[dict]:

    decisions = get_user_items(
        "DYNAMODB_DECISIONS_TABLE",
        user_id,
    )

    obligations = get_user_items(
        "DYNAMODB_OBLIGATIONS_TABLE",
        user_id,
    )

    notifications = []

    now = datetime.now()

    # --------------------------------
    # DECISIONS
    # --------------------------------

    for item in decisions:

        if (
            item.get("status")
            != "pending"
        ):
            continue

        notifications.append({
            "id":
                f"decision:{item['id']}",

            "type":
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

            "priority":
                "important",

            "createdAt":
                item.get(
                    "createdAt"
                ),

            "target":
                "decisions",
        })

    # --------------------------------
    # NEAR-TERM OBLIGATIONS
    # --------------------------------

    for item in obligations:

        if (
            item.get("status")
            != "open"
        ):
            continue

        due = parse_date(
            item.get(
                "dueDate"
            )
        )

        if not due:
            continue

        days = (
            due.date()
            -
            now.date()
        ).days

        if (
            0 <= days <= 3
        ):

            amount = item.get(
                "amount"
            )

            description = (
                f"${float(amount):.2f} due in {days} days"
                if amount is not None
                else f"Due in {days} days"
            )

            notifications.append({
                "id":
                    f"obligation:{item['id']}",

                "type":
                    "deadline",

                "title":
                    item.get(
                        "title",
                        "Upcoming deadline",
                    ),

                "description":
                    description,

                "priority":
                    "time-sensitive",

                "createdAt":
                    item.get(
                        "createdAt"
                    ),

                "target":
                    "upcoming",
            })

    return notifications