"use client";

import { useEffect, useState } from "react";
import { DecisionCard } from "./DecisionCard";
import { getDecisions, type LifeOpsDecision } from "@/lib/decisions";

export function DecisionFeed() {
    const [decisions, setDecisions] = useState<LifeOpsDecision[]>([]);

    useEffect(() => {
        getDecisions().then(setDecisions).catch(console.error);
    }, []);

    if (decisions.length === 0) { return null; }

    return (
        <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">Needs you</p>

                    <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-950">Decisions</h2>
                </div>

                <span className="text-sm text-zinc-400">{decisions.length}</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {decisions.map((decision) => (
                    <DecisionCard
                        key={decision.id}
                        decision={decision}
                    />
                ))}
            </div>
        </section>
    );
}