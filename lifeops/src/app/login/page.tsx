"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  signIn,
} from "aws-amplify/auth";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const verified =
    searchParams.get("verified") === "1";

  const initialEmail =
    searchParams.get("email") ?? "";

  const [email, setEmail] =
    useState(initialEmail);

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  async function submit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !password
    ) {
      setError(
        "Enter your email and password.",
      );

      return;
    }

    setLoading(true);

    try {
      const result =
        await signIn({
          username:
            normalizedEmail,

          password,
        });

      const step =
        result.nextStep.signInStep;

      if (
        step === "DONE"
      ) {
        router.replace("/");
        return;
      }

      setError(
        `Additional sign-in step required: ${step}`,
      );

    } catch (error) {
      console.error(
        "Login error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 sm:px-6">

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1180px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[36px] border border-black/[0.05] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT */}

          <section className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative flex items-center gap-2.5">

              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-sm font-semibold text-zinc-950">
                L
              </div>

              <div>
                <p className="text-sm font-semibold">
                  LifeOps
                </p>

                <p className="text-xs text-white/40">
                  Life, handled.
                </p>
              </div>

            </div>


            <div className="relative max-w-md">

              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/10">
                <LogIn size={18} />
              </div>

              <h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em]">
                Welcome back.
              </h2>

              <p className="mt-5 max-w-sm text-base leading-7 text-white/50">
                Your life state, decisions and preferences are waiting for you.
              </p>

            </div>


            <p className="relative text-xs text-white/30">
              Powered by AWS
            </p>

          </section>


          {/* FORM */}

          <section className="p-7 sm:p-10 lg:p-14">

            <div className="mx-auto max-w-[460px]">

              <div className="lg:hidden">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-zinc-950 text-sm font-semibold text-white">
                    L
                  </div>

                  <p className="text-sm font-semibold text-zinc-950">
                    LifeOps
                  </p>

                </div>

              </div>


              <div className="mt-10 lg:mt-0">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Sign in
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
                  Pick up where LifeOps left off.
                </h1>

              </div>


              {verified && (

                <div className="mt-6 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Email verified. You can sign in now.
                </div>

              )}


              <form
                onSubmit={submit}
                className="mt-9 space-y-5"
              >

                <label className="block">

                  <span className="mb-2 block text-sm font-medium text-zinc-700">
                    Email
                  </span>

                  <input
                    type="email"

                    value={email}

                    onChange={
                      (event) =>
                        setEmail(
                          event.target.value,
                        )
                    }

                    autoComplete="email"

                    placeholder="you@example.com"

                    className="h-12 w-full rounded-[16px] border border-black/[0.07] bg-white px-4 text-[15px] text-zinc-950 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400 focus:ring-4 focus:ring-black/[0.035]"
                  />

                </label>


                <label className="block">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-medium text-zinc-700">
                      Password
                    </span>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-zinc-400 transition hover:text-zinc-950"
                    >
                      Forgot password?
                    </Link>

                  </div>


                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      value={password}

                      onChange={
                        (event) =>
                          setPassword(
                            event.target.value,
                          )
                      }

                      autoComplete="current-password"

                      placeholder="Your password"

                      className="h-12 w-full rounded-[16px] border border-black/[0.07] bg-white px-4 pr-12 text-[15px] text-zinc-950 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400 focus:ring-4 focus:ring-black/[0.035]"
                    />

                    <button
                      type="button"

                      onClick={
                        () =>
                          setShowPassword(
                            (current) =>
                              !current,
                          )
                      }

                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </label>


                {error && (

                  <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                    {error}
                  </div>

                )}


                <button
                  type="submit"

                  disabled={loading}

                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <ArrowRight size={15} />
                  )}
                </button>

              </form>


              <p className="mt-7 text-center text-sm text-zinc-400">

                New to LifeOps?{" "}

                <Link
                  href="/signup"
                  className="font-medium text-zinc-950 hover:underline"
                >
                  Create an account
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}