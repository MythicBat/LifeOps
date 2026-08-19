import os
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Attr

region = os.getenv("AWS_REGION")
dynamodb = boto3.resource("dynamodb", region_name=region)

def table_from_env(env_name: str):
    table_name = os.getenv(env_name)

    if not table_name:
        raise RuntimeError(f"{env_name} is missing.")

    return dynamodb.Table(table_name)

def serialise(value):
    """
    Convert DynamoDB Decimal values into normal JSON-safe numbers.
    """

    if isinstance(value, Decimal):
        if (value % 1 == 0):
            return int(value)

        return float(value)

    if isinstance(value, dict):
        return {
            key: serialise(item) for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            serialise(item) for item in value
        ]

    return value

def get_user_items(env_name: str, user_id: str) -> list[dict]:
    table = table_from_env(env_name)

    response = table.scan(
        FilterExpression=(Attr("userId").eq(user_id))
    )

    return [
        serialise(item) for item in response.get("Items", [])
    ]

def get_dashboard_summary(user_id: str) -> dict:
    life_objects = (
        get_user_items("DYNAMODB_LIFEOBJECTS_TABLE", user_id)
    )

    obligations = (
        get_user_items("DYNAMODB_OBLIGATIONS_TABLE", user_id)
    )

    runs = (
        get_user_items("DYNAMODB_AGENT_RUNS_TABLE", user_id)
    )

    decisions = (
        get_user_items("DYNAMODB_DECISIONS_TABLE", user_id)
    )

    warranties = (
        get_user_items("DYNAMODB_WARRANTIES_TABLE", user_id)
    )

    renewals = (
        get_user_items("DYNAMODB_RENEWALS_TABLE", user_id)
    )

    appointments = (
        get_user_items("DYNAMODB_APPOINTMENTS_TABLE", user_id)
    )

    pending_decisions = [
        decision for decision in decisions
        if (decision.get("status") == "pending")
    ]

    completed_runs = [
        run for run in runs if (run.get("status") == "completed")
    ]

    handled_actions = sum(
        len(run.get("actions", [])) for run in completed_runs
    )

    return {
        "counts": {
            "lifeObjects": len(life_objects),
            "obligations": len(obligations),
            "decisions": len(pending_decisions),
            "warranties": len(warranties),
            "renewals": len(renewals),
            "appointments": len(appointments),
            "agentRuns": len(runs),
            "actionsHandled": handled_actions,
        },

        "recentRuns": sorted(
            runs,
            key=lambda item: item.get("createdAt", ""),
            reverse=True,
        )[:5],
    }