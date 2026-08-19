"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    FileText,
    RefreshCcw,
    ShieldCheck,
    WalletCards,
} from "lucide-react";

import { Sidebar } from "@/components/navigation/Sidebar";

interface VaultData {
    lifeObjects: unknown[];
    warranties: unknown[];
    renewals: unknown[];
    subscriptions: unknown[];
    appointments: unknown[];
}

export default function VaultPage() {
    const [vault, setVault] = useState<VaultData | null>(null);

    useEffect(() => {
        fetch("/api/vault").then((response) => response.json())
            .then((data) => setVault(data.vault)).catch(console.error);
    }, []);

    const groups = useMemo(() => [
        {
            label: "LifeObjects",
            count: vault?.lifeObjects?.length ?? 0,
            icon: FileText,
        },
        {
            label: "Subscriptions",
            count: vault?.subscriptions?.length ?? 0,
            icon: WalletCards,
        },
        {
            label: "Warranties",
            count: vault?.warranties?.length ?? 0,
            icon: ShieldCheck,
        },
        {
            label: "Renewals",
            count: vault?.renewals?.length ?? 0,
            icon: RefreshCcw,
        },
        {
            label: "Appointments",
            count: vault?.appointments?.length ?? 0,
            icon: CalendarDays,
        },
    ], [vault]);

    return (
        <main className="flex min-h-screen bg-[#f5f5f7]">
            <Sidebar />

            <section className="min-w-0 flex-1">
                <div className="mx-auto max-w-[1180px] px-6 py-10 lg:px-12">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Life Vault</p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                        Everything LifeOps knows.
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                        Documents become living objects that LifeOps can track, connect and act on.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {groups.map(
                            ({
                                label,
                                count,
                                icon: Icon,
                            }) => (
                                <div
                                    key={label}
                                    className="rounded-[24px] border border-black/[0.05] bg-white p-5"
                                >
                                    <Icon
                                        size={18}
                                        className="text-zinc-400"
                                    />

                                    <p className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{count}</p>

                                    <p className="mt-1 text-sm text-zinc-400">{label}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}