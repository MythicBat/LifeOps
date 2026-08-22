import { LifeTimeline } from "@/components/lifeops/LifeTimeline";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function TimelinePage() {
    return (
        <main className="flex min-h-screen bg-[#f5f5f7]">
            <Sidebar />

            <section className="min-w-0 flex-1">
                <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-12">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                        Life Timeline
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">
                        Your life, in order.
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                        What LifeOps handled, what is approaching and what still needs you.
                    </p>

                    <div className="mt-12">
                        <LifeTimeline />
                    </div>
                </div>
            </section>
        </main>
    );
}