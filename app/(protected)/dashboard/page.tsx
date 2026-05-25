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
  Home,
  Users,
  ArrowRight,
  Edit2,
} from "lucide-react";
import type { Metadata } from "next";
import UserAvatar from "@/components/shared/UserAvatar";
import { getConnections } from "@/server/actions/getConnections";
import ConnectionsModal from "@/components/dashboard/ConnectionsModal";

export const metadata: Metadata = {
  title: "Dashboard | Roomy",
};

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

  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const userDoc = await User.findById(session.user.id).lean() as IUser | null;

  if (!userDoc) redirect("/login");

  const user = userDoc;
  const displayName = user.fullName || session.user.name || "Roomy User";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "R";

  const connectionsRes = await getConnections();
  const connections = connectionsRes.success ? connectionsRes.connections : [];

  return (
    <div className="min-h-screen w-full bg-[#f7f9ff] text-slate-900 flex flex-col">

      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-[rgb(46,219,244)] rounded-full opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-[rgb(248,150,60)] rounded-full opacity-[0.06] blur-[100px]" />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-28 pb-10 relative z-10 space-y-8">

        {/* Welcome Banner */}
        <div className="flex items-start justify-between gap-4 p-6 bg-gradient-to-r from-[rgb(46,219,244)]/10 to-[rgb(29,93,185)]/10 border border-[rgb(34,142,222)]/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-[rgb(34,142,222)] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Welcome back, {displayName.split(" ")[0]}!
              </h2>
              <p className="text-sm text-[rgb(29,93,185)]/70 mt-1">
                Your profile and preferences are loaded. Start exploring rooms matched to your lifestyle.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionsModal connections={connections} />
            <Link
              href="/dashboard/edit"
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[rgb(34,142,222)] text-sm font-bold rounded-xl border border-[rgb(34,142,222)]/20 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile + Lifestyle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <UserAvatar
              src={user.profilePicture || session.user.image}
              alt={displayName}
              className="h-20 w-20 border-2 border-[rgb(34,142,222)]/30 shadow-xl mb-4"
            />
            <h3 className="font-bold text-lg text-slate-900">{displayName}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="px-3 py-1 text-xs font-bold bg-[rgb(46,219,244)]/10 border border-[rgb(46,219,244)]/25 text-[rgb(29,93,185)] rounded-full capitalize">
                {fmt(user.roleType)}
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-[rgb(250,192,140)]/20 border border-[rgb(246,137,83)]/30 text-[rgb(239,62,43)] rounded-full capitalize">
                {fmt(user.gender)}
              </span>
            </div>

            <span className="mt-3 px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-500 rounded-full">
              {user.authProvider === "google" ? "Google Account" : "Email Account"}
            </span>
          </div>

          {/* Lifestyle Details Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:col-span-2 space-y-5 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[rgb(34,142,222)]" />
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
              <div className="flex items-center gap-2 p-3 bg-[rgb(46,219,244)]/5 border border-[rgb(34,142,222)]/15 rounded-xl">
                <DollarSign className="h-4 w-4 text-[rgb(34,142,222)] flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Monthly Budget</span>
                  <span className="text-sm font-semibold text-slate-800">
                    Rs. {user.budgetMin?.toLocaleString() ?? "0"} — Rs. {user.budgetMax?.toLocaleString() ?? "∞"}
                  </span>
                </div>
              </div>
            )}

            {/* Preferred Locations */}
            {user.isActiveSeeker && user.preferredLocations?.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="h-4 w-4 text-[rgb(34,142,222)]" />
                  <span className="text-xs font-semibold text-slate-400">Preferred Locations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.preferredLocations.map((loc) => (
                    <span
                      key={loc}
                      className="text-xs px-2.5 py-1 bg-[rgb(29,93,185)]/8 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] rounded-full"
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
            href="/discover"
            className="group p-6 bg-white border border-slate-100 hover:border-[rgb(34,142,222)]/40 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(34,142,222)]/10 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[rgb(29,93,185)] transition-colors flex items-center gap-1.5">
              Browse Rooms <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Discover rooms matched to your lifestyle across Sri Lanka.
            </p>
          </Link>

          <Link
            href="/create-room"
            className="group p-6 bg-white border border-slate-100 hover:border-[rgb(246,137,83)]/40 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(246,137,83)]/10 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(250,192,140)] to-[rgb(246,137,83)] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[rgb(239,62,43)] transition-colors flex items-center gap-1.5">
              Post a Room <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-sm text-slate-400 mt-1">
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
    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
      <span className="text-xs text-slate-400 block font-medium">{label}</span>
      <span className={`text-sm font-bold mt-1 capitalize block ${highlight ? "text-[rgb(34,142,222)]" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}
