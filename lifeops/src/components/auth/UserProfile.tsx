"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  LogOut,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  getLifeOpsUser,
  logout,
  type LifeOpsUser,
} from "@/lib/auth/user";


export function UserProfile() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<LifeOpsUser | null>(
      null,
    );


  useEffect(() => {
    getLifeOpsUser()
      .then(setUser)
      .catch(console.error);
  }, []);


  async function handleLogout() {
    await logout();

    router.replace(
      "/login",
    );

    router.refresh();
  }


  if (!user) {
    return (
      <div className="mt-5 flex items-center gap-3 border-t border-black/[0.05] px-3 pt-5">

        <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200" />

        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="h-2.5 w-28 animate-pulse rounded bg-zinc-100" />
        </div>

      </div>
    );
  }


  return (
    <div className="mt-5 border-t border-black/[0.05] px-2 pt-5">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
          {user.initials}
        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-medium text-zinc-900">
            {user.name}
          </p>

          <p className="truncate text-[11px] text-zinc-400">
            {user.email}
          </p>

        </div>


        <button
          aria-label="Sign out"

          onClick={
            handleLogout
          }

          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          <LogOut size={14} />
        </button>

      </div>

    </div>
  );
}