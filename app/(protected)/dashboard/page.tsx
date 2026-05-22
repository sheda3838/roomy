import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  CheckCircle,
  MapPin,
  DollarSign,
  Sparkles,
  Home,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Roomy",
};

// Helper to format enum values nicely
function fmt(val?: string) {
  if (!val) return "—";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function boolLabel(val?: boolean) {
  if (val === undefined || val === null) return "—";
  return val ? "Yes" : "No";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await dbConnect();
  const userDoc = await User.findById(session.user.id).lean() as IUser | null;

  if (!userDoc) {
    redirect("/login");
  }

  const user = userDoc;
  const displayName = user.fullName || session.user.name || "Roomy User";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "R";

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[128px] opacity-10 pointer-events-none" />

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 relative z-10 space-y-8">

        {/* Success Alert */}
        <div className="flex items-start gap-4 p-6 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl">
          <CheckCircle className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-white">Welcome back, {displayName.split(" ")[0]}!</h2>
            <p className="text-sm text-indigo-200/70 mt-1">
              Your profile and preferences are loaded. Start exploring rooms matched to your lifestyle.
            </p>
          </div>
        </div>

        {/* Profile + Lifestyle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center text-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={displayName}
                className="h-20 w-20 rounded-full border-2 border-indigo-500/50 shadow-xl mb-4 object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-4">
                {avatarLetter}
              </div>
            )}
            <h3 className="font-bold text-lg text-white">{displayName}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">{user.email}</p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 rounded-full capitalize">
                {fmt(user.roleType)} {/* student / worker */}
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-950/40 border border-indigo-800/50 text-indigo-400 rounded-full capitalize">
                {fmt(user.gender)}
              </span>
            </div>

            <span className="mt-3 px-3 py-1 text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full">
              {user.authProvider === "google" ? "Google Account" : "Email Account"}
            </span>
          </div>

          {/* Lifestyle Details Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:col-span-2 space-y-5">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              Lifestyle Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatTile label="Cleanliness" value={fmt(user.cleanlinessLevel)} />
              <StatTile label="Sleep Cycle" value={user.sleepType === "night_owl" ? "Night Owl" : user.sleepType === "early" ? "Early Bird" : "—"} />
              <StatTile label="Guest Policy" value={user.guestPolicy === "no" ? "No Guests" : user.guestPolicy === "often" ? "Sometimes" : user.guestPolicy === "regular" ? "Frequently" : "—"} />
              <StatTile label="Smoker" value={boolLabel(user.smoker)} />
              <StatTile label="Drinker" value={boolLabel(user.drinker)} />
              <StatTile
                label="Seeker"
                value={user.isActiveSeeker ? "Actively Looking" : "Just Browsing"}
                highlight={user.isActiveSeeker}
              />
            </div>

            {/* Budget */}
            {user.isActiveSeeker && (user.budgetMin || user.budgetMax) && (
              <div className="flex items-center gap-2 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <DollarSign className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 block">Monthly Budget</span>
                  <span className="text-sm font-semibold text-zinc-200">
                    Rs. {user.budgetMin?.toLocaleString() ?? "0"} — Rs. {user.budgetMax?.toLocaleString() ?? "∞"}
                  </span>
                </div>
              </div>
            )}

            {/* Preferred Locations */}
            {user.isActiveSeeker && user.preferredLocations?.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-zinc-400">Preferred Locations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.preferredLocations.map((loc) => (
                    <span
                      key={loc}
                      className="text-xs px-2.5 py-1 bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 rounded-full"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/rooms"
            className="group p-6 bg-gradient-to-br from-indigo-950/20 to-zinc-900/40 border border-indigo-800/30 hover:border-indigo-600/50 rounded-2xl transition-all hover:-translate-y-0.5"
          >
            <Home className="h-7 w-7 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white">Browse Rooms</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Discover rooms matched to your lifestyle across Sri Lanka.
            </p>
          </Link>

          <Link
            href="/rooms/create"
            className="group p-6 bg-gradient-to-br from-purple-950/20 to-zinc-900/40 border border-purple-800/30 hover:border-purple-600/50 rounded-2xl transition-all hover:-translate-y-0.5"
          >
            <Users className="h-7 w-7 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white">Post a Room</h3>
            <p className="text-sm text-zinc-400 mt-1">
              List your room and find compatible flatmates fast.
            </p>
          </Link>
        </div>

      </main>
    </div>
  );
}

// ── Helper Component ──────────────────────────────────────────────────────────
function StatTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
      <span className="text-xs text-zinc-500 block">{label}</span>
      <span className={`text-sm font-semibold mt-1 capitalize block ${highlight ? "text-indigo-400" : "text-zinc-200"}`}>
        {value}
      </span>
    </div>
  );
}
