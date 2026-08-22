"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  LifeOpsOrb,
} from "@/components/lifeops/LifeOpsOrb";

import {
  getDashboard,
  type DashboardData,
} from "@/lib/dashboard";


export function LifeOpsHero() {
  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardData | null>(
    null,
  );

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch(console.error);
  }, []);

  const handled =
    dashboard?.counts.actionsHandled;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-black/[0.05] bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.04)] md:p-10">

      <div className="relative z-10">

        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
          <Sparkles size={14} />

          LifeOps
        </div>


        <div className="mt-2 flex justify-center">
          <LifeOpsOrb
            state="idle"
          />
        </div>


        <div className="text-center">

          {handled === undefined ? (

            <div className="mx-auto h-12 w-16 animate-pulse rounded-[14px] bg-zinc-100" />

          ) : (

            <p className="text-5xl font-semibold tracking-[-0.05em] text-zinc-950">
              {handled}
            </p>

          )}

          <p className="mt-2 text-sm text-zinc-400">
            actions quietly handled
          </p>

        </div>


        <div className="mt-8 flex justify-center">

          <Link
            href="/activity"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            View LifeOps activity

            <ArrowRight
              size={15}
            />
          </Link>

        </div>

      </div>

    </div>
  );
}