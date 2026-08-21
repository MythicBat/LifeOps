"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  FileText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import {
  Sidebar,
} from "@/components/navigation/Sidebar";

import {
  getAutonomy,
  saveAutonomy,
  type AutonomyMode,
  type AutonomySettings,
} from "@/lib/autonomy";


const categories = [
  {
    key:
      "everydayAdmin",

    label:
      "Everyday admin",

    description:
      "Bills, obligations and reminders.",

    icon:
      Sparkles,
  },

  {
    key:
      "money",

    label:
      "Money",

    description:
      "Payments and financial actions.",

    icon:
      CreditCard,
  },

  {
    key:
      "subscriptions",

    label:
      "Subscriptions",

    description:
      "Recurring services and price changes.",

    icon:
      WalletCards,
  },

  {
    key:
      "appointments",

    label:
      "Appointments",

    description:
      "Scheduling and calendar-related actions.",

    icon:
      CalendarDays,
  },

  {
    key:
      "documents",

    label:
      "Documents",

    description:
      "Organisation and document handling.",

    icon:
      FileText,
  },

  {
    key:
      "warranties",

    label:
      "Warranties",

    description:
      "Product coverage and expiry tracking.",

    icon:
      ShieldCheck,
  },

  {
    key:
      "renewals",

    label:
      "Renewals",

    description:
      "Insurance, registrations and memberships.",

    icon:
      RefreshCcw,
  },
] as const;


export default function AutonomyPage() {

  const [
    settings,
    setSettings,
  ] =
    useState<
      AutonomySettings | null
    >(null);

  const [
    saving,
    setSaving,
  ] =
    useState(false);


  useEffect(() => {

    getAutonomy()
      .then(
        setSettings
      )
      .catch(
        console.error
      );

  }, []);


  const update = async (
    key:
      keyof AutonomySettings,

    mode:
      AutonomyMode,
  ) => {

    if (!settings) {
      return;
    }

    const next = {
      ...settings,

      [key]:
        mode,
    };

    setSettings(
      next
    );

    setSaving(
      true
    );

    try {
      const saved =
        await saveAutonomy(
          next
        );

      setSettings(
        saved
      );

    } finally {
      setSaving(
        false
      );
    }
  };


  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">

      <Sidebar />

      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-[950px] px-6 py-10 lg:px-12">

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Autonomy
          </p>

          <div className="mt-2 flex items-end justify-between gap-6">

            <div>

              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">
                You are in control.
              </h1>

              <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                Choose what LifeOps may handle automatically and when it should ask first.
              </p>

            </div>

            <span className="text-xs text-zinc-400">
              {saving
                ? "Saving..."
                : "Saved"}
            </span>

          </div>


          <div className="mt-10 space-y-3">

            {categories.map(
              ({
                key,
                label,
                description,
                icon: Icon,
              }) => {

                const mode =
                  settings?.[
                    key
                  ];

                return (
                  <div
                    key={
                      key
                    }
                    className="flex flex-col gap-5 rounded-[26px] border border-black/[0.05] bg-white p-5 sm:flex-row sm:items-center"
                  >

                    <div className="flex min-w-0 flex-1 items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-zinc-100">

                        <Icon
                          size={18}
                          className="text-zinc-600"
                        />

                      </div>

                      <div>

                        <p className="font-medium text-zinc-950">
                          {label}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {description}
                        </p>

                      </div>

                    </div>


                    <div className="grid grid-cols-3 rounded-[16px] bg-zinc-100 p-1">

                      {(
                        [
                          "observe",
                          "ask",
                          "auto",
                        ] as const
                      ).map(
                        (
                          option
                        ) => (

                        <button
                          key={
                            option
                          }

                          onClick={
                            () =>
                              update(
                                key,
                                option
                              )
                          }

                          className={`rounded-[12px] px-3 py-2 text-xs font-medium capitalize transition ${
                            mode ===
                            option

                              ? "bg-white text-zinc-950 shadow-sm"

                              : "text-zinc-400 hover:text-zinc-700"
                          }`}
                        >
                          {option}
                        </button>

                      )
                    )}

                    </div>

                  </div>
                );
              }
            )}

          </div>


          <section className="mt-10 rounded-[30px] bg-zinc-950 p-7 text-white sm:p-8">

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
              Always protected
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
              Never without approval.
            </h2>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              {[
                "Spending money",
                "Cancelling services",
                "Submitting forms",
                "Signing agreements",
                "Sharing sensitive information",
                "Deleting important information",
              ].map(
                (
                  item
                ) => (

                <div
                  key={
                    item
                  }
                  className="flex items-center gap-3 text-sm text-white/65"
                >

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white">
                    ✓
                  </span>

                  {item}

                </div>

              )
            )}

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}