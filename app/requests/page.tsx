import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getIncomingRoommateRequests } from "@/server/actions/getIncomingRoommateRequests";
import { getIncomingRoomRequests } from "@/server/actions/getIncomingRoomRequests";
import RequestActions from "./RequestActions";
import RoomRequestActions from "./RoomRequestActions";
import {
  UserPlus, Home, User as UserIcon, ArrowRight,
  Home as HomeIcon, Users,
} from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";

export const metadata: Metadata = {
  title: "Requests | Roomy",
};

export const revalidate = 0;

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const tab = sp?.tab === "rooms" ? "rooms" : "people";

  const [roommateResult, roomResult] = await Promise.all([
    getIncomingRoommateRequests(),
    getIncomingRoomRequests(),
  ]);

  const roommateRequests = roommateResult.requests ?? [];
  const roomRequests = roomResult.requests ?? [];

  const roommateCount = roommateRequests.length;
  const roomCount = roomRequests.length;

  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-80 h-80 bg-[rgb(46,219,244)] rounded-full opacity-[0.05] blur-[80px]" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[rgb(248,150,60)] rounded-full opacity-[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold font-serif text-slate-900">Requests</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage incoming roommate connections and room join requests.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/requests?tab=people"
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === "people"
                ? "text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:border-[rgb(34,142,222)]/40"
            }`}
            style={tab === "people" ? {
              background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))"
            } : {}}
          >
            <Users className="w-4 h-4" />
            Roommate Requests
            {roommateCount > 0 && (
              <span className={`ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                tab === "people" ? "bg-white/25 text-white" : "bg-[rgb(239,62,43)] text-white"
              }`}>
                {roommateCount}
              </span>
            )}
          </Link>

          <Link
            href="/requests?tab=rooms"
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              tab === "rooms"
                ? "text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:border-[rgb(246,137,83)]/40"
            }`}
            style={tab === "rooms" ? {
              background: "linear-gradient(135deg, rgb(250,192,140), rgb(246,137,83))"
            } : {}}
          >
            <HomeIcon className="w-4 h-4" />
            Room Join Requests
            {roomCount > 0 && (
              <span className={`ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                tab === "rooms" ? "bg-white/25 text-white" : "bg-[rgb(239,62,43)] text-white"
              }`}>
                {roomCount}
              </span>
            )}
          </Link>
        </div>

        {/* ── PEOPLE TAB ───────────────────────────────────────────────── */}
        {tab === "people" && (
          <>
            {roommateRequests.length === 0 ? (
              <EmptyState
                icon={<UserPlus className="w-10 h-10 text-slate-300" />}
                title="No pending roommate requests"
                desc="When someone sends you a connection request, it will appear here."
                cta={{ href: "/discover?tab=people", label: "Find People" }}
              />
            ) : (
              <div className="space-y-3">
                {roommateRequests.map((request: any) => {
                  const requester = request.requesterId;
                  if (!requester) return null;
                  return (
                    <div
                      key={request._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <Link href={`/people/${requester._id}/match`}>
                          <UserAvatar
                            src={requester.profilePicture}
                            alt={requester.fullName}
                            className="w-14 h-14 rounded-full border border-slate-100 shadow-sm hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div>
                          <Link href={`/people/${requester._id}/match`} className="font-bold text-lg text-slate-900 hover:text-[rgb(29,93,185)] transition-colors">
                            {requester.fullName}
                          </Link>
                          <p className="text-sm text-slate-400 capitalize mt-0.5">
                            {[requester.gender, requester.roleType].filter(Boolean).join(" · ")}
                          </p>
                          {request.message && (
                            <p className="mt-2 text-sm text-slate-500 italic bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                              &ldquo;{request.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <RequestActions requestId={request._id} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── ROOMS TAB ────────────────────────────────────────────────── */}
        {tab === "rooms" && (
          <>
            {roomRequests.length === 0 ? (
              <EmptyState
                icon={<Home className="w-10 h-10 text-slate-300" />}
                title="No pending room join requests"
                desc={roomCount === 0 && roommateCount === 0
                  ? "You haven't listed any rooms yet, or there are no pending requests."
                  : "All caught up — no new room join requests."}
                cta={{ href: "/create-room", label: "Post a Room" }}
              />
            ) : (
              <div className="space-y-3">
                {roomRequests.map((req: any) => {
                  const applicant = req.fromUserId;
                  const room = req.room;
                  if (!applicant) return null;
                  return (
                    <div
                      key={req._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <UserAvatar
                          src={applicant.profilePicture}
                          alt={applicant.fullName}
                          className="w-14 h-14 rounded-full border border-slate-100 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-lg text-slate-900">{applicant.fullName}</p>
                          <p className="text-sm text-slate-400 capitalize mt-0.5">
                            {[applicant.gender, applicant.roleType].filter(Boolean).join(" · ")}
                          </p>
                          {room && (
                            <Link
                              href={`/rooms/${room.slug}`}
                              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[rgb(246,137,83)] hover:text-[rgb(239,62,43)] transition-colors"
                            >
                              <HomeIcon className="w-3.5 h-3.5" />
                              {room.title}
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-400">{room.occupantsCount}/{room.capacity} occupants</span>
                            </Link>
                          )}
                          {req.message && (
                            <p className="mt-2 text-sm text-slate-500 italic bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                              &ldquo;{req.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <RoomRequestActions
                          requestId={req._id}
                          roomSlug={room?.slug}
                          atCapacity={room ? room.occupantsCount >= room.capacity : false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">{title}</h2>
      <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">{desc}</p>
      <Link
        href={cta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
      >
        {cta.label} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
