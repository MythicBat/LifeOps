"use client";

import {
  Activity,
  CalendarDays,
  Home,
  LockKeyhole,
  Settings,
  Vault,
  Network,
  SlidersHorizontal,
  ListTree,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserProfile } from "../auth/UserProfile";

const navigation = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Timeline",
    icon: ListTree,
    href: "/timeline",
  },
  {
    label: "Activity",
    icon: Activity,
    href: "/activity",
  },
  {
    label: "Vault",
    icon: Vault,
    href: "/vault",
  },
  {
    label: "Life Graph",
    icon: Network,
    href: "/graph",
  },
  {
    label: "Upcoming",
    icon: CalendarDays,
    href: "/upcoming",
  },
  {
    label: "Autonomy",
    icon: SlidersHorizontal,
    href: "/autonomy",
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-black/[0.05] bg-white/70 px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-zinc-950 text-xs font-semibold text-white">
            L
          </div>

          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-950">
              LifeOps
            </p>

            <p className="mt-0.5 text-[11px] text-zinc-400">
              Life, handled.
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition ${
                pathname === item.href
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link
          href="/trust"
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          <LockKeyhole size={17} strokeWidth={1.8} />
          Trust Center
        </Link>

        <Link
          href="/settings"
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          <Settings size={17} strokeWidth={1.8} />

          Settings
        </Link>

        <UserProfile />
      </div>
    </aside>
  );
}