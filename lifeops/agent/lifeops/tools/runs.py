from strands import tool
from..database import (
    clean_for_dynamodb,
    get_table,
    new_id,
    utc_now,
)

@tool
def record_agent_run(
    user_id: str,
    trigger: str,
    status: str,
    summary: str,
    actions: list,
) -> dict:
    """
    Record an auditable LifeOps
    agent execution.

    Use after autonomous work
    has completed.
    """

    table = get_table("DYNAMODB_AGENT_RUNS_TABLE")
    run_id = new_id("run")

    item = {
        "id": run_id,
        "userId": user_id,
        "trigger": trigger,
        "status": status,
        "summary": summary,
        "actions": actions,
        "createdAt": utc_now(),
    }

    table.put_item(
        Item=clean_for_dynamodb(item)
    )

    return {
        "success": True,
        "runId": run_id,
    }