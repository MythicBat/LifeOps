import json
import os
import uuid
import boto3

from datetime import (datetime)
from strands import tool

region = os.getenv("AWS_REGION")
scheduler = boto3.client("scheduler", region_name=region)

@tool
def schedule_reminder(
    user_id: str,
    obligation_id: str,
    reminder_time: str,
    message: str,
) -> dict:
    """
    Create a one-time LifeOps
    reminder using Amazon EventBridge Scheduler.

    reminder_time must be an ISO local datetime such as
    2026-08-21T09:00:00.
    """

    lambda_arn = os.getenv("LIFEOPS_REMINDER_LAMBDA_ARN")
    role_arn = os.getenv("LIFEOPS_SCHEDULER_ROLE_ARN")

    if not lambda_arn:
        raise RuntimeError("Reminder Lambda ARN is missing.")
    if not role_arn:
        raise RuntimeError("Scheduler Role ARN is missing.")

    datetime.fromisoformat(reminder_time)

    name = (
        "lifeops-"
        f"{uuid.uuid4().hex[:18]}"
    )

    response = (
        scheduler.create_schedule(
            Name=name,
            ScheduleExpression=(
                f"at({reminder_time})"
            ),
            ScheduleExpressionTimezone="Australia/Melbourne",
            FlexibleTimeWindow={
                "Mode": "OFF"
            },
            ActionAfterCompletion="DELETE",
            Target={
                "Arn": lambda_arn,
                "RoleArn": role_arn,
                "Input": json.dumps({
                    "userId": user_id,
                    "obligationId": obligation_id,
                    "message": message,
                }),
            },
        )
    )

    return {
        "success": True,
        "scheduleName": name,
        "scheduleArn": response["ScheduleArn"],
    }