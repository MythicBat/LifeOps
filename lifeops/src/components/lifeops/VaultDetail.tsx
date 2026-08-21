"use client";

import {
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

import type {
  VaultItem,
} from "@/lib/vault";


export function VaultDetail({
  item,
  onClose,
}: {
  item: VaultItem | null;
  onClose: () => void;
}) {

  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">

      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[3px]"
      />

      <aside className="absolute bottom-0 right-0 top-0 w-full max-w-[520px] overflow-y-auto border-l border-black/[0.05] bg-[#fbfbfd] shadow-[-30px_0_80px_rgba(0,0,0,0.12)]">

        <div className="p-7 sm:p-9">

          <div className="flex items-center justify-between">

            <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
              Life Vault
            </p>

            <button
              onClick={
                onClose
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-950"
            >
              <X
                size={16}
              />
            </button>

          </div>


          <div className="mt-12">

            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-zinc-950 text-white">

              <FileText
                size={21}
              />

            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {item.type}
            </p>

            <h2 className="mt-2 text-[34px] font-semibold tracking-[-0.045em] text-zinc-950">
              {item.title}
            </h2>

            {item.subtitle && (
              <p className="mt-2 text-base text-zinc-400">
                {item.subtitle}
              </p>
            )}

          </div>


          <div className="mt-10 grid grid-cols-2 gap-3">

            {item.amount !==
              undefined && (

              <DetailMetric
                label="Amount"
                value={
                  `$${Number(
                    item.amount
                  ).toFixed(2)}`
                }
              />

            )}

            {item.date && (

              <DetailMetric
                label="Date"
                value={
                  item.date
                }
              />

            )}

            {item.time && (

              <DetailMetric
                label="Time"
                value={
                  item.time
                }
              />

            )}

            {item.status && (

              <DetailMetric
                label="Status"
                value={
                  item.status
                }
              />

            )}

          </div>


          <div className="mt-10">

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
              LifeOps
            </p>

            <div className="mt-3 rounded-[24px] border border-black/[0.05] bg-white p-5">

              <div className="flex gap-3">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">

                  <CheckCircle2
                    size={14}
                  />

                </div>

                <div>

                  <p className="text-sm font-medium text-zinc-900">
                    Actively tracked
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    LifeOps understands this item and will surface it when it requires your attention.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {item.raw &&
            Object.keys(
              item.raw
            ).length > 0 && (

            <div className="mt-10">

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                Details
              </p>

              <div className="mt-3 divide-y divide-black/[0.05] overflow-hidden rounded-[24px] border border-black/[0.05] bg-white">

                {Object.entries(
                  item.raw
                )
                  .filter(
                    ([key]) =>
                      ![
                        "id",
                        "userId",
                      ].includes(
                        key
                      )
                  )
                  .slice(
                    0,
                    8
                  )
                  .map(
                    ([
                      key,
                      value,
                    ]) => (

                    <div
                      key={
                        key
                      }
                      className="flex items-start justify-between gap-6 px-5 py-4"
                    >

                      <span className="text-sm capitalize text-zinc-400">
                        {key
                          .replace(
                            /([A-Z])/g,
                            " $1"
                          )
                          .trim()}
                      </span>

                      <span className="max-w-[55%] break-words text-right text-sm font-medium text-zinc-700">
                        {formatValue(
                          value
                        )}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>
          )}

        </div>

      </aside>

    </div>
  );
}


function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="rounded-[20px] bg-white p-4">

      <p className="text-xs text-zinc-400">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-semibold capitalize text-zinc-900">
        {value}
      </p>

    </div>
  );
}


function formatValue(
  value: unknown,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (
    typeof value ===
    "object"
  ) {
    return JSON.stringify(
      value
    );
  }

  return String(
    value
  );
}