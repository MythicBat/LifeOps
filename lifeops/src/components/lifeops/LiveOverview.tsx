"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    Layers3,
    Sparkles,
} from "lucide-react";

import { getDashboard, type DashboardData } from "@/lib/dashboard";

export function LiveOverview() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);

    useEffect(() => {
        getDashboard().then(setDashboard).catch(console.error);
    }, []);

    if (!dashboard) {
        return (
            <div className="h-[180px] animate-pulse rounded-[28px] bg-white" />
        );
    }

    const {counts} = dashboard;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
                icon={Sparkles}
                value={counts.actionsHandled}
                label="Actions Handled"
            />

            <Metric
                icon={Layers3}
                value={counts.lifeObjects}
                label="LifeObjects"
            />

            <Metric
                icon={Clock3}
                value={counts.obligations}
                label="Active obligations"
            />

            <Metric
                icon={CheckCircle2}
                value={counts.decisions}
                label="Needs you"
            />
        </div>
    );
}

function Metric({
    icon: Icon,
    value,
    label,
}: {
    icon: React.ElementType;
    value: number;
    label: string;
}) {
    return (
        <div className="rounded-[24px] border border-black/[0.05] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-zinc-100">
                <Icon
                    size={16}
                    className="text-zinc-600"
                />
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">{value}</p>
            <p className="mt-1 text-sm text-zinc-400">{label}</p>
        </div>
    );
}