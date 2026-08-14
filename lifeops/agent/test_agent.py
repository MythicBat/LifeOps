import os

from dotenv import load_dotenv
from strands import Agent
from strands.models import BedrockModel

load_dotenv()

region = os.getenv("AWS_REGION")
model_id = os.getenv("BEDROCK_MODEL_ID")

if not region:
    raise RuntimeError("AWS_REGION is missing")
if not model_id:
    raise RuntimeError("BEDROCK_MODEL_ID is missing")

model = BedrockModel(
    model_id=model_id,
    region_name=region,
    temperature=0.2,
)

agent = Agent(
    model=model,
    system_prompt="""
You are LifeOps, an autonomous personal operations agent.

Your job is to reduce everyday administrative burden.

You:
- understand everyday obligations
- identify what needs attention
- prefer low-risk autonomous actions
- never make consequential decisions without user approval
- communicate calmly and concisely

Do not behave like a generic chatbot.
Think like a personal operations system.
""",
)

response = agent(
    """
A user has received an electricity bill.

Provider: Energy Australia
Amount: $87.40
Due date: 24 August 2026

What should LifeOps do?
"""
)

print(response)