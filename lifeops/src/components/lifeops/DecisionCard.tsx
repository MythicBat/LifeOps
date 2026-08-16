"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

import type { LifeOpsDecision } from "@/lib/decisions";

export function DecisionCard({decision, onResolved,}: { decision: LifeOpsDecision; onResolved?: () => void; }) {
  const vendor = decision.metadata?.vendor;

  const amount = decision.metadata?.amount;

  const previousAmount = decision.metadata?.previousAmount;
  const annualImpact = decision.metadata?.annualImpact;
  const percentageChange = decision.metadata?.percentageChange;

  const resolve = async (option: string) => {
    const response = await fetch(`/api/decisions/${decision.id}/resolve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({option}),
      }
    );

    if (!response.ok) {
      throw new Error("Could not resolve decision");
    }

    onResolved?.();
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-zinc-400" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Decision</p>
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{decision.title}</h3>
          </div>

          <div className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">Needs you</div>
        </div>

        {vendor && (
          <>
            {previousAmount !== undefined && amount !== undefined ? (
              <div className="mt-7">
                <p className="text-sm text-zinc-400">Monthyl price</p>

                <div className="mt-2 flex items-end gap-3">
                  <span className="text-xl text-zinc-400 line-through">${Number(previousAmount).toFixed(2)}</span>

                  <span className="text-[32px] font-semibold tracking-[-0.05em] text-zinc-950">${Number(amount).toFixed(2)}</span>

                  {percentageChange !== undefined && (
                    <span className="mb-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {percentageChange > 0 ? "+" : ""}
                      {Number(percentageChange).toFixed(1)}%
                    </span>
                  )}
                </div>

                {annualImpact !== undefined && (
                  <p className="mt-2 text-sm text-zinc-400">
                    {annualImpact > 0 ? "+" : ""}
                    ${Number(annualImpact).toFixed(2)}/year
                  </p>
                )}
              </div>
            ) : (amount !== undefined && (
              <div className="mt-7">
                <p className="text-sm text-zinc-400">Current charge</p>

                <p className="mt-1 text-[32px] font-semibold tracking-[-0.05em] text-zinc-950">
                  ${Number(amount).toFixed(2)}
                </p>
              </div>
            ))}
          </>
        )}

        <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-500">{decision.description}</p>
      </div>

      <div className="border-t border-black/[0.05] bg-[#fafafa] p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => resolve("Keep")}
            className="rounded-[16px] bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-black/[0.05] transition hover:bg-zinc-50">
              Keep
          </button>

          <button
            onClick={() => resolve("Review")}
            className="flex items-center justify-center gap-2 rounded-[16px] bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
              Review

            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}