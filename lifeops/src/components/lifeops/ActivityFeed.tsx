import {
  CalendarDays,
  CreditCard,
  FileText,
  Receipt,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import type {
  ActivityItem,
  ActivityType,
} from "@/lib/types";

interface ActivityFeedProps {
  items: ActivityItem[];
}

function getIcon(type: ActivityType) {
  switch (type) {
    case "bill":
      return CreditCard;

    case "appointment":
      return CalendarDays;

    case "subscription":
      return WalletCards;

    case "receipt":
      return Receipt;

    case "warranty":
      return ShieldCheck;

    case "renewal":
      return FileText;
  }
}

export function ActivityFeed({
  items,
}: ActivityFeedProps) {
  return (
    <div className="rounded-[28px] border border-black/[0.05] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      {items.map((item, index) => {
        const Icon = getIcon(item.type);

        return (
          <div
            key={item.id}
            className={`flex items-center gap-4 px-5 py-5 ${
              index !== items.length - 1
                ? "border-b border-black/[0.05]"
                : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100">
              <Icon
                size={17}
                strokeWidth={1.7}
                className="text-zinc-600"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900">
                {item.title}
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                {item.detail}
              </p>
            </div>

            <span className="text-xs text-zinc-400">
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}