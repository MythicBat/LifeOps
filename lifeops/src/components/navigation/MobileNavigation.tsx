"use client";

import {
  Clock3,
  Home,
  SlidersHorizontal,
  Vault,
} from "lucide-react";

import {
  usePathname,
  useRouter,
} from "next/navigation";


const items = [
  {
    label:
      "Home",

    href:
      "/",

    icon:
      Home,
  },

  {
    label:
      "Timeline",

    href:
      "/timeline",

    icon:
      Clock3,
  },

  {
    label:
      "Vault",

    href:
      "/vault",

    icon:
      Vault,
  },

  {
    label:
      "Autonomy",

    href:
      "/autonomy",

    icon:
      SlidersHorizontal,
  },
];


export function MobileNavigation() {

  const pathname =
    usePathname();

  const router =
    useRouter();


  return (
    <nav className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[22px] border border-white/70 bg-white/90 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl lg:hidden">

      {items.map(
        ({
          label,
          href,
          icon: Icon,
        }) => {

          const active =
            pathname ===
              href;

          return (
            <button
              key={
                href
              }

              aria-label={
                label
              }

              onClick={
                () =>
                  router.push(
                    href
                  )
              }

              className={`flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-[16px] transition ${
                active
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-400"
              }`}
            >

              <Icon
                size={16}
              />

              <span className="text-[9px] font-medium">
                {label}
              </span>

            </button>
          );
        }
      )}

    </nav>
  );
}