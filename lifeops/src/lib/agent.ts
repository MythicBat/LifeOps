import type { LifeOpsDocumentAnalysis } from "./document-intelligence";

export interface ObservedEvent {
    eventType: string;
    title: string;
    summary: string;
    confidence: number;
}

export interface PlannedAction {
    type: string;
    reason: string;
}

export interface LifeOpsPlan {
    goal: string;
    riskLevel: "low" | "medium" | "high";
    requireUser: boolean;
    actions: PlannedAction[];
    briefing: string;
}

export interface GuardianResult {
    level: "auto" | "decision" | "confirm";
    permitted: boolean;
    reason: string;
}

export interface ExecutionResult {
    executed: boolean;
    reason?: string;
    results: unknown[];
    run?: unknown[];
}

export interface AgentProcessingResult {
    event: ObservedEvent;
    plan: LifeOpsPlan;
    guardian: GuardianResult;
    execution: ExecutionResult;
}

export async function processWithLifeOpsAgent(
    analysis: LifeOpsDocumentAnalysis
): Promise<AgentProcessingResult> {
    const response = await fetch("/api/agent/process-document",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                documentId: analysis.documentId,
                objectKey: analysis.objectKey,
                documentType: analysis.documentType,
                vendor: analysis.vendor,
                total: analysis.total,
                currency: analysis.currency,
                invoiceNumber: analysis.invoiceNumber,
                date: analysis.date,
                dueDate: analysis.dueDate,
                accountNumber: analysis.accountNumber,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail ?? data.error ?? "LifeOps agent failed.");
    }

    return data.result;
}