"use client";

import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

import type {
  LifeOpsCommandResult,
} from "@/lib/command-center";


export function CommandResult({
  result,
}: {
  result:
    LifeOpsCommandResult;
}) {

  return (
    <div className="overflow-hidden rounded-[30px] border border-black/[0.05] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.045)]">

      <div className="p-7 sm:p-8">

        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">

          <Sparkles
            size={13}
          />

          LifeOps Command

        </div>


        <h3 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-zinc-950">
          {result.title}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
          {result.summary}
        </p>


        <div className="mt-8 grid gap-3 sm:grid-cols-3">

          <Metric
            value={
              result.reviewedCount
            }

            label="Reviewed"
          />

          <Metric
            value={
              result.handledCount
            }

            label="Handled"
          />

          <Metric
            value={
              result.attentionCount
            }

            label="Needs you"
          />

        </div>


        {result.metrics.length >
          0 && (

          <div className="mt-4 flex flex-wrap gap-2">

            {result.metrics.map(
              (
                metric,
                index,
              ) => (

              <div
                key={
                  `${metric.label}-${index}`
                }

                className="rounded-full bg-zinc-100 px-3 py-2 text-xs text-zinc-500"
              >
                <span className="font-medium text-zinc-900">
                  {metric.value}
                </span>

                {" "}

                {metric.label}
              </div>

            ))}

          </div>
        )}

      </div>


      {result.items.length >
        0 && (

        <div className="border-t border-black/[0.05]">

          {result.items.map(
            (
              item,
              index,
            ) => (

            <div
              key={
                item.id ??
                `${item.title}-${index}`
              }

              className={`flex items-center gap-4 px-7 py-5 ${
                index !==
                result.items.length - 1

                  ? "border-b border-black/[0.05]"

                  : ""
              }`}
            >

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100">

                <Check
                  size={14}
                  className="text-zinc-600"
                />

              </div>


              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-zinc-950">
                  {item.title}
                </p>

                {item.description && (

                  <p className="mt-1 text-sm leading-5 text-zinc-400">
                    {item.description}
                  </p>

                )}

              </div>


              {item.value && (

                <span className="shrink-0 text-sm font-semibold text-zinc-800">
                  {item.value}
                </span>

              )}


              {item.actionLabel && (

                <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800">

                  {item.actionLabel}

                  <ArrowRight
                    size={12}
                  />

                </button>

              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}


function Metric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {

  return (
    <div className="rounded-[20px] bg-[#f5f5f7] p-4">

      <p className="text-[27px] font-semibold tracking-[-0.045em] text-zinc-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-400">
        {label}
      </p>

    </div>
  );
}