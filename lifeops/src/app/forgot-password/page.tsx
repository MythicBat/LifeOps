"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
} from "lucide-react";

import Link from "next/link";

import {
  confirmResetPassword,
  resetPassword,
} from "aws-amplify/auth";


export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [code, setCode] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [stage, setStage] =
    useState<
      "request" | "confirm"
    >("request");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);


  async function requestCode(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await resetPassword({
        username:
          email.trim().toLowerCase(),
      });

      setStage(
        "confirm",
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send reset code.",
      );

    } finally {
      setLoading(false);
    }
  }


  async function confirm(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await confirmResetPassword({
        username:
          email.trim().toLowerCase(),

        confirmationCode:
          code.trim(),

        newPassword:
          password,
      });

      setSuccess(true);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reset password.",
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-5 py-8">

      <div className="w-full max-w-[500px] rounded-[34px] border border-black/[0.05] bg-white p-7 shadow-[0_30px_100px_rgba(0,0,0,0.08)] sm:p-10">

        <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-zinc-950 text-white">
          <KeyRound size={19} />
        </div>


        <h1 className="mt-8 text-3xl font-semibold tracking-[-0.045em] text-zinc-950">
          Reset your password.
        </h1>


        {success ? (

          <div className="mt-7">

            <div className="rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Your password has been updated.
            </div>

            <Link
              href="/login"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-zinc-950 text-sm font-medium text-white"
            >
              Return to sign in

              <ArrowRight size={15} />
            </Link>

          </div>

        ) : stage === "request" ? (

          <form
            onSubmit={requestCode}
            className="mt-8"
          >

            <p className="mb-6 text-sm leading-6 text-zinc-500">
              Enter the email address associated with your LifeOps account.
            </p>

            <input
              type="email"

              value={email}

              onChange={
                (event) =>
                  setEmail(
                    event.target.value,
                  )
              }

              placeholder="you@example.com"

              className="h-12 w-full rounded-[16px] border border-black/[0.07] px-4 text-sm outline-none focus:border-zinc-400 focus:ring-4 focus:ring-black/[0.035]"
            />

            {error && (
              <div className="mt-4 rounded-[18px] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-[17px] bg-zinc-950 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send reset code"}
            </button>

          </form>

        ) : (

          <form
            onSubmit={confirm}
            className="mt-8 space-y-5"
          >

            <p className="text-sm leading-6 text-zinc-500">
              Enter the code sent to{" "}
              <span className="font-medium text-zinc-800">
                {email}
              </span>
              .
            </p>

            <input
              value={code}

              onChange={
                (event) =>
                  setCode(
                    event.target.value,
                  )
              }

              placeholder="Verification code"

              className="h-12 w-full rounded-[16px] border border-black/[0.07] px-4 text-sm outline-none"
            />

            <input
              type="password"

              value={password}

              onChange={
                (event) =>
                  setPassword(
                    event.target.value,
                  )
              }

              placeholder="New password"

              className="h-12 w-full rounded-[16px] border border-black/[0.07] px-4 text-sm outline-none"
            />

            {error && (
              <div className="rounded-[18px] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-[17px] bg-zinc-950 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Set new password"}
            </button>

          </form>

        )}


        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-950"
        >
          <ArrowLeft size={14} />

          Back to sign in
        </Link>

      </div>

    </main>
  );
}