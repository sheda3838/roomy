import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, MessageSquare, Check, X, Info } from "lucide-react";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { calculatePeopleMatch } from "@/server/actions/calculatePeopleMatch";
import { sendRoommateRequest } from "@/server/actions/handleRoommateRequest";

// We need a client component for the send request button to handle loading states
import SendRequestButton from "./SendRequestButton";

export const metadata: Metadata = {
  title: "Compatibility Match | Roomy",
};

export default async function MatchPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUserId = session.user.id;
  const targetUserId = params.userId;

  if (currentUserId === targetUserId) {
    redirect("/people");
  }

  await dbConnect();

  // Fetch both users to compare
  const currentUser = await User.findById(currentUserId).lean();
  const targetUser = await User.findById(targetUserId).lean();

  if (!currentUser || !targetUser) {
    notFound();
  }

  // Calculate Match
  const matchDetails = calculatePeopleMatch(currentUser, targetUser);
  const score = matchDetails.score;

  // Visuals based on score
  let scoreColor = "text-emerald-400";
  let ringColor = "ring-emerald-400/30";
  let bgGlow = "bg-emerald-500/10";
  let sentiment = "Highly Compatible";
  
  if (score < 70) {
    scoreColor = "text-yellow-400";
    ringColor = "ring-yellow-400/30";
    bgGlow = "bg-yellow-500/10";
    sentiment = "Potential Match";
  }
  if (score < 50) {
    scoreColor = "text-orange-400";
    ringColor = "ring-orange-400/30";
    bgGlow = "bg-orange-500/10";
    sentiment = "Low Compatibility";
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/people" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Discovery
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Top Profile Area */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left relative">
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />

          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-900 ring-4 ${ringColor} ${bgGlow} overflow-hidden shrink-0 relative z-10`}>
            {targetUser.profilePicture ? (
              <img src={targetUser.profilePicture} alt={targetUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-16 h-16 text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          
          <div className="flex-1 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{targetUser.fullName}</h1>
            <p className="text-lg text-zinc-400 mb-6 max-w-xl">
              {targetUser.roleType ? <span className="capitalize">{targetUser.roleType}</span> : "Member"} looking for a roommate.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <SendRequestButton targetUserId={targetUserId} targetName={targetUser.fullName} />
            </div>
          </div>
          
          {/* Main Score Display */}
          <div className="relative z-10 shrink-0 flex flex-col items-center">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-zinc-900 bg-zinc-950 flex items-center justify-center ring-4 ${ringColor} ${bgGlow} shadow-2xl`}>
              <span className={`text-4xl md:text-5xl font-black ${scoreColor}`}>{score}%</span>
            </div>
            <span className={`mt-4 font-semibold tracking-wide uppercase text-sm ${scoreColor}`}>
              {sentiment}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Alignment */}
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Check className="w-6 h-6 text-emerald-400" /> Great Alignment
            </h3>
            {matchDetails.reasons.length > 0 ? (
              <ul className="space-y-4">
                {matchDetails.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">No significant alignments found.</p>
            )}
          </div>

          {/* Friction / Conflicts */}
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <X className="w-6 h-6 text-orange-400" /> Potential Friction
            </h3>
            {matchDetails.conflicts.length > 0 ? (
              <ul className="space-y-4">
                {matchDetails.conflicts.map((conflict, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span className="leading-relaxed">{conflict}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-zinc-400 font-medium">No major conflicts detected!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
