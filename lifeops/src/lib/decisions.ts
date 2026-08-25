import { authFetch } from "./auth/auth-fetch";

export interface LifeOpsDecision {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    options: string[];
    status: "pending" | "resolved";
    metadata?: {
        vendor?: string;
        amount?: number;
        previousAmount?: number;
        monthlyDifference?: number;
        annualImpact?: number;
        percentageChange?: number;
        sourceDocumentId?: string;

    };
    createdAt: string;
}

export async function getDecisions(): Promise<LifeOpsDecision[]> {
    const response = await authFetch("/api/decisions", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load decisions.");
    }

    const data = await response.json();

    return data.decisions ?? [];
}