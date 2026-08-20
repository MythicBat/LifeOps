import { LifeGraph } from "@/components/lifeops/LifeGraph";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function GraphPage() {
    return (
        <main className="flex min-h-screen bg-[#f5f5f7]">
            <Sidebar />

            <section className="min-w-0 flex-1">
                <div className="mx-auto max-w-[1180px] px-6 py-10 lg:px-12">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                        Life Graph
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                        Your life, connected.
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                        LifeOps connects obligations, subscriptions, appointments, renewals, and decisions into one operational view.
                    </p>

                    <div className="mt-10">
                        <LifeGraph />
                    </div>
                </div>
            </section>
        </main>
    );
}