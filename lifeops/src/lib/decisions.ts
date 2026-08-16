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
        annualImpact?: number;
    };
    createdAt: string;
}

export async function getDecisions(): Promise<LifeOpsDecision[]> {
    const response = await fetch("/api/decisions", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load decisions.");
    }

    const data = await response.json();

    return data.decisions ?? [];
}