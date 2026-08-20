from collections import defaultdict

from .dashboard import (
    get_user_items,
)


def build_life_graph(
    user_id: str,
) -> dict:

    life_objects = get_user_items(
        "DYNAMODB_LIFEOBJECTS_TABLE",
        user_id,
    )

    obligations = get_user_items(
        "DYNAMODB_OBLIGATIONS_TABLE",
        user_id,
    )

    subscriptions = get_user_items(
        "DYNAMODB_SUBSCRIPTIONS_TABLE",
        user_id,
    )

    decisions = get_user_items(
        "DYNAMODB_DECISIONS_TABLE",
        user_id,
    )

    warranties = get_user_items(
        "DYNAMODB_WARRANTIES_TABLE",
        user_id,
    )

    renewals = get_user_items(
        "DYNAMODB_RENEWALS_TABLE",
        user_id,
    )

    appointments = get_user_items(
        "DYNAMODB_APPOINTMENTS_TABLE",
        user_id,
    )

    nodes = []
    edges = []

    # -----------------------------
    # USER
    # -----------------------------

    nodes.append({
        "id": user_id,
        "type": "user",
        "label": "You",
    })

    # -----------------------------
    # LIFE OBJECTS
    # -----------------------------

    for item in life_objects:
        object_id = item["id"]

        nodes.append({
            "id": object_id,
            "type": item.get(
                "type",
                "document",
            ),
            "label": item.get(
                "title",
                "LifeObject",
            ),
        })

        edges.append({
            "source": user_id,
            "target": object_id,
            "relationship":
                "owns",
        })

    # -----------------------------
    # OBLIGATIONS
    # -----------------------------

    for item in obligations:
        obligation_id = item["id"]

        nodes.append({
            "id": obligation_id,
            "type": "obligation",
            "label": item.get(
                "title",
                "Obligation",
            ),
            "date": item.get(
                "dueDate"
            ),
        })

        parent = item.get(
            "lifeObjectId"
        )

        if parent:
            edges.append({
                "source": parent,
                "target": obligation_id,
                "relationship":
                    "creates_obligation",
            })

    # -----------------------------
    # SUBSCRIPTIONS
    # -----------------------------

    latest_by_vendor = {}

    for item in subscriptions:
        vendor = item.get(
            "vendorKey"
        )

        if not vendor:
            continue

        existing = (
            latest_by_vendor.get(
                vendor
            )
        )

        if (
            not existing
            or item.get(
                "createdAt",
                "",
            )
            >
            existing.get(
                "createdAt",
                "",
            )
        ):
            latest_by_vendor[
                vendor
            ] = item

    for vendor, item in (
        latest_by_vendor.items()
    ):
        node_id = (
            f"subscription:"
            f"{vendor}"
        )

        nodes.append({
            "id": node_id,
            "type":
                "subscription",
            "label":
                item.get(
                    "vendor",
                    vendor,
                ),
            "amount":
                item.get(
                    "amount"
                ),
        })

        edges.append({
            "source":
                user_id,
            "target":
                node_id,
            "relationship":
                "subscribes_to",
        })

    # -----------------------------
    # DECISIONS
    # -----------------------------

    for item in decisions:

        if (
            item.get(
                "status"
            )
            != "pending"
        ):
            continue

        decision_id = item["id"]

        nodes.append({
            "id":
                decision_id,
            "type":
                "decision",
            "label":
                item.get(
                    "title",
                    "Decision",
                ),
        })

        source_document = (
            item
            .get(
                "metadata",
                {}
            )
            .get(
                "sourceDocumentId"
            )
        )

        if source_document:
            edges.append({
                "source":
                    source_document,
                "target":
                    decision_id,
                "relationship":
                    "requires_decision",
            })

        else:
            edges.append({
                "source":
                    user_id,
                "target":
                    decision_id,
                "relationship":
                    "requires_decision",
            })

    # -----------------------------
    # WARRANTIES
    # -----------------------------

    for item in warranties:

        node_id = item["id"]

        nodes.append({
            "id":
                node_id,
            "type":
                "warranty",
            "label":
                item.get(
                    "productName",
                    "Warranty",
                ),
            "expiryDate":
                item.get(
                    "expiryDate"
                ),
        })

        edges.append({
            "source":
                user_id,
            "target":
                node_id,
            "relationship":
                "owns_warranty",
        })

    # -----------------------------
    # RENEWALS
    # -----------------------------

    for item in renewals:

        node_id = item["id"]

        nodes.append({
            "id":
                node_id,
            "type":
                "renewal",
            "label":
                item.get(
                    "title",
                    "Renewal",
                ),
            "date":
                item.get(
                    "renewalDate"
                ),
        })

        edges.append({
            "source":
                user_id,
            "target":
                node_id,
            "relationship":
                "has_renewal",
        })

    # -----------------------------
    # APPOINTMENTS
    # -----------------------------

    for item in appointments:

        node_id = item["id"]

        nodes.append({
            "id":
                node_id,
            "type":
                "appointment",
            "label":
                item.get(
                    "title",
                    "Appointment",
                ),
            "date":
                item.get(
                    "appointmentDate"
                ),
            "time":
                item.get(
                    "startTime"
                ),
        })

        edges.append({
            "source":
                user_id,
            "target":
                node_id,
            "relationship":
                "has_appointment",
        })

    return {
        "nodes": nodes,
        "edges": edges,
    }