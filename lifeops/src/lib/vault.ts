export type VaultCategory = 
    | "all"
    | "health"
    | "money"
    | "subscriptions"
    | "products"
    | "documents"

export interface VaultItem {
    id: string;
    category: Exclude<VaultCategory, "all">;
    type: string;
    title: string;
    subtitle?: string;
    amount?: number;
    currency?: string;
    date?: string;
    time?: string;
    status?: string;
    raw?: Record<string, unknown>;
}

export interface VaultData {
    items: VaultItem[];
    lifeObjects: unknown[];
    warranties: unknown[];
    renewals: unknown[];
    subscriptions: unknown[];
    appointments: unknown[];
    obligations: unknown[];
}

export async function getVault(): Promise<VaultData> {
    const response = await fetch("/api/vault", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load Life Vault");
    }

    const data = await response.json();

    return data.vault;
}