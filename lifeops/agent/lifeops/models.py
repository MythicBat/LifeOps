from typing import Literal, Optional
from pydantic import BaseModel, Field

class DocumentAnalysis(BaseModel):
    documentId: str
    objectKey: str
    documentType: str
    vendor: Optional[str] = None
    total: Optional[float] = None
    currency: Optional[str] = None
    invoiceNumber: Optional[str] = None
    date: Optional[str] = None
    dueDate: Optional[str] = None
    accountNumber: Optional[str] = None

class ObservedEvent(BaseModel):
    eventType: Literal[
        "bill_detected",
        "receipt_detected",
        "subscription_detected",
        "appointment_detected",
        "renewal_detected",
        "document_detected",
    ]
    title: str
    summary: str
    confidence: float = Field(
        ge=0,
        le=1,
    )

class PlannedAction(BaseModel):
    type: Literal[
        "create_life_object",
        "create_obligation",
        "schedule_reminder",
        "archive_receipt",
        "track_subscription",
        "track_warranty",
        "create_decision",
        "no_action",
    ]
    reason: str

class LifeOpsPlan(BaseModel):
    goal: str
    riskLevel: Literal[
        "low",
        "medium",
        "high",
    ]
    requiresUser: bool
    actions: list[PlannedAction]
    briefing: str

class DecisionProposal(BaseModel):
    title: str
    description: str
    category: Literal[
        "subscription",
        "renewal",
        "appointment",
        "purchase",
        "document",
        "other",
    ]
    recommendedAction: Optional[str] = None
    options: list[str] = Field(default_factory=list)