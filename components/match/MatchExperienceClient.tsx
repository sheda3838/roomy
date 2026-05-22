"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Zap, Home, DollarSign, Heart, Bed, Wine, Ban, ShieldCheck, MapPin } from "lucide-react";

export default function MatchExperienceClient({ data }: { data: any }) {
  const { room, match } = data;
  const { score, label, lifestyle, budget, location, positiveSignals, possibleConflicts } = match;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = score >= 80 ? "from-emerald-500/20 to-emerald-900/5" : score >= 50 ? "from-amber-500/20 to-amber-900/5" : "from-red-500/20 to-red-900/5";
  const scoreBorder = score >= 80 ? "border-emerald-500/30" : score >= 50 ? "border-amber-500/30" : "border-red-500/30";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href={`/rooms/${room.slug}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to room
        </Link>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          {/* 1. Score Hero */}
          <motion.div variants={itemVariants} className={`p-8 md:p-12 rounded-3xl bg-gradient-to-br ${scoreBg} border ${scoreBorder} backdrop-blur-xl text-center relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
            
            <h1 className="text-xl md:text-2xl font-semibold text-zinc-300 mb-2">Compatibility Match</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{room.title}</h2>
            
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
                  <motion.circle 
                    cx="96" cy="96" r="88" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray="552.9" 
                    initial={{ strokeDashoffset: 552.9 }}
                    animate={{ strokeDashoffset: 552.9 - (552.9 * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className={`${scoreColor} drop-shadow-[0_0_15px_currentColor]`} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`text-5xl font-black ${scoreColor}`}
                  >
                    {score}%
                  </motion.span>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className={`mt-6 px-6 py-2 rounded-full border ${scoreBorder} bg-black/40 backdrop-blur-md font-bold uppercase tracking-wider text-sm ${scoreColor}`}
              >
                {label}
              </motion.div>
            </div>
          </motion.div>

          {/* 2. Signals Summary */}
          {(positiveSignals.length > 0 || possibleConflicts.length > 0) && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Positive Signals
                </h3>
                <ul className="space-y-3">
                  {positiveSignals.length > 0 ? positiveSignals.map((sig: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-300">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {sig}
                    </li>
                  )) : (
                    <li className="text-zinc-500 italic">No strong positive signals found.</li>
                  )}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-400" /> Possible Conflicts
                </h3>
                <ul className="space-y-3">
                  {possibleConflicts.length > 0 ? possibleConflicts.map((sig: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-300">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {sig}
                    </li>
                  )) : (
                    <li className="text-emerald-500 italic flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> No major conflicts detected!
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}

          {/* 3. Detailed Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lifestyle */}
            <motion.div variants={itemVariants} className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <Heart className="w-5 h-5 text-purple-400" /> Lifestyle Compatibility
              </h3>
              
              <div className="space-y-6">
                {/* Cleanliness */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${lifestyle.cleanliness.match === 'perfect' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Cleanliness</p>
                      <p className="text-sm text-zinc-400 capitalize">Room expects: {room.cleanlinessExpectation}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold capitalize ${lifestyle.cleanliness.match === 'perfect' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {lifestyle.cleanliness.match} Match
                  </span>
                </div>

                {/* Smoker/Drinker */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${lifestyle.smoker.match === 'conflict' || lifestyle.drinker.match === 'conflict' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      <Wine className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Habits (Smoking / Drinking)</p>
                      <p className="text-sm text-zinc-400">
                        Room allows: {room.smokerAllowed ? "Smoking" : "No Smoking"}, {room.drinkerAllowed ? "Drinking" : "No Drinking"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold capitalize ${lifestyle.smoker.match === 'conflict' || lifestyle.drinker.match === 'conflict' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {lifestyle.smoker.match === 'conflict' || lifestyle.drinker.match === 'conflict' ? 'Conflict' : 'Compatible'}
                  </span>
                </div>

                {/* Guests */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${lifestyle.guestPolicy.match === 'perfect' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Guest Policy</p>
                      <p className="text-sm text-zinc-400 capitalize">Room allows: {room.guestPolicy}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold capitalize ${lifestyle.guestPolicy.match === 'perfect' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {lifestyle.guestPolicy.match} Match
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Budget & Location */}
            <motion.div variants={itemVariants} className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                  <DollarSign className="w-5 h-5 text-green-400" /> Budget Fit
                </h3>
                <div className="text-2xl font-bold text-white mb-1">
                  Rs. {budget.roomRent.toLocaleString()}
                </div>
                {budget.userMax > 0 ? (
                  <p className="text-sm text-zinc-400 mb-4">Your max budget: Rs. {budget.userMax.toLocaleString()}</p>
                ) : (
                  <p className="text-sm text-zinc-400 mb-4">You haven't set a budget</p>
                )}
                
                <div className={`p-3 rounded-xl border flex items-center gap-3 ${budget.isPerfect ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' : budget.isConflict ? 'bg-red-950/30 border-red-800/50 text-red-400' : 'bg-amber-950/30 border-amber-800/50 text-amber-400'}`}>
                  {budget.isPerfect ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : budget.isConflict ? <XCircle className="w-5 h-5 shrink-0" /> : <Zap className="w-5 h-5 shrink-0" />}
                  <span className="font-semibold text-sm">
                    {budget.isPerfect ? "Excellent Budget Fit" : budget.isConflict ? "Over Budget" : "Slightly Over Budget"}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                  <MapPin className="w-5 h-5 text-blue-400" /> Location Fit
                </h3>
                <p className="text-white font-medium mb-1">{location.roomLocation}</p>
                <div className="mt-3">
                  {location.isMatched ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matches Your Preference
                    </div>
                  ) : location.userPreferred.length > 0 ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-semibold text-zinc-400">
                      <Ban className="w-3.5 h-3.5" /> Outside Preferred Area
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500">No location preference set</div>
                  )}
                </div>
              </div>

            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
