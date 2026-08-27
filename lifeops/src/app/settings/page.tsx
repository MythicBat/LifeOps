"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Clock3,
  LogOut,
  Mail,
  User,
  WalletCards,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Sidebar,
} from "@/components/navigation/Sidebar";

import {
  getLifeOpsUser,
  logout,
  type LifeOpsUser,
} from "@/lib/auth/user";


export default function SettingsPage() {
  const router =
    useRouter();

  const [
    user,
    setUser,
  ] =
    useState<
      LifeOpsUser | null
    >(null);

  const [
    notifications,
    setNotifications,
  ] =
    useState(true);

  const [
    timezone,
    setTimezone,
  ] =
    useState(
      "Australia/Melbourne"
    );

  const [
    currency,
    setCurrency,
  ] =
    useState(
      "AUD"
    );


  useEffect(() => {
    getLifeOpsUser()
      .then(setUser)
      .catch(console.error);
  }, []);


  async function handleLogout() {
    await logout();

    router.replace(
      "/login"
    );

    router.refresh();
  }


  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">

      <Sidebar />

      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-[900px] px-5 pb-28 pt-8 md:px-10 lg:px-12 lg:py-10">

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            Settings
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">
            Make LifeOps yours.
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
            Manage your profile, preferences and account experience.
          </p>


          <div className="mt-10 space-y-6">

            {/* PROFILE */}

            <section className="rounded-[30px] border border-black/[0.05] bg-white p-6 sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-zinc-100 text-zinc-600">
                  <User size={17} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-zinc-950">
                    Profile
                  </p>

                  <p className="text-xs text-zinc-400">
                    Your Cognito account
                  </p>

                </div>

              </div>


              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <SettingField
                  label="Name"
                  value={
                    user?.name ??
                    "Loading..."
                  }
                  icon={User}
                />

                <SettingField
                  label="Email"
                  value={
                    user?.email ??
                    "Loading..."
                  }
                  icon={Mail}
                />

              </div>

            </section>


            {/* PREFERENCES */}

            <section className="rounded-[30px] border border-black/[0.05] bg-white p-6 sm:p-7">

              <p className="text-sm font-semibold text-zinc-950">
                Preferences
              </p>

              <div className="mt-6 divide-y divide-black/[0.05]">

                <div className="flex items-center justify-between gap-6 py-4 first:pt-0">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-zinc-100 text-zinc-500">
                      <Bell size={15} />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-zinc-900">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-400">
                        Surface decisions and urgent deadlines.
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      () =>
                        setNotifications(
                          (current) =>
                            !current
                        )
                    }

                    className={`relative h-7 w-12 rounded-full transition ${
                      notifications
                        ? "bg-zinc-950"
                        : "bg-zinc-200"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        notifications
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>


                <div className="flex items-center justify-between gap-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-zinc-100 text-zinc-500">
                      <Clock3 size={15} />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-zinc-900">
                        Timezone
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-400">
                        Used for reminders and timeline dates.
                      </p>

                    </div>

                  </div>


                  <select
                    value={timezone}
                    onChange={
                      (event) =>
                        setTimezone(
                          event.target.value
                        )
                    }

                    className="rounded-[14px] border border-black/[0.07] bg-white px-3 py-2 text-sm text-zinc-700 outline-none"
                  >
                    <option value="Australia/Melbourne">
                      Melbourne
                    </option>

                    <option value="Australia/Sydney">
                      Sydney
                    </option>

                    <option value="UTC">
                      UTC
                    </option>
                  </select>

                </div>


                <div className="flex items-center justify-between gap-6 py-4 last:pb-0">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-zinc-100 text-zinc-500">
                      <WalletCards size={15} />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-zinc-900">
                        Currency
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-400">
                        Used for bills and subscription insights.
                      </p>

                    </div>

                  </div>


                  <select
                    value={currency}
                    onChange={
                      (event) =>
                        setCurrency(
                          event.target.value
                        )
                    }

                    className="rounded-[14px] border border-black/[0.07] bg-white px-3 py-2 text-sm text-zinc-700 outline-none"
                  >
                    <option value="AUD">
                      AUD
                    </option>

                    <option value="USD">
                      USD
                    </option>

                    <option value="GBP">
                      GBP
                    </option>
                  </select>

                </div>

              </div>

            </section>


            {/* ACCOUNT */}

            <section className="rounded-[30px] border border-black/[0.05] bg-white p-6 sm:p-7">

              <p className="text-sm font-semibold text-zinc-950">
                Account
              </p>

              <button
                type="button"
                onClick={
                  handleLogout
                }

                className="mt-5 flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                <LogOut size={15} />

                Sign out
              </button>

            </section>

          </div>

        </div>

      </section>

    </main>
  );
}


function SettingField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
  }>;
}) {

  return (
    <div className="rounded-[20px] bg-[#f5f5f7] p-4">

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Icon size={13} />
        {label}
      </div>

      <p className="mt-2 truncate text-sm font-medium text-zinc-900">
        {value}
      </p>

    </div>
  );
}