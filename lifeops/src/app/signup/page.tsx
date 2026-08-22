"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  signUp,
} from "aws-amplify/auth";


export default function SignupPage() {
  const router =
    useRouter();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  async function submit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const trimmedName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !trimmedName ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please complete all fields.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    setLoading(true);

    try {
      const result =
        await signUp({
          username:
            normalizedEmail,

          password,

          options: {
            userAttributes: {
              email:
                normalizedEmail,

              name:
                trimmedName,
            },
          },
        });

      const nextStep =
        result.nextStep
          .signUpStep;

      if (
        nextStep ===
        "CONFIRM_SIGN_UP"
      ) {
        router.push(
          `/verify?email=${encodeURIComponent(
            normalizedEmail,
          )}`,
        );

        return;
      }

      router.push(
        "/login",
      );

    } catch (error) {
      console.error(
        "Signup error:",
        error,
      );

      if (
        error instanceof Error
      ) {
        setError(
          error.message,
        );
      } else {
        setError(
          "Unable to create your LifeOps account.",
        );
      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 sm:px-6">

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1180px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[36px] border border-black/[0.05] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT SIDE */}

          <section className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-2.5">

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

            </div>


            <div className="relative max-w-md">

              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/10">

                <Sparkles
                  size={18}
                />

              </div>

              <h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em]">
                Less life admin.
                <br />
                More life.
              </h2>

              <p className="mt-5 max-w-sm text-base leading-7 text-white/50">
                LifeOps quietly handles routine work and only surfaces when a real decision needs you.
              </p>

            </div>


            <p className="relative text-xs text-white/30">
              Powered by AWS
            </p>

          </section>


          {/* SIGNUP FORM */}

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
                  Create account
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-4xl">
                  Start putting life on autopilot.
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Create your LifeOps account and let the routine things start taking care of themselves.
                </p>

              </div>


              <form
                onSubmit={
                  submit
                }
                className="mt-9 space-y-5"
              >

                <Field
                  label="Full name"
                >
                  <input
                    value={
                      name
                    }

                    onChange={
                      (event) =>
                        setName(
                          event.target
                            .value,
                        )
                    }

                    autoComplete="name"

                    placeholder="Your name"

                    className={inputClass}
                  />
                </Field>


                <Field
                  label="Email"
                >
                  <input
                    type="email"

                    value={
                      email
                    }

                    onChange={
                      (event) =>
                        setEmail(
                          event.target
                            .value,
                        )
                    }

                    autoComplete="email"

                    placeholder="you@example.com"

                    className={inputClass}
                  />
                </Field>


                <Field
                  label="Password"
                >
                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      value={
                        password
                      }

                      onChange={
                        (event) =>
                          setPassword(
                            event.target
                              .value,
                          )
                      }

                      autoComplete="new-password"

                      placeholder="Create a password"

                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"

                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }

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
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>

                  </div>
                </Field>


                <Field
                  label="Confirm password"
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={
                      confirmPassword
                    }

                    onChange={
                      (event) =>
                        setConfirmPassword(
                          event.target
                            .value,
                        )
                    }

                    autoComplete="new-password"

                    placeholder="Repeat your password"

                    className={inputClass}
                  />
                </Field>


                <div className="rounded-[18px] bg-[#f5f5f7] px-4 py-3.5 text-xs leading-5 text-zinc-500">
                  Use at least 8 characters and follow your LifeOps account password requirements.
                </div>


                {error && (

                  <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                    {error}
                  </div>

                )}


                <button
                  type="submit"

                  disabled={
                    loading
                  }

                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={15}
                    />
                  )}

                </button>

              </form>


              <p className="mt-7 text-center text-sm text-zinc-400">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-medium text-zinc-950 hover:underline"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>

      {children}

    </label>
  );
}


const inputClass = "h-12 w-full rounded-[16px] border border-black/[0.07] bg-white px-4 text-[15px] text-zinc-950 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400 focus:ring-4 focus:ring-black/[0.035]";