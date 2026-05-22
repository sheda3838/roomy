"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/server/actions/register";
import { Mail } from "lucide-react";

// ─── Check Inbox Screen ───────────────────────────────────────────────────────
function CheckInboxScreen({ email }: { email: string }) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-12 px-4 bg-[#f7f9ff]">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] shadow-xl shadow-[rgb(34,142,222)]/25">
          <Mail className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3 font-serif">
          Check your inbox
        </h1>

        <p className="text-slate-500 mb-2">We sent a verification link to:</p>
        <p className="font-bold text-slate-900 mb-8 text-lg">{email}</p>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 text-left space-y-3">
          {[
            <>Open the email from <strong>Roomy</strong> in your inbox.</>,
            <>Click the <strong>Verify Email</strong> button inside.</>,
            <>You&apos;ll be signed in automatically and taken to onboarding.</>,
          ].map((step, i) => (
            <p key={i} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0 font-bold text-[rgb(34,142,222)]">{i + 1}.</span>
              {step}
            </p>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <Link href="/register" className="font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors">
            try again
          </Link>
          .
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── Register Page ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await registerUser({ fullName: name, email, password });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSubmittedEmail(email);
        setRegistered(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  if (registered) {
    return <CheckInboxScreen email={submittedEmail} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center py-12 px-4 sm:px-6 bg-[#f7f9ff]">

      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[rgb(46,219,244)] rounded-full opacity-[0.06] blur-[80px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[rgb(248,150,60)] rounded-full opacity-[0.06] blur-[80px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Roomy" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-bold font-serif text-slate-900">Roomy</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors">
              Log in here
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="roomy-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="roomy-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="roomy-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="roomy-btn-primary mt-2"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignIn} className="roomy-btn-secondary">
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
