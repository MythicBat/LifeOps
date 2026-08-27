"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  CheckCircle2,
  Database,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
} from "@/components/navigation/Sidebar";

import {
  getAutonomy,
  type AutonomySettings,
} from "@/lib/autonomy";

import {
  getLifeOpsUser,
  type LifeOpsUser,
} from "@/lib/auth/user";


export default function TrustCentrePage() {

  const [
    user,
    setUser,
  ] =
    useState<
      LifeOpsUser | null
    >(null);

  const [
    autonomy,
    setAutonomy,
  ] =
    useState<
      AutonomySettings | null
    >(null);


  useEffect(() => {

    getLifeOpsUser()
      .then(setUser)
      .catch(console.error);

    getAutonomy()
      .then(setAutonomy)
      .catch(console.error);

  }, []);


  const autoCount =
    autonomy
      ? Object.values(
          autonomy
        ).filter(
          (value) =>
            value === "auto"
        ).length
      : 0;


  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">

      <Sidebar />

      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-[960px] px-5 pb-28 pt-8 md:px-10 lg:px-12 lg:py-10">

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Trust Centre
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">
            You decide what LifeOps can do.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
            See how identity, data access, AI reasoning and autonomy are protected across LifeOps.
          </p>


          {/* HERO */}

          <section className="mt-10 overflow-hidden rounded-[32px] bg-zinc-950 p-7 text-white sm:p-8">

            <div className="flex items-start justify-between gap-6">

              <div>

                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/10">
                  <ShieldCheck
                    size={19}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">
                  Protected by design.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                  Cognito verifies identity, Guardian enforces action boundaries, and every user&apos;s LifeOps state is isolated by their authenticated user ID.
                </p>

              </div>


              <div className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                Protected
              </div>

            </div>

          </section>


          {/* TRUST LAYERS */}

          <section className="mt-8">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Trust layers
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <TrustCard
                icon={KeyRound}
                title="Identity"
                description="Amazon Cognito authenticates every LifeOps user and issues signed access tokens."
                detail={
                  user?.email ??
                  "Authenticated session"
                }
              />

              <TrustCard
                icon={Database}
                title="Data isolation"
                description="Vault, timeline, decisions and autonomy are scoped to the authenticated Cognito user ID."
                detail="Per-user AWS state"
              />

              <TrustCard
                icon={Brain}
                title="AI reasoning"
                description="Nova can recommend and interpret, but it cannot bypass deterministic safety controls."
                detail="Bedrock + Strands"
              />

              <TrustCard
                icon={SlidersHorizontal}
                title="Autonomy"
                description="You control which categories LifeOps may handle automatically and which require approval."
                detail={
                  autonomy
                    ? `${autoCount} categories on Auto`
                    : "Loading preferences..."
                }
              />

            </div>

          </section>


          {/* HARD BOUNDARIES */}

          <section className="mt-8 rounded-[30px] border border-black/[0.05] bg-white p-6 sm:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100 text-zinc-600">
                <LockKeyhole
                  size={17}
                />
              </div>

              <div>

                <p className="text-sm font-semibold text-zinc-950">
                  Always requires approval
                </p>

                <p className="text-xs text-zinc-400">
                  Hard Guardian boundaries override autonomy settings.
                </p>

              </div>

            </div>


            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {[
                "Spending money",
                "Cancelling services",
                "Submitting forms",
                "Signing agreements",
                "Sharing sensitive information",
                "Deleting important information",
              ].map(
                (item) => (

                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] bg-[#f5f5f7] px-4 py-3"
                >
                  <CheckCircle2
                    size={15}
                    className="text-zinc-500"
                  />

                  <span className="text-sm text-zinc-600">
                    {item}
                  </span>
                </div>

              )
            )}

            </div>

          </section>


          {/* ARCHITECTURE */}

          <section className="mt-8 rounded-[30px] border border-black/[0.05] bg-white p-6 sm:p-7">

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <Sparkles
                size={13}
              />

              How trust flows
            </div>


            <div className="mt-6 grid gap-3 md:grid-cols-5">

              {[
                "Cognito",
                "JWT",
                "Strands",
                "Guardian",
                "Executor",
              ].map(
                (
                  item,
                  index,
                ) => (

                <div
                  key={item}
                  className="relative"
                >

                  <div className="rounded-[18px] bg-[#f5f5f7] px-4 py-4 text-center text-sm font-medium text-zinc-700">
                    {item}
                  </div>

                  {index < 4 && (

                    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-zinc-300 md:block">
                      →
                    </span>

                  )}

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


function TrustCard({
  icon: Icon,
  title,
  description,
  detail,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;
  title: string;
  description: string;
  detail: string;
}) {

  return (
    <div className="rounded-[26px] border border-black/[0.05] bg-white p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100 text-zinc-600">
        <Icon size={16} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-zinc-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-400">
        {description}
      </p>

      <p className="mt-4 text-xs font-medium text-zinc-600">
        {detail}
      </p>

    </div>
  );
}