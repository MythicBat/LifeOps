"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
} from "@/components/navigation/Sidebar";


interface UpcomingItem {
  id: string;

  type:
    | "obligation"
    | "warranty"
    | "renewal"
    | "appointment";

  title: string;

  date?: string;

  time?: string;

  amount?: number;

  location?: string;
}


export default function UpcomingPage() {
  const [
    items,
    setItems,
  ] =
    useState<
      UpcomingItem[]
    >([]);

  useEffect(() => {
    fetch(
      "/api/upcoming"
    )
      .then(
        (response) =>
          response.json()
      )
      .then(
        (data) =>
          setItems(
            data.items ?? []
          )
      )
      .catch(
        console.error
      );
  }, []);

  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">

      <Sidebar />

      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-12">

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Upcoming
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            What is ahead.
          </h1>

          <p className="mt-3 text-zinc-500">
            Deadlines, renewals and appointments LifeOps is already watching.
          </p>

          <div className="mt-10 space-y-3">

            {items.length ===
            0 ? (

              <div className="rounded-[28px] bg-white p-10 text-center">
                <Clock3
                  size={22}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm text-zinc-400">
                  Nothing upcoming.
                </p>
              </div>

            ) : (

              items.map(
                (item) => (

                  <UpcomingCard
                    key={
                      item.id
                    }
                    item={
                      item
                    }
                  />

                )
              )
            )}

          </div>

        </div>

      </section>

    </main>
  );
}


function UpcomingCard({
  item,
}: {
  item: UpcomingItem;
}) {
  const Icon =
    item.type ===
    "obligation"
      ? CreditCard

      : item.type ===
          "warranty"
        ? ShieldCheck

        : item.type ===
            "renewal"
          ? RefreshCcw

          : CalendarDays;

  return (
    <div className="flex items-center gap-5 rounded-[24px] border border-black/[0.05] bg-white p-5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-zinc-100">

        <Icon
          size={18}
          className="text-zinc-600"
        />

      </div>

      <div className="min-w-0 flex-1">

        <p className="font-medium text-zinc-950">
          {item.title}
        </p>

        <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-zinc-400">

          {item.date && (
            <span>
              {item.date}
            </span>
          )}

          {item.time && (
            <span>
              {item.time}
            </span>
          )}

          {item.location && (
            <span>
              {item.location}
            </span>
          )}

        </div>

      </div>

      {item.amount !==
        undefined && (
        <span className="text-sm font-semibold text-zinc-900">
          $
          {Number(
            item.amount
          ).toFixed(2)}
        </span>
      )}

    </div>
  );
}