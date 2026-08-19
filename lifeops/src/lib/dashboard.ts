export interface DashboardCounts {
    lifeObjects: number;
    obligations: number;
    decisions: number;
    warranties: number;
    renewals: number;
    appointments: number;
    agentRuns: number;
    actionsHandled: number;
}

export interface AgentRun {
    id: string;
    trigger: string;
    status: string;
    summary: string;
    actions: string[];
    createdAt: string;
}

export interface DashboardData {
    counts: DashboardCounts;
    recentRuns: AgentRun[];
}

export async function getDashboard(): Promise<DashboardData> {
    const response = await fetch("/api/dashboard", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load LifeOps dashboard");
    }

    const data = await response.json();

    return data.dashboard;
}