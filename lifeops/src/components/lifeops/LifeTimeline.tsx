"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Check,
  CircleAlert,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  getTimeline,
  type TimelineItem,
  type TimelineKind,
} from "@/lib/timeline";


export function LifeTimeline() {

  const [
    items,
    setItems,
  ] =
    useState<
      TimelineItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  useEffect(() => {

    getTimeline()
      .then(
        setItems
      )
      .catch(
        console.error
      )
      .finally(
        () =>
          setLoading(
            false
          )
      );

  }, []);


  const grouped =
    useMemo(
      () =>
        groupTimeline(
          items
        ),
      [
        items,
      ]
    );


  if (loading) {

    return (
      <div className="space-y-3">

        {[1, 2, 3, 4].map(
          (item) => (

          <div
            key={
              item
            }
            className="h-[100px] animate-pulse rounded-[24px] bg-white"
          />

        ))}

      </div>
    );
  }


  if (
    items.length === 0
  ) {

    return (
      <div className="rounded-[30px] border border-black/[0.05] bg-white px-6 py-16 text-center">

        <Sparkles
          size={21}
          className="mx-auto text-zinc-300"
        />

        <h3 className="mt-4 text-lg font-semibold text-zinc-900">
          Your timeline is clear.
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          LifeOps will place important events here as it learns about them.
        </p>

      </div>
    );
  }


  return (
    <div className="space-y-10">

      {Object.entries(
        grouped
      ).map(
        ([
          label,
          groupItems,
        ]) => (

        <section
          key={
            label
          }
        >

          <div className="mb-4 flex items-center gap-3">

            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {label}
            </h2>

            <div className="h-px flex-1 bg-black/[0.05]" />

          </div>


          <div className="relative">

            <div className="absolute bottom-5 left-[19px] top-5 w-px bg-black/[0.07]" />


            <div className="space-y-3">

              {groupItems.map(
                (item) => (

                <TimelineRow
                  key={
                    item.id
                  }

                  item={
                    item
                  }
                />

              ))}

            </div>

          </div>

        </section>

      ))}

    </div>
  );
}


function TimelineRow({
  item,
}: {
  item:
    TimelineItem;
}) {
  const needsYou =
    item.kind ===
      "decision";

  return (
    <div className="relative flex gap-4">

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
          needsYou
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : item.kind === "activity"
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-black/[0.06] bg-white text-zinc-500"
        }`}
      >

        <TimelineIcon
          kind={
            item.kind
          }
          size={15}
        />

      </div>


      <div className="min-w-0 flex-1 rounded-[22px] border border-black/[0.05] bg-white px-5 py-4 transition hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]">

        <div className="flex items-start justify-between gap-5">

          <div>

            <div className="flex items-center gap-2">

              <p className="text-sm font-medium text-zinc-950">
                {item.title}
              </p>

              {needsYou && (

                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  Needs you
                </span>

              )}

            </div>

            {item.description && (

              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>

            )}

          </div>


          {item.date && (

            <time className="shrink-0 text-xs text-zinc-400">
              {formatDate(
                item.date
              )}
            </time>

          )}

        </div>

      </div>

    </div>
  );
}


function TimelineIcon({
  kind,
  size,
}: {
  kind: TimelineKind;
  size: number;
}) {

  switch (kind) {

    case "activity":
      return <Check size={size} />;

    case "obligation":
      return <CreditCard size={size} />;

    case "appointment":
      return <CalendarDays size={size} />;

    case "renewal":
      return <RefreshCcw size={size} />;

    case "warranty":
      return <ShieldCheck size={size} />;

    case "decision":
      return <CircleAlert size={size} />;

    default:
      return <Sparkles size={size} />;
  }
}


function groupTimeline(
  items:
    TimelineItem[],
) {

  const groups:
    Record<
      string,
      TimelineItem[]
    > = {};


  for (
    const item
    of items
  ) {

    const label =
      timelineLabel(
        item.date
      );

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(
      item
    );
  }

  return groups;
}


function timelineLabel(
  value?: string,
) {

  if (!value) {
    return "Later";
  }

  const date =
    parseClientDate(
      value
    );

  if (!date) {
    return "Later";
  }

  const today =
    new Date();

  if (
    sameDay(
      date,
      today
    )
  ) {
    return "Today";
  }

  const tomorrow =
    new Date(
      today
    );

  tomorrow.setDate(
    today.getDate()
    + 1
  );

  if (
    sameDay(
      date,
      tomorrow
    )
  ) {
    return "Tomorrow";
  }

  return new Intl
    .DateTimeFormat(
      "en-AU",
      {
        month:
          "long",

        year:
          "numeric",
      }
    )
    .format(
      date
    );
}


function parseClientDate(
  value: string,
) {

  const direct =
    new Date(
      value
    );

  if (
    !Number.isNaN(
      direct.getTime()
    )
  ) {
    return direct;
  }

  const match =
    value.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

  if (!match) {
    return null;
  }

  return new Date(
    Number(
      match[3]
    ),

    Number(
      match[2]
    ) - 1,

    Number(
      match[1]
    )
  );
}


function sameDay(
  first:
    Date,

  second:
    Date,
) {

  return (
    first.getFullYear()
      ===
      second.getFullYear()

    &&

    first.getMonth()
      ===
      second.getMonth()

    &&

    first.getDate()
      ===
      second.getDate()
  );
}


function formatDate(
  value: string,
) {

  const date =
    parseClientDate(
      value
    );

  if (!date) {
    return value;
  }

  return new Intl
    .DateTimeFormat(
      "en-AU",
      {
        day:
          "numeric",

        month:
          "short",
      }
    )
    .format(
      date
    );
}