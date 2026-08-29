"use client";

import {
  Clock3,
  Home,
  LockKeyhole,
  MoreHorizontal,
  Settings,
  SlidersHorizontal,
  Vault,
} from "lucide-react";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { UserProfile } from "@/components/auth/UserProfile";


const items = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock3,
  },
  {
    label: "Vault",
    href: "/vault",
    icon: Vault,
  },
  {
    label: "Autonomy",
    href: "/autonomy",
    icon: SlidersHorizontal,
  },
];


export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [moreOpen, setMoreOpen] =
    useState(false);

  const authPage = [
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
  ].some((route) =>
    pathname.startsWith(route)
  );

  if (authPage) {
    return null;
  }

  const moreActive =
    pathname === "/settings" ||
    pathname === "/trust-centre";

  return (
    <>
      {moreOpen && (
        <>
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] lg:hidden"
            onClick={() =>
              setMoreOpen(false)
            }
          />

          <div className="fixed bottom-[88px] left-4 right-4 z-50 overflow-hidden rounded-[24px] border border-black/[0.07] bg-white p-2 shadow-[0_25px_80px_rgba(0,0,0,0.18)] lg:hidden">
            <div className="px-3 pb-2 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                LifeOps
              </p>
            </div>

            <Link
              href="/trust-centre"
              onClick={() =>
                setMoreOpen(false)
              }
              className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium transition ${
                pathname ===
                "/trust-centre"
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <LockKeyhole
                size={17}
                strokeWidth={1.8}
              />

              Trust Center
            </Link>

            <Link
              href="/settings"
              onClick={() =>
                setMoreOpen(false)
              }
              className={`mt-1 flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium transition ${
                pathname ===
                "/settings"
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Settings
                size={17}
                strokeWidth={1.8}
              />

              Settings
            </Link>

            <div className="mt-2 border-t border-black/[0.06] pt-2">
              <UserProfile />
            </div>
          </div>
        </>
      )}

      <nav className="fixed bottom-3 left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 rounded-[22px] border border-white/70 bg-white/90 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl lg:hidden">
        {items.map(
          ({
            label,
            href,
            icon: Icon,
          }) => {
            const active =
              pathname === href;

            return (
              <button
                key={href}
                aria-label={label}
                onClick={() => {
                  setMoreOpen(false);
                  router.push(href)}
                }
                className={`flex h-12 w-[52px] flex-col items-center justify-center gap-1 rounded-[16px] transition sm:w-14 ${
                  active
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-400"
                }`}
              >
                <Icon size={16} />

                <span className="text-[9px] font-medium">
                  {label}
                </span>
              </button>
            );
          }
        )}

        <button
          aria-label="More"
          aria-expanded={moreOpen}
          onClick={() =>
            setMoreOpen(
              (current) => !current
            )
          }
          className={`flex h-12 w-[52px] flex-col items-center justify-center gap-1 rounded-[16px] transition sm:w-14 ${
            moreOpen || moreActive
              ? "bg-zinc-950 text-white"
              : "text-zinc-400"
          }`}
        >
          <MoreHorizontal
            size={17}
          />

          <span className="text-[9px] font-medium">
            More
          </span>
        </button>
      </nav>
    </>
  );
}