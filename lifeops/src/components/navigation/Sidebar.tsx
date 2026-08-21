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
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Home",
    icon: Home,
    href: "/",
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
    <aside className="hidden h-screen w-[250px] shrink-0 border-r border-black/[0.06] bg-white/60 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white">
            L
          </div>

          <div>
            <p className="text-[15px] font-semibold tracking-tight text-zinc-950">
              LifeOps
            </p>

            <p className="text-xs text-zinc-400">
              Life, handled.
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-10 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
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
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950">
          <LockKeyhole size={17} strokeWidth={1.8} />
          Trust Centre
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950">
          <Settings size={17} strokeWidth={1.8} />
          Settings
        </button>

        <div className="mt-5 flex items-center gap-3 border-t border-black/[0.05] px-3 pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium">
            AM
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              Alin
            </p>

            <p className="text-xs text-zinc-400">
              Balanced autonomy
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}