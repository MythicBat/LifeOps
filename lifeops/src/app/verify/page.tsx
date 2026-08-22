"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import {
  ArrowRight,
  MailCheck,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";


export default function VerifyPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get(
      "email",
    ) ?? "";

  const [
    code,
    setCode,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resending,
    setResending,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  async function submit(
    event:
      SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setMessage(null);

    if (
      !email ||
      !code.trim()
    ) {
      setError(
        "Enter the verification code sent to your email.",
      );

      return;
    }

    setLoading(true);

    try {
      await confirmSignUp({
        username:
          email,

        confirmationCode:
          code.trim(),
      });

      router.push(
        `/login?verified=1&email=${encodeURIComponent(
          email,
        )}`,
      );

    } catch (error) {
      console.error(
        "Verification error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify your account.",
      );

    } finally {
      setLoading(false);
    }
  }


  async function resend() {
    if (!email) {
      return;
    }

    setError(null);
    setMessage(null);
    setResending(true);

    try {
      await resendSignUpCode({
        username:
          email,
      });

      setMessage(
        "A new verification code has been sent.",
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend the code.",
      );

    } finally {
      setResending(false);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-5 py-8">

      <div className="w-full max-w-[500px] rounded-[34px] border border-black/[0.05] bg-white p-7 shadow-[0_30px_100px_rgba(0,0,0,0.08)] sm:p-10">

        <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-zinc-950 text-white">

          <MailCheck
            size={19}
          />

        </div>


        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Verify your email
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-zinc-950">
          One last step.
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">

          We sent a verification code to{" "}

          <span className="font-medium text-zinc-800">
            {email ||
              "your email"}
          </span>
          .

        </p>


        <form
          onSubmit={
            submit
          }
          className="mt-8"
        >

          <label className="block">

            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Verification code
            </span>

            <input
              value={
                code
              }

              onChange={
                (event) =>
                  setCode(
                    event.target
                      .value
                      .replace(
                        /\D/g,
                        "",
                      )
                      .slice(
                        0,
                        6,
                      ),
                  )
              }

              inputMode="numeric"

              autoComplete="one-time-code"

              placeholder="000000"

              className="h-14 w-full rounded-[17px] border border-black/[0.07] bg-white px-4 text-center text-xl font-semibold tracking-[0.35em] text-zinc-950 outline-none transition placeholder:text-zinc-200 focus:border-zinc-400 focus:ring-4 focus:ring-black/[0.035]"
            />

          </label>


          {error && (

            <div className="mt-4 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>

          )}


          {message && (

            <div className="mt-4 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>

          )}


          <button
            type="submit"

            disabled={
              loading ||
              code.length !== 6
            }

            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40"
          >

            {loading
              ? "Verifying..."
              : "Verify email"}

            {!loading && (
              <ArrowRight
                size={15}
              />
            )}

          </button>

        </form>


        <button
          onClick={
            resend
          }

          disabled={
            resending ||
            !email
          }

          className="mt-5 w-full text-center text-sm font-medium text-zinc-400 transition hover:text-zinc-950 disabled:opacity-40"
        >
          {resending
            ? "Sending..."
            : "Resend verification code"}
        </button>

      </div>

    </main>
  );
}