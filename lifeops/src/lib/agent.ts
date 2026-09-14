import { authFetch } from "./auth/auth-fetch";
import type { LifeOpsDocumentAnalysis } from "./document-intelligence";

export interface ObservedEvent {
    eventType: string;
    title: string;
    summary: string;
    confidence: number;
    requiresAttention?: boolean;
}

export interface PlannedAction {
    type: string;
    reason: string;
}

export interface LifeOpsPlan {
    goal: string;
    riskLevel: "low" | "medium" | "high";
    requiresUser: boolean;
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
    run?: {
        success: boolean;
        runId?: string;
    };
}

export interface AgentProcessingResult {
    event: ObservedEvent;
    plan: LifeOpsPlan;
    guardian: GuardianResult;
    execution: ExecutionResult;
    
    autonomy?: {
        everydayAdmin?: string;
        money?: string;
        appointments?: string;
        subscriptions?: string;
        documents?: string;
        warranties?: string;
        renewals?: string;
    };

    intelligence?: {
        subscription?: unknown;
    };
}

interface AgentApiResponse {
  result?: {
    success?: boolean;
    result?: AgentProcessingResult;
  };

  detail?: string;
  error?: string;
}

export async function processWithLifeOpsAgent(
    analysis: LifeOpsDocumentAnalysis
): Promise<AgentProcessingResult> {
    const response = await authFetch("/api/agent/process-document",
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

    const data = (await response.json()) as AgentApiResponse;

    if (!response.ok) {
        throw new Error(data.detail ?? data.error ?? "LifeOps agent failed.");
    }

    const result = data.result?.result;

    if (!result) {
        throw new Error("LifeOps agent returned an unexpected response.");
    }

    return result;
}