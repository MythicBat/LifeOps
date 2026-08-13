"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { UniversalDrop } from "./UniversalDrop";

export function AddAnythingButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
                <Plus size={17} />

                Add anything
            </button>

            <UniversalDrop
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}