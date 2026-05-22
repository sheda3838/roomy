import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Email | Roomy",
  description: "Please verify your email address to continue using Roomy.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md text-center">
        {/* Animated Icon */}
        <div className="mx-auto mb-6 relative flex h-24 w-24 items-center justify-center">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
            <Mail className="h-9 w-9 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Verify your email
        </h1>

        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Your account is created but your email address hasn&apos;t been verified yet.
          Please check your inbox for a verification link from Roomy.
        </p>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
              1
            </div>
            <p className="text-sm text-gray-600">
              Open the email from <strong>Roomy</strong> in your inbox (check spam too).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
              2
            </div>
            <p className="text-sm text-gray-600">
              Click the <strong>Verify Email</strong> button inside the email.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
              3
            </div>
            <p className="text-sm text-gray-600">
              You&apos;ll be taken directly to onboarding to complete your profile.
            </p>
          </div>
        </div>

        {/* Verified callout */}
        <div className="flex items-center gap-2 justify-center rounded-xl bg-green-50 border border-green-100 px-4 py-3 mb-8">
          <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">
            The link expires in <strong>24 hours</strong>. Request a new one if needed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 transition-all"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
