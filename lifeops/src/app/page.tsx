import { Sidebar } from "@/components/navigation/Sidebar";
import { AddAnythingButton } from "@/components/lifeops/AddAnythingButton";
import { DecisionFeed } from "@/components/lifeops/DecisionFeed";
import { LiveOverview } from "@/components/lifeops/LiveOverview";
import { LiveActivityFeed } from "@/components/lifeops/LiveActivityFeed";
import { AskLifeOps } from "@/components/lifeops/AskLifeOps";
import { DailyBrief } from "@/components/lifeops/DailyBrief";
import { NotificationBell } from "@/components/lifeops/NotificationBell";
import { CommandTrigger } from "@/components/lifeops/CommandTrigger";
import { LifeOpsHero } from "@/components/lifeops/LifeOpsHero";

import { getGreeting, getTodayLabel } from "@/lib/greeting";

import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{command?: string;}>
}) {

  const params = await searchParams;

  const incomingCommand = params.command ?? null;

  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">
      <Sidebar />

      <section className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1180px] px-5 pb-28 pt-7 md:px-10 lg:px-12 lg:py-12">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                {getTodayLabel()}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 md:text-4xl">
                {getGreeting()}
              </h1>

              <p className="mt-2 text-lg text-zinc-400">
                Life is under control.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CommandTrigger />

              <NotificationBell />
              
              <AddAnythingButton />
            </div>
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <LifeOpsHero />

            <LiveOverview />
          </section>

          <section className="mt-8">
            <DailyBrief />
          </section>

          <section className="mt-8">
            <AskLifeOps initialCommand={incomingCommand} />
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

              <Link
                href="/activity"
                className="text-sm font-medium text-zinc-400 transition hover:text-zinc-950"
              >
                View all
              </Link>
            </div>

            <LiveActivityFeed />
          </section>
        </div>
      </section>
    </main>
  );
}