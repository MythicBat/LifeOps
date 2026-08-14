import os
import boto3

from dotenv import load_dotenv

load_dotenv()

region = os.getenv("AWS_REGION")
dynamodb = boto3.resource("dynamodb", region_name=region)
table_name = os.getenv("DYNAMODB_LIFEOBJECTS_TABLE")
table = dynamodb.Table(table_name)

response = table.table_status

print("DynamoDB connection successful.")
print("Table:", table_name)
print("Status:", response)