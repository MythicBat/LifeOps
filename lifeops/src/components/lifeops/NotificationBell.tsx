"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CircleAlert,
} from "lucide-react";


interface Notification {
  id: string;

  type: string;

  title: string;

  description: string;

  priority: string;

  target?: string;
}


export function NotificationBell() {

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      Notification[]
    >([]);

  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );


  useEffect(() => {

    fetch(
      "/api/notifications"
    )
      .then(
        (
          response
        ) =>
          response.json()
      )
      .then(
        (
          data
        ) =>
          setNotifications(
            data.notifications
            ?? []
          )
      )
      .catch(
        console.error
      );

  }, []);


  return (
    <div className="relative">

      <button
        onClick={
          () =>
            setOpen(
              !open
            )
        }

        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-zinc-500 shadow-sm transition hover:text-zinc-950"
      >

        <Bell
          size={17}
        />

        {notifications.length >
          0 && (

          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-semibold text-white">
            {
              notifications.length
            }
          </span>

        )}

      </button>


      {open && (

        <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-[24px] border border-black/[0.07] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.14)]">

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

            <div className="max-h-[430px] overflow-y-auto">

              {notifications.map(
                (
                  notification
                ) => (

                <button
                  key={
                    notification.id
                  }

                  onClick={
                    () => {

                      if (
                        notification.target
                        ===
                        "decisions"
                      ) {

                        document
                          .getElementById(
                            "decisions"
                          )
                          ?.scrollIntoView({
                            behavior:
                              "smooth",
                          });

                      } else if (
                        notification.target
                        ===
                        "upcoming"
                      ) {

                        window.location.href =
                          "/upcoming";
                      }

                      setOpen(
                        false
                      );
                    }
                  }

                  className="flex w-full gap-3 border-b border-black/[0.05] px-5 py-4 text-left transition last:border-0 hover:bg-zinc-50"
                >

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">

                    <CircleAlert
                      size={14}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-zinc-900">
                      {
                        notification.title
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                      {
                        notification.description
                      }
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>
      )}

    </div>
  );
}