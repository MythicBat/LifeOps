"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import {
  LIFEOPS_EVENTS,
} from "@/lib/lifeops-events";

import {
  UniversalDrop,
} from "@/components/lifeops/UniversalDrop";


export function GlobalUniversalDrop() {

  const [
    open,
    setOpen,
  ] =
    useState(false);


  useEffect(() => {

    function handleOpen() {

      setOpen(
        true
      );
    }

    function handleKeyboard(
      event: KeyboardEvent
    ) {

      if (
        event.key ===
        "Escape"
      ) {

        setOpen(
          false
        );
      }
    }


    window.addEventListener(
      LIFEOPS_EVENTS.openUpload,
      handleOpen
    );

    window.addEventListener(
      "keydown",
      handleKeyboard
    );


    return () => {

      window.removeEventListener(
        LIFEOPS_EVENTS.openUpload,
        handleOpen
      );

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };

  }, []);


  if (!open) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">

      <button
        aria-label="Close upload"
        onClick={
          () =>
            setOpen(
              false
            )
        }
        className="absolute inset-0 bg-black/25 backdrop-blur-md"
      />


      <div className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[32px] border border-white/70 bg-[#f5f5f7] p-5 shadow-[0_35px_120px_rgba(0,0,0,0.22)] sm:p-7">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Universal Drop
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-zinc-950">
              Add anything.
            </h2>

          </div>

          <button
            onClick={
              () =>
                setOpen(
                  false
                )
            }

            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm transition hover:text-zinc-950"
          >

            <X
              size={15}
            />

          </button>

        </div>


        <UniversalDrop
          open={open}
          onClose={() => setOpen(false)}
        />

      </div>

    </div>
  );
}