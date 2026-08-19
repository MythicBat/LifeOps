"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";

import { getDashboard, type AgentRun } from "@/lib/dashboard";

export function LiveActivityFeed() {
    const [runs, setRuns] = useState<AgentRun[]>([]);

    useEffect(() => {
        getDashboard().then((dashboard) => setRuns(dashboard.recentRuns)).catch(console.error);
    }, []);

    if (runs.length === 0) {
        return (
            <div className="rounded-[28px] border border-black/[0.05] bg-white p-8 text-center">
                <Sparkles
                    size={20}
                    className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm text-zinc-400">
                    LifeOps has not handled anything yet.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-[28px] border border-black/[0.05] bg-white">
            {runs.map((run, index) => (
                <div
                    key={run.id}
                    className={`flex gap-4 p-5 ${index !== runs.length - 1 ? "border-b border-black/[0.05]" : ""}`}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
                        <Check size={14} />
                    </div>

                    <div className="min-w-0 flex-l">
                        <p className="text-sm font-medium text-zinc-900">{run.summary}</p>

                        {run.actions?.length > 0 && (
                            <p className="mt-1 text-xs text-zinc-400">
                                {run.actions.length}{" "}
                                {run.actions.length === 1 ? "action" : "actions"}{" "}
                                completed
                            </p>
                        )}
                    </div>

                    <time className="shrink-0 text-xs text-zinc-400">
                        {formatRunTime(run.createdAt)}
                    </time>
                </div>
            ))}
        </div>
    );
}

function formatRunTime(value: string) {
    try {
        return new Intl.DateTimeFormat(
            "en-AU",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        ).format(new Date(value));
    } catch {
        return "";
    }
}