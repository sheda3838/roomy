"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Zap, Home, DollarSign, Heart, Bed, Wine, Ban, ShieldCheck, MapPin, Clock, Users } from "lucide-react";
import RequestToJoinButton from "@/components/rooms/RequestToJoinButton";

interface MatchExperienceClientProps {
  room: any;
  match: {
    score: number;
    label: string;
    lifestyle: any;
    budget: any;
    location: any;
    positiveSignals: string[];
    possibleConflicts: string[];
  };
  connectionState: {
    isOwner: boolean;
    isJoined: boolean;
    hasPendingRequest: boolean;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function MatchExperienceClient({ room, match, connectionState }: MatchExperienceClientProps) {
  // Determine gradient based on score
  let scoreColor = "text-indigo-400";
  let scoreBg = "bg-indigo-400/20";
  let scoreBorder = "border-indigo-500/30";
  
  if (match.score >= 90) {
    scoreColor = "text-emerald-400";
    scoreBg = "bg-emerald-400/20";
    scoreBorder = "border-emerald-500/30";
  } else if (match.score < 60) {
    scoreColor = "text-amber-400";
    scoreBg = "bg-amber-400/20";
    scoreBorder = "border-amber-500/30";
  }

  const { isOwner, isJoined, hasPendingRequest } = connectionState;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Nav */}
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/rooms/${room.slug}`} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <span className="text-zinc-500 font-semibold tracking-wide uppercase text-sm">
            Compatibility Engine
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 🎯 HERO SECTION */}
          <motion.div variants={itemVariants} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Radial glow behind score */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full ${scoreBg} blur-3xl opacity-50`} />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] ${scoreBorder} flex items-center justify-center bg-zinc-900/80 shadow-inner mb-6`}>
                <div className="text-center">
                  <span className={`text-5xl md:text-6xl font-black ${scoreColor} tabular-nums tracking-tighter`}>
                    {match.score}%
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {match.label}
              </h1>
              
              <div className="text-zinc-400 mb-8 max-w-lg">
                For <span className="font-semibold text-zinc-200">{room.title}</span> in {room.locationText}
              </div>

              {/* Compatibility Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {match.budget.isPerfect && (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Budget Friendly
                  </span>
                )}
                {match.location.isMatched && (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Preferred Area
                  </span>
                )}
                {match.lifestyle.cleanliness.match === "perfect" && (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Lifestyle Match
                  </span>
                )}
                {(match.lifestyle.guestPolicy.match === "conflict" || match.lifestyle.guestPolicy.match === "partial") && (
                  <span className="px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-400 text-sm font-semibold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" /> Guest Rules Differ
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 🟢 POSITIVE SIGNALS */}
            <motion.div variants={itemVariants} className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <Heart className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Why this matches you</h2>
              </div>
              
              {match.positiveSignals.length > 0 ? (
                <ul className="space-y-4">
                  {match.positiveSignals.map((signal, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 font-medium">{signal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500 italic">No strong positive signals found.</p>
              )}
            </motion.div>

            {/* 🔴 POTENTIAL CONFLICTS */}
            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-800 rounded-lg text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Things to consider</h2>
              </div>
              
              {match.possibleConflicts.length > 0 ? (
                <ul className="space-y-4">
                  {match.possibleConflicts.map((signal, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 font-medium">{signal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 opacity-50" />
                  <p className="text-zinc-400 font-medium">No major conflicts detected!</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* 📊 BREAKDOWNS */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold text-white px-2">Detailed Breakdown</h2>
            
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/50">
              
              {/* Lifestyle */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-indigo-400 mb-6">
                  <Home className="w-5 h-5" /> <span className="font-bold text-white">Lifestyle & Rules</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <BreakdownItem 
                    label="Cleanliness" 
                    value={match.lifestyle.cleanliness.match} 
                    icon={<Bed className="w-4 h-4" />}
                  />
                  <BreakdownItem 
                    label="Smoking" 
                    value={match.lifestyle.smoker.match} 
                    icon={<Ban className="w-4 h-4" />}
                  />
                  <BreakdownItem 
                    label="Drinking" 
                    value={match.lifestyle.drinker.match} 
                    icon={<Wine className="w-4 h-4" />}
                  />
                  <BreakdownItem 
                    label="Guests" 
                    value={match.lifestyle.guestPolicy.match} 
                    icon={<Users className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <DollarSign className="w-5 h-5" /> <span className="font-bold text-white">Budget Alignment</span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Room Rent: <span className="font-semibold text-white">Rs. {match.budget.roomRent.toLocaleString()}</span>
                  </p>
                </div>
                <div>
                  {match.budget.isPerfect ? (
                    <Badge variant="success">Perfect Fit</Badge>
                  ) : match.budget.isUnder ? (
                    <Badge variant="success">Under Budget</Badge>
                  ) : match.budget.isSlightlyOver ? (
                    <Badge variant="warning">Slightly Over Budget</Badge>
                  ) : (
                    <Badge variant="danger">Over Budget</Badge>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <MapPin className="w-5 h-5" /> <span className="font-bold text-white">Location Alignment</span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Area: <span className="font-semibold text-white">{match.location.roomLocation}</span>
                  </p>
                </div>
                <div>
                  {match.location.isMatched ? (
                    <Badge variant="success">Matches Preferred Area</Badge>
                  ) : (
                    <Badge variant="neutral">Outside Preferred Areas</Badge>
                  )}
                </div>
              </div>

            </div>
          </motion.div>

          {/* 🤝 REQUEST TO JOIN CTA */}
          <motion.div variants={itemVariants} className="pt-8 pb-12 flex flex-col items-center text-center">
            
            {isOwner ? (
              <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 flex flex-col items-center max-w-md w-full">
                <Home className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Your Listing</h3>
                <p className="text-zinc-400 text-sm mt-1">You are the owner of this room.</p>
              </div>
            ) : isJoined ? (
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 flex flex-col items-center max-w-md w-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Already Connected</h3>
                <p className="text-zinc-400 text-sm mt-1">You are already an occupant of this room.</p>
              </div>
            ) : hasPendingRequest ? (
              <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-900/50 flex flex-col items-center max-w-md w-full">
                <Clock className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Request Pending</h3>
                <p className="text-zinc-400 text-sm mt-1">You have already requested to join this room. The owner will review your application soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Ready to connect?</h3>
                <div className="w-full max-w-md">
                  <RequestToJoinButton roomId={room._id} isOwner={false} />
                </div>
                <p className="text-sm text-zinc-500 mt-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Secure and private application
                </p>
              </>
            )}

          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

// Helpers
function BreakdownItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  let color = "text-zinc-400";
  let bg = "bg-zinc-800";
  let text = "Neutral";

  if (value === "perfect") {
    color = "text-emerald-400";
    bg = "bg-emerald-500/10 border-emerald-500/20";
    text = "Aligned";
  } else if (value === "partial") {
    color = "text-amber-400";
    bg = "bg-amber-500/10 border-amber-500/20";
    text = "Partial";
  } else if (value === "conflict") {
    color = "text-red-400";
    bg = "bg-red-500/10 border-red-500/20";
    text = "Differs";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
        {icon} {label}
      </span>
      <div className={`px-3 py-1.5 rounded-md border text-sm font-semibold flex items-center w-fit ${color} ${bg}`}>
        {value === "perfect" && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
        {value === "partial" && <Zap className="w-4 h-4 mr-1.5" />}
        {value === "conflict" && <XCircle className="w-4 h-4 mr-1.5" />}
        {text}
      </div>
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode, variant: "success" | "warning" | "danger" | "neutral" }) {
  let classes = "";
  if (variant === "success") classes = "bg-emerald-950/50 text-emerald-400 border-emerald-800/50";
  if (variant === "warning") classes = "bg-amber-950/50 text-amber-400 border-amber-800/50";
  if (variant === "danger") classes = "bg-red-950/50 text-red-400 border-red-800/50";
  if (variant === "neutral") classes = "bg-zinc-800 text-zinc-400 border-zinc-700";

  return (
    <span className={`px-4 py-2 rounded-lg border text-sm font-semibold ${classes}`}>
      {children}
    </span>
  );
}
