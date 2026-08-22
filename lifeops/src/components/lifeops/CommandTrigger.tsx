"use client";

import { Search } from "lucide-react";
import { openLifeOpsCommand } from "@/lib/lifeops-events";

export function CommandTrigger() {
    return (
        <button
            onClick={openLifeOpsCommand}
            className="hidden items-center gap-3 rounded-full border border-black/[0.055] bg-white px-4 py-2.5 text-sm text-zinc-400 shadow-sm transition hover:border-black/[0.1] hover:text-zinc-700 md:flex"
        >
            <Search size={14} />

            <span>
                Ask LifeOps
            </span>

            <kbd className="ml-3 rounded-md bg-zinc-100 px-2 py-0.5 font-sans text-[10px] text-zinc-400">
                Ctrl K
            </kbd>
        </button>
    );
}