import { authFetch } from "./auth/auth-fetch";

export interface CommandMetric {
    label: string;
    value: string;
}

export interface CommandItem {
    id?: string;
    type:
        | "handled"
        | "attention"
        | "decision"
        | "upcoming"
        | "saving"
        | "info";
    title: string;
    description?: string;
    value?: string;
    actionLabel?: string;
    decisionId?: string;
}

export interface LifeOpsCommandResult {
    title: string;
    summary: string;
    reviewedCount: number;
    handledCount: number;
    attentionCount: number;
    metrics: CommandMetric[];
    items: CommandItem[];
}

export async function runLifeOpsCommand(command: string): Promise<LifeOpsCommandResult> {
    const response = await authFetch("/api/command", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            command,
            userId: "demo-user",
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ?? data.error ?? "Command failed"
        );
    }

    return data.result;
}