"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  CheckCircle,
  Activity,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  MapPin,
  DollarSign,
  Coffee,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px] opacity-10"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[128px] opacity-10"></div>

      {/* Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Roomy
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <span className="text-xs text-zinc-300 font-medium">
                {user?.name || user?.email}
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 hover:bg-zinc-900 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 relative z-10 space-y-8">
        {/* Success Alert */}
        <div className="flex items-start gap-4 p-6 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl">
          <CheckCircle className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-white">Onboarding Complete!</h2>
            <p className="text-sm text-indigo-200/70 mt-1">
              Your room matching preferences and lifestyle profiles have been successfully updated in
              the database. You have unlocked all protected features of Roomy.
            </p>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: User Profile Header */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center text-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="h-20 w-20 rounded-full border-2 border-indigo-500/50 shadow-xl mb-4"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-4">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
            )}
            <h3 className="font-bold text-lg text-white">{user?.name || "Roomy User"}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
            <span className="mt-4 px-3 py-1 text-xs font-semibold bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 rounded-full">
              Account Onboarded
            </span>
          </div>

          {/* Card 2: Lifestyle Matches */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              Lifestyle Profile Details
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-500 block">Cleanliness</span>
                <span className="text-sm font-semibold text-zinc-200 mt-1 capitalize block">
                  Onboarded
                </span>
              </div>
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-500 block">Sleep Cycle</span>
                <span className="text-sm font-semibold text-zinc-200 mt-1 capitalize block">
                  Onboarded
                </span>
              </div>
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-500 block">Social Policy</span>
                <span className="text-sm font-semibold text-zinc-200 mt-1 capitalize block">
                  Onboarded
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 italic">
              Note: You can update your matching attributes at any time from your profile settings.
            </p>
          </div>
        </div>

        {/* Room search info */}
        <div className="p-8 bg-gradient-to-br from-indigo-950/10 to-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white">Next Phase: Room System</h3>
            <p className="text-sm text-zinc-400">
              Create listings, view local matching rooms, and connect with potential flatmates.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/10">
            Browse Room Matches
          </button>
        </div>
      </main>
    </div>
  );
}
