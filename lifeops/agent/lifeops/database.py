import os
import uuid
import boto3

from datetime import (datetime, timezone)
from decimal import Decimal

region = os.getenv("AWS_REGION")
dynamodb = boto3.resource("dynamodb", region_name=region)

def get_table(env_name: str):
    table_name = os.getenv(env_name)

    if not table_name:
        raise RuntimeError(f"{env_name} is missing.")

    return dynamodb.Table(table_name)

def utc_now() -> str:
    return (
        datetime.now(timezone.utc).isoformat()
    )

def new_id(prefix: str) -> str:
    return (
        f"{prefix}_"
        f"{uuid.uuid4().hex[:16]}"
    )

def clean_for_dynamodb(value):
    if isinstance(value, float):
        return Decimal(str(value))

    if isinstance(value, dict):
        return {
            key: clean_for_dynamodb(item) for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            clean_for_dynamodb(item) for item in value
        ]

    return value