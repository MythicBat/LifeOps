import { LifeOpsOrb } from "@/components/lifeops/LifeOpsOrb";
import { Sidebar } from "@/components/navigation/Sidebar";
import { AddAnythingButton } from "@/components/lifeops/AddAnythingButton";
import { DecisionFeed } from "@/components/lifeops/DecisionFeed";
import { LiveOverview } from "@/components/lifeops/LiveOverview";
import { LiveActivityFeed } from "@/components/lifeops/LiveActivityFeed";
import { AskLifeOps } from "@/components/lifeops/AskLifeOps";
import { DailyBrief } from "@/components/lifeops/DailyBrief";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">
      <Sidebar />

      <section className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1180px] px-6 py-8 md:px-10 lg:px-12 lg:py-12">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                Wednesday, August 12
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 md:text-4xl">
                Good afternoon.
              </h1>

              <p className="mt-2 text-lg text-zinc-400">
                Life is under control.
              </p>
            </div>

            <AddAnythingButton />
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-black/[0.05] bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.04)] md:p-10">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  <Sparkles size={14} />
                  LifeOps Brief
                </div>

                <div className="mt-2 flex justify-center">
                  <LifeOpsOrb state="idle" />
                </div>

                <div className="text-center">
                  <p className="text-5xl font-semibold tracking-[-0.05em] text-zinc-950">
                    7
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    things handled this week
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950">
                    View LifeOps activity

                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            <LiveOverview />
          </section>

          <section className="mt-8">
            <DailyBrief />
          </section>

          <section className="mt-8">
            <AskLifeOps />
          </section>

          <section
            id="decisions"
            className="mt-10"
          >
            <DecisionFeed />
          </section>

          <section className="mt-12 pb-16">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
                  Quietly handled
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                  Recent activity
                </h2>
              </div>

              <button className="text-sm font-medium text-zinc-400 transition hover:text-zinc-950">
                View all
              </button>
            </div>

            <LiveActivityFeed />
          </section>
        </div>
      </section>
    </main>
  );
}