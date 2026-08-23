"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Clock3,
  FolderArchive,
  Search,
  Settings2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LIFEOPS_EVENTS,
  openUniversalDrop,
} from "@/lib/lifeops-events";


const quickActions = [
  {
    label:
      "Clean up my month",

    description:
      "Review what needs attention",

    icon:
      Sparkles,

    action:
      "command",
  },

  {
    label:
      "Add anything",

    description:
      "Drop a bill, receipt or document",

    icon:
      Upload,

    action:
      "upload",
  },

  {
    label:
      "View timeline",

    description:
      "See what happened and what's next",

    icon:
      Clock3,

    href:
      "/timeline",
  },

  {
    label:
      "Open Life Vault",

    description:
      "Search everything LifeOps knows",

    icon:
      FolderArchive,

    href:
      "/vault",
  },

  {
    label:
      "Manage autonomy",

    description:
      "Choose what LifeOps can handle",

    icon:
      Settings2,

    href:
      "/autonomy",
  },
] as const;


export function CommandPalette() {

  const pathname = usePathname();

  const router =
    useRouter();

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    query,
    setQuery,
  ] =
    useState("");

  useEffect(() => {

    function onKeyboard(
      event: KeyboardEvent
    ) {

      if (
        (event.metaKey ||
          event.ctrlKey)
        &&
        event.key.toLowerCase()
          === "k"
      ) {

        event.preventDefault();

        setOpen(
          (current) =>
            !current
        );
      }

      if (
        event.key ===
        "Escape"
      ) {

        setOpen(
          false
        );
      }
    }


    function onOpen() {

      setOpen(
        true
      );
    }


    window.addEventListener(
      "keydown",
      onKeyboard
    );

    window.addEventListener(
      LIFEOPS_EVENTS.openCommand,
      onOpen
    );


    return () => {

      window.removeEventListener(
        "keydown",
        onKeyboard
      );

      window.removeEventListener(
        LIFEOPS_EVENTS.openCommand,
        onOpen
      );
    };

  }, []);


  useEffect(() => {

    if (!open) {
      return;
    }

    const timeout =
      window.setTimeout(
        () =>
          inputRef.current
            ?.focus(),
        60
      );

    return () =>
      window.clearTimeout(
        timeout
      );

  }, [open]);

  const authPage = [
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
  ].some((route) => pathname.startsWith(route));

  if (authPage) {
    return null;
  }

  function close() {

    setOpen(
      false
    );

    setQuery(
      ""
    );
  }


  function runCommand(
    command: string
  ) {

    close();

    router.push(
      `/?command=${encodeURIComponent(
        command
      )}`
    );
  }


  function submit() {

    const value =
      query.trim();

    if (!value) {
      return;
    }

    runCommand(
      value
    );
  }


  if (!open) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">

      <button
        aria-label="Close command palette"
        onClick={
          close
        }
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
      />


      <div className="relative w-full max-w-[640px] overflow-hidden rounded-[30px] border border-white/70 bg-white/95 shadow-[0_35px_120px_rgba(0,0,0,0.20)] backdrop-blur-2xl">

        <div className="flex items-center gap-3 border-b border-black/[0.055] px-5">

          <Search
            size={18}
            className="shrink-0 text-zinc-400"
          />

          <input
            ref={
              inputRef
            }

            value={
              query
            }

            onChange={
              (event) =>
                setQuery(
                  event.target.value
                )
            }

            onKeyDown={
              (event) => {

                if (
                  event.key ===
                  "Enter"
                ) {
                  submit();
                }

              }
            }

            placeholder="Ask LifeOps or find anything..."

            className="min-w-0 flex-1 bg-transparent py-5 text-[16px] text-zinc-950 outline-none placeholder:text-zinc-400"
          />

          <button
            onClick={
              close
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition hover:text-zinc-950"
          >
            <X
              size={14}
            />
          </button>

        </div>


        {query.trim() && (

          <button
            onClick={
              submit
            }
            className="flex w-full items-center gap-4 border-b border-black/[0.05] px-5 py-4 text-left transition hover:bg-zinc-50"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-950 text-white">

              <Sparkles
                size={16}
              />

            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs text-zinc-400">
                Ask LifeOps
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-zinc-950">
                {query}
              </p>

            </div>

            <ArrowRight
              size={15}
              className="text-zinc-300"
            />

          </button>

        )}


        <div className="p-3">

          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Quick actions
          </p>


          {quickActions.map(
            (item) => {

              const Icon =
                item.icon;

              return (
                <button
                  key={
                    item.label
                  }

                  onClick={
                    () => {

                      if (
                        "href" in item
                      ) {

                        close();

                        router.push(
                          item.href
                        );

                        return;
                      }

                      if (
                        item.action ===
                        "upload"
                      ) {

                        close();

                        window.setTimeout(
                          () =>
                            openUniversalDrop(),
                          100
                        );

                        return;
                      }

                      runCommand(
                        item.label
                      );
                    }
                  }

                  className="flex w-full items-center gap-4 rounded-[18px] px-3 py-3 text-left transition hover:bg-zinc-100/70"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-zinc-100 text-zinc-600">

                    <Icon
                      size={15}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium text-zinc-900">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-400">
                      {item.description}
                    </p>

                  </div>

                </button>
              );
            }
          )}

        </div>


        <div className="flex items-center justify-between border-t border-black/[0.05] px-5 py-3 text-[11px] text-zinc-400">

          <span>
            LifeOps
          </span>

          <div className="flex items-center gap-3">

            <span>
              ↵ Select
            </span>

            <span>
              esc Close
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}