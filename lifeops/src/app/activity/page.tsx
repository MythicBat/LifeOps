import { Sidebar } from "@/components/navigation/Sidebar";
import { LiveActivityFeed } from "@/components/lifeops/LiveActivityFeed";

export default function ActivityPage() {
    return (
        <main className="flex min-h-screen bg-[#f5f5f7]">
            <Sidebar />

            <section className="min-w-0 flex-1">
                <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-12">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                        Activity
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                        Quietly handled.
                    </h1>

                    <p className="mt-3 text-zinc-500">
                        A transparant record of what LifeOps has done on your behalf.
                    </p>

                    <div className="mt-10">
                        <LiveActivityFeed />
                    </div>
                </div>
            </section>
        </main>
    );
}