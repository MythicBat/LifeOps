"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { authFetch } from "@/lib/auth/auth-fetch";

export function DailyBrief() {
    const [brief, setBrief] = useState<string | null>(null);

    useEffect(() => {
        authFetch("/api/daily-brief").then((response) => response.json())
            .then((data) => setBrief(data.brief)).catch(console.error);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-[32px] bg-zinc-950 p-7 text-white shadow-[0_28px_80px_rgba(0,0,0,0.14)] sm:p-9">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                    <Sparkles size={13} />
                    LifeOps Brief
                </div>

                {!brief ? (
                    <div className="mt-7 space-y-3">
                        <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/10" />
                        <div className="h-5 w-3/5 animate-pulse rounded-full bg-white/10" />
                        <div className="h-5 w-2/5 animate-pulse rounded-full bg-white/10" />
                    </div>
                ) : (
                    <p className="mt-6 max-w-2xl whitespace-pre-line text-[17px] leading-8 text-white/80">
                        {brief}
                    </p>
                )}
            </div>
        </div>
    );
}