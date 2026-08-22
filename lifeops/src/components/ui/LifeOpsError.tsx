"use client";

import { RotateCcw } from "lucide-react";

export function LifeOpsError({
    title = "Something didn't load.",
    description = "LifeOps could not retrieve this information.",
    onRetry,
} : {
    title?: string;
    description?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="rounded-[28px] border border-black/[0.05] bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                <RotateCcw size={16} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-zinc-900">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                {description}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
                >
                    Try again
                </button>
            )}
        </div>
    );
}