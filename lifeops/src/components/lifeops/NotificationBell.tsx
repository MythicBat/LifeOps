"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CircleAlert,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { authFetch } from "@/lib/auth/auth-fetch";


interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  target?: string;
}


export function NotificationBell() {
  const router = useRouter();

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    open,
    setOpen,
  ] = useState(false);


  useEffect(() => {
    authFetch(
      "/api/notifications"
    )
      .then(
        (response) =>
          response.json()
      )
      .then(
        (data) =>
          setNotifications(
            data.notifications ?? []
          )
      )
      .catch(console.error);
  }, []);


  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-zinc-500 shadow-sm transition hover:text-zinc-950"
      >
        <Bell size={17} />

        {notifications.length >
          0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-semibold text-white">
            {notifications.length}
          </span>
        )}
      </button>


      {open && (
        <>
          <button
            aria-label="Close notifications"
            onClick={() =>
              setOpen(false)
            }
            className="fixed inset-0 z-40 bg-transparent sm:hidden"
          />

          <div
            className="
              fixed left-4 right-4 top-20 z-50
              max-h-[calc(100dvh-7rem)]
              overflow-hidden
              rounded-[24px]
              border border-black/[0.07]
              bg-white
              shadow-[0_25px_80px_rgba(0,0,0,0.14)]

              sm:absolute
              sm:left-auto
              sm:right-0
              sm:top-14
              sm:w-[360px]
              sm:max-h-none
            "
          >
            <div className="border-b border-black/[0.05] px-5 py-4">
              <p className="text-sm font-semibold text-zinc-950">
                Needs your attention
              </p>
            </div>


            {notifications.length ===
            0 ? (
              <div className="px-6 py-10 text-center">
                <Bell
                  size={19}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm text-zinc-400">
                  You are all clear.
                </p>
              </div>
            ) : (
              <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto overscroll-contain sm:max-h-[430px]">
                {notifications.map(
                  (
                    notification
                  ) => (
                    <button
                      key={
                        notification.id
                      }
                      onClick={() => {
                        if (
                          notification.target ===
                          "decisions"
                        ) {
                          const decisions =
                            document.getElementById(
                              "decisions"
                            );

                          if (
                            decisions
                          ) {
                            decisions.scrollIntoView(
                              {
                                behavior:
                                  "smooth",
                              }
                            );
                          } else {
                            router.push(
                              "/#decisions"
                            );
                          }
                        } else if (
                          notification.target ===
                          "upcoming"
                        ) {
                          router.push(
                            "/upcoming"
                          );
                        }

                        setOpen(
                          false
                        );
                      }}
                      className="flex w-full gap-3 border-b border-black/[0.05] px-5 py-4 text-left transition last:border-0 hover:bg-zinc-50"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                        <CircleAlert
                          size={14}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium text-zinc-900">
                          {
                            notification.title
                          }
                        </p>

                        <p className="mt-1 break-words text-xs leading-5 text-zinc-400">
                          {
                            notification.description
                          }
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}