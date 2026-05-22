"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { verifyEmailToken } from "@/server/actions/verifyEmail";
import Link from "next/link";
import { CheckCircle, XCircle, Loader } from "lucide-react";

type State = "loading" | "success" | "error";

export default function VerifyEmailConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No verification token found. Please check the link in your email.");
      return;
    }

    async function verify() {
      const result = await verifyEmailToken(token as string);

      if (result.success) {
        setState("success");
        setMessage(result.success);
      } else {
        setState("error");
        setMessage(result.error || "Verification failed. Please try again.");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md text-center">

        {/* Loading State */}
        {state === "loading" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
              <Loader className="h-9 w-9 text-indigo-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verifying your email…
            </h1>
            <p className="text-gray-500">This will only take a moment.</p>
          </>
        )}

        {/* Success State */}
        {state === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Email verified!
            </h1>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Your account is now verified. Sign in to complete your onboarding and start finding rooms.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
            >
              Sign in to continue
            </Link>
          </>
        )}

        {/* Error State */}
        {state === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verification failed
            </h1>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-all"
              >
                Register again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
