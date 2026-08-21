"use client";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import {
  Sidebar,
} from "@/components/navigation/Sidebar";

import {
  VaultCard,
} from "@/components/lifeops/VaultCard";

import {
  VaultDetail,
} from "@/components/lifeops/VaultDetail";

import {
  getVault,
  type VaultCategory,
  type VaultItem,
} from "@/lib/vault";


const categories: {
  id: VaultCategory;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "money",
    label: "Money",
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "health",
    label: "Health",
  },
  {
    id: "documents",
    label: "Documents",
  },
];


export default function VaultPage() {

  const router = useRouter();

  const [
    items,
    setItems,
  ] =
    useState<VaultItem[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState<VaultCategory>(
      "all"
    );

  const [
    selected,
    setSelected,
  ] =
    useState<VaultItem | null>(
      null
    );


  useEffect(() => {

    getVault()
      .then(
        (vault) =>
          setItems(
            vault.items ?? []
          )
      )
      .catch(
        console.error
      )
      .finally(
        () =>
          setLoading(false)
      );

  }, []);


  const filtered =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();

        return items.filter(
          (item) => {

            const matchesCategory =
              category ===
                "all"
                ||
              item.category ===
                category;

            const matchesSearch =
              !query
              ||
              item.title
                .toLowerCase()
                .includes(
                  query
                )
              ||
              item.subtitle
                ?.toLowerCase()
                .includes(
                  query
                );

            return (
              matchesCategory
              &&
              matchesSearch
            );
          }
        );
      },
      [
        items,
        search,
        category,
      ]
    );


  return (
    <main className="flex min-h-screen bg-[#f5f5f7]">

      <Sidebar />

      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-[1180px] px-6 py-10 lg:px-12">


          {/* HEADER */}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Life Vault
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">
                Everything, understood.
              </h1>

              <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                Bills, subscriptions, purchases and appointments become living objects LifeOps can understand and manage.
              </p>

            </div>

            <button
              onClick={() => router.push("/?add=true")}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              <Plus
                size={16}
              />

              Add anything
            </button>

          </div>


          {/* SEARCH */}

          <div className="mt-10 flex items-center gap-3 rounded-[22px] border border-black/[0.045] bg-white px-5 shadow-[0_6px_25px_rgba(0,0,0,0.02)]">

            <Search
              size={17}
              className="shrink-0 text-zinc-400"
            />

            <input
              value={
                search
              }

              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }

              placeholder="Search anything in your life..."

              className="w-full bg-transparent py-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />

          </div>


          {/* FILTERS */}

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">

            {categories.map(
              (item) => {

                const active =
                  category ===
                    item.id;

                return (
                  <button
                    key={
                      item.id
                    }

                    onClick={
                      () =>
                        setCategory(
                          item.id
                        )
                    }

                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-zinc-950 text-white"
                        : "bg-white text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
            )}

          </div>


          {/* RESULTS */}

          <div className="mt-8">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-sm font-medium text-zinc-500">

                {loading
                  ? "Loading your life..."
                  : `${filtered.length} ${
                      filtered.length === 1
                        ? "item"
                        : "items"
                    }`}

              </p>

            </div>


            {loading ? (

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3, 4, 5, 6]
                  .map(
                    (item) => (

                    <div
                      key={
                        item
                      }
                      className="h-[220px] animate-pulse rounded-[28px] bg-white"
                    />

                  )
                )}

              </div>

            ) : filtered.length >
              0 ? (

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {filtered.map(
                  (item) => (

                    <VaultCard
                      key={
                        item.id
                      }

                      item={
                        item
                      }

                      onClick={
                        () =>
                          setSelected(
                            item
                          )
                      }
                    />

                  )
                )}

              </div>

            ) : (

              <div className="rounded-[30px] border border-black/[0.05] bg-white px-6 py-20 text-center">

                <Search
                  size={22}
                  className="mx-auto text-zinc-300"
                />

                <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                  Nothing here yet.
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                  Add a bill, receipt, subscription or document and LifeOps will understand it automatically.
                </p>

              </div>
            )}

          </div>

        </div>

      </section>


      <VaultDetail
        item={
          selected
        }

        onClose={
          () =>
            setSelected(
              null
            )
        }
      />

    </main>
  );
}