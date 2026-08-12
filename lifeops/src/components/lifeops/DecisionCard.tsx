"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Decision } from "@/lib/types";

interface DecisionCardProps {
  decision: Decision;
}

export function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
              <Sparkles size={14} />
              {decision.category}
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
              {decision.title}
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
              {decision.description}
            </p>
          </div>

          <div className="rounded-full bg-zinc-100 p-2.5">
            <ArrowUpRight
              size={17}
              className="text-zinc-500"
            />
          </div>
        </div>

        {decision.oldValue && decision.newValue && (
          <div className="mt-7 flex items-end gap-3">
            <span className="text-xl text-zinc-400 line-through">
              {decision.oldValue}
            </span>

            <span className="text-3xl font-semibold tracking-tight text-zinc-950">
              {decision.newValue}
            </span>

            {decision.impact && (
              <span className="mb-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                {decision.impact}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-black/[0.05] bg-zinc-50/80 p-4">
        <button className="flex-1 rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
          {decision.secondaryAction}
        </button>

        <button className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
          {decision.primaryAction}
        </button>
      </div>
    </div>
  );
}