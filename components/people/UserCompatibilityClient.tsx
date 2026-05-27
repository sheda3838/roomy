"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UserPlus,
  Loader2,
  Users,
  DollarSign,
  Heart,
  Brush,
  Wine,
  Cigarette,
  MapPin,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  AlertTriangle,
  ChevronDown,
  Activity,
  Briefcase,
  GraduationCap,
  Info
} from "lucide-react";
import { sendRoommateRequest } from "@/server/actions/handleRoommateRequest";
import Counter from "@/components/ui/Counter";
import { FACILITIES_LIST } from "@/constants/facilities";
import CompatibilityExplanationModal from "@/components/shared/CompatibilityExplanationModal";

interface UserCompatibilityClientProps {
  currentUser: any;
  targetUser: any;
  match: {
    score: number;
    label: string;
    reasons: string[];
    conflicts: string[];
    facilityMatches?: {
      matched: string[];
      unmatched: string[];
      scorePercent: number;
    };
    locationMatches?: {
      matched: string[];
      unmatched: string[];
    };
  };
  connectionState: {
    isConnected: boolean;
    hasPendingRequest: boolean;
  };
}

export default function UserCompatibilityClient({
  currentUser,
  targetUser,
  match,
  connectionState,
}: UserCompatibilityClientProps) {
  // Connection states
  const [isConnected, setIsConnected] = useState(connectionState.isConnected);
  const [hasPendingRequest, setHasPendingRequest] = useState(connectionState.hasPendingRequest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  // Scanner States
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFactor = (id: string) => {
    setExpandedFactor(expandedFactor === id ? null : id);
  };

  // Scanner stages
  const stages = [
    { text: "Accessing Roomy Matchmaking Core...", duration: 500 },
    { text: "Evaluating sleep schedule alignments...", duration: 700 },
    { text: "Analyzing cleanliness expectations...", duration: 600 },
    { text: "Matching social (drink/smoke) boundaries...", duration: 500 },
    { text: "Comparing monthly budget ranges...", duration: 400 },
  ];

  // Scanner simulation
  useEffect(() => {
    if (!isAnalyzing) return;

    let currentStage = 0;
    let currentProgress = 0;

    const runStage = () => {
      if (currentStage >= stages.length) {
        setProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 300);
        return;
      }

      const stage = stages[currentStage];
      const stepIncrement = Math.ceil(100 / stages.length);
      const targetProgress = Math.min((currentStage + 1) * stepIncrement, 100);

      const intervalTime = stage.duration / (targetProgress - currentProgress);
      const timer = setInterval(() => {
        currentProgress += 1;
        setProgress(Math.min(currentProgress, targetProgress));
        if (currentProgress >= targetProgress) {
          clearInterval(timer);
          currentStage += 1;
          setActiveStage(Math.min(currentStage, stages.length - 1));
          setTimeout(runStage, 100);
        }
      }, intervalTime);
    };

    runStage();
  }, [isAnalyzing]);

  // Score thematic styling
  let scoreColor = "text-[rgb(29,93,185)]";
  let scoreBg = "bg-[rgb(34,142,222)]/10";
  let scoreBorder = "border-[rgb(34,142,222)]/20";
  let scoreGradient = "from-[rgb(46,219,244)] to-[rgb(29,93,185)]";

  if (match.score >= 80) {
    scoreColor = "text-emerald-500";
    scoreBg = "bg-emerald-500/10";
    scoreBorder = "border-emerald-500/20";
    scoreGradient = "from-emerald-400 to-emerald-600";
  } else if (match.score < 50) {
    scoreColor = "text-amber-500";
    scoreBg = "bg-amber-500/10";
    scoreBorder = "border-amber-500/20";
    scoreGradient = "from-amber-400 to-orange-500";
  }

  // Ring circumference
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (match.score / 100) * circumference;

  // Build roommate factors list
  const factors = buildRoommateFactors(currentUser, targetUser, match.facilityMatches, match.locationMatches);

  // 1. Lifestyle = 55 points max
  // (Cleanliness 10, Sleep 5, Smoking 10, Drinking 10, Guest 10, Gender 5, Role 5)
  const cleanLevels = { low: 1, medium: 2, high: 3 };
  const aClean = cleanLevels[currentUser.cleanlinessLevel as keyof typeof cleanLevels] || 0;
  const bClean = cleanLevels[targetUser.cleanlinessLevel as keyof typeof cleanLevels] || 0;
  const cleanScore = Math.abs(aClean - bClean) === 0 ? 10 : Math.abs(aClean - bClean) === 1 ? 5 : 0;

  const guestLevels = { no: 1, often: 2, regular: 3 };
  const aGuest = guestLevels[currentUser.guestPolicy as keyof typeof guestLevels] || 0;
  const bGuest = guestLevels[targetUser.guestPolicy as keyof typeof guestLevels] || 0;
  const guestScore = Math.abs(aGuest - bGuest) === 0 ? 10 : Math.abs(aGuest - bGuest) === 1 ? 5 : 0;

  const sleepScore = currentUser.sleepType === targetUser.sleepType ? 5 : 0;
  const smokingScore = currentUser.smoker === targetUser.smoker ? 10 : 0;
  const drinkingScore = currentUser.drinker === targetUser.drinker ? 10 : 0;
  const genderScore = currentUser.gender === targetUser.gender ? 5 : 0;
  const roleScore = currentUser.roleType === targetUser.roleType ? 5 : 0;

  const lifestyleScore = cleanScore + sleepScore + smokingScore + drinkingScore + guestScore + genderScore + roleScore;
  const lifestylePercent = Math.round((lifestyleScore / 55) * 100);

  // 2. Budget = 15 points
  const overlaps = currentUser.budgetMin <= targetUser.budgetMax && targetUser.budgetMin <= currentUser.budgetMax;
  const highlyAligned = overlaps && Math.abs(currentUser.budgetMax - targetUser.budgetMax) <= (currentUser.budgetMax * 0.2);
  const budgetScore = highlyAligned ? 15 : overlaps ? 10 : 0;
  const budgetPercent = Math.round((budgetScore / 15) * 100);

  // 3. Location = 10 points
  let locationScore = 0;
  if (match.locationMatches && match.locationMatches.matched.length > 0) {
    locationScore = 10;
  }
  const locationPercent = Math.round((locationScore / 10) * 100);

  // 4. Facilities = 20 points max
  // Note: match.facilityMatches.scorePercent is already a percentage, but to keep the weight visually accurate
  // if they match 10 out of 10, scorePercent is 100, which is perfectly fine.
  const facilitiesPercent = match.facilityMatches ? match.facilityMatches.scorePercent : 0;

  // 3. Role (Role type alignment) = 10 points
  const rolePercent = currentUser.roleType === targetUser.roleType ? 100 : 50;

  // Compatibility Narrative synthesis
  const compatibilityNarrative = generateCompatibilityNarrative(match.score, currentUser, targetUser);

  // Send request action handler
  const handleConnect = async () => {
    setIsSubmitting(true);
    setRequestError("");
    try {
      const res = await sendRoommateRequest(
        targetUser._id,
        `Hi ${targetUser.fullName}, I saw we have a great compatibility score of ${match.score}%! Would you like to connect?`
      );
      if (res.success) {
        setHasPendingRequest(true);
      } else {
        setRequestError(res.error || "Failed to send request.");
      }
    } catch (err) {
      setRequestError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(243,244,237)] text-slate-900 pb-20 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[rgb(46,219,244)]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[rgb(250,192,140)]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[rgb(34,142,222)]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* ── CINEMATIC SCANNING SEQUENCE ── */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[rgb(243,244,237)] flex flex-col items-center justify-center p-6"
          >
            <div className="absolute w-[400px] h-[400px] bg-[rgb(34,142,222)]/12 rounded-full blur-[80px] animate-pulse" />

            <div className="w-full max-w-lg text-center relative z-10">
              <div className="relative w-32 h-32 mx-auto mb-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-[rgb(34,142,222)]"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 tabular-nums">
                {progress}%
              </h2>

              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mb-8 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[rgb(46,219,244)] via-[rgb(34,142,222)] to-[rgb(29,93,185)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white p-5 text-left shadow-sm space-y-3">
                {stages.map((stage, idx) => {
                  const isDone = idx < activeStage;
                  const isCurrent = idx === activeStage;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 transition-opacity duration-300 ${
                        isDone || isCurrent ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[rgb(34,142,222)] border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? "text-slate-800" : "text-slate-500"
                        }`}
                      >
                        {stage.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAnalyzing(false)}
                className="mt-8 text-xs font-bold text-slate-400 hover:text-slate-800 bg-white/40 border border-slate-200/50 hover:bg-white rounded-full px-5 py-2 transition-all cursor-pointer"
              >
                Skip Compatibility Scan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN COMPATIBILITY DASHBOARD ── */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 relative z-10">
        
        {/* Back button */}
        <Link
          href={`/people/${targetUser._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to user profile
        </Link>

        {/* ── PROFILE MATCH HEADER & CIRCLE SCORE ── */}
        <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[rgb(34,142,222)]/5 to-transparent rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-10">
            {/* Cinematic Glowing Score Centerpiece */}
            <div className="relative shrink-0 flex flex-col items-center justify-center p-2">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full flex items-center justify-center shadow-lg">
                {/* Glowing Outer Rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[rgb(46,219,244)] via-[rgb(34,142,222)] to-[rgb(246,137,83)] animate-spin [animation-duration:12s] blur-[6px] opacity-70" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[rgb(46,219,244)] via-[rgb(34,142,222)] to-[rgb(246,137,83)] animate-spin [animation-duration:8s] opacity-90" />
                
                {/* Double Layer Glassmorphic Circle */}
                <div className="absolute inset-3 rounded-full bg-white/95 backdrop-blur-2xl border border-white shadow-inner flex flex-col items-center justify-center z-10">
                  <div className="flex items-baseline justify-center">
                    <Counter
                      value={match.score}
                      places={match.score === 100 ? [100, 10, 1] : [10, 1]}
                      fontSize={60}
                      padding={4}
                      gap={2}
                      textColor="rgb(29, 93, 185)"
                      fontWeight={800}
                    />
                    <span className="text-2xl font-black text-[rgb(34,142,222)] ml-0.5 select-none animate-pulse">%</span>
                  </div>
                  <span className="text-[9.5px] font-black tracking-widest text-slate-400 uppercase mt-0.5">COMPATIBILITY</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center lg:text-left flex-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${scoreBg} ${scoreColor} ${scoreBorder} border text-[11px] font-bold uppercase tracking-wider mb-4`}
              >
                <Heart className="w-3.5 h-3.5" /> {match.label}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl tracking-[-0.02em] leading-tight text-slate-900 mb-3">
                Roommate Compatibility with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] font-bold">
                  {targetUser.fullName}
                </span>
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 mt-2">
                <p className="flex items-center gap-1.5 capitalize">
                  {targetUser.roleType === "student" ? (
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  )}
                  {targetUser.roleType || "Member"}
                </p>
                <span className="text-slate-300">•</span>
                <p className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" /> {targetUser.gender ? targetUser.gender : "Any gender"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI CO-LIVING COMPATIBILITY SYNTHESIS ── */}
        <section className="mb-10">
          <div className="roomy-glass rounded-3xl border border-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-5 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <div className="bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-xl border-l border-b border-[rgb(34,142,222)]/20">
                Match Brief
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center shrink-0 shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Compatibility Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {compatibilityNarrative}
              </p>
            </div>
          </div>
        </section>

        {/* ── DETAILED FACTOR ACCORDIONS ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-serif text-2xl tracking-tight text-slate-900">
              Interactive Factor Analysis
            </h2>
            <span className="text-xs text-slate-400 font-semibold ml-auto hidden sm:flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Click any row to expand details
            </span>
          </div>

          {/* CTA Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgb(34,142,222)]/10 hover:bg-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] font-bold text-xs shadow-sm transition-all border border-[rgb(34,142,222)]/20"
            >
              <Activity className="w-3.5 h-3.5" /> Understand Compatibility
            </button>
          </div>

          <div className="space-y-3">
            {factors.map((factor, idx) => {
              const isExpanded = expandedFactor === factor.id;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Card Header Bar */}
                  <button
                    onClick={() => toggleFactor(factor.id)}
                    className="w-full text-left p-5 flex items-center gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {factor.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-950">{factor.label}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          {factor.scoreLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {targetUser.fullName}: <span className="font-semibold text-slate-800">{factor.targetValue}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <StatusBadge status={factor.status} label={factor.badgeLabel} />
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Accordion Expansion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                      >
                        <div className="p-5 space-y-4">
                          <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                            {factor.narrative}
                          </p>

                          {/* Visual match comparison bar */}
                          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Alignment Comparison</h4>
                            {renderComparisonTrack(factor)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Budget Accordion */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => toggleFactor("budget")}
                className="w-full text-left p-5 flex items-center gap-4 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgb(250,192,140)]/15 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-[rgb(246,137,83)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-950">Monthly Budget Range</span>
                    <span className="text-xs font-semibold text-slate-400">Financial</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {targetUser.fullName}: <span className="font-semibold text-slate-800">Rs. {targetUser.budgetMin?.toLocaleString()} - {targetUser.budgetMax?.toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {overlaps ? (
                    <StatusBadge status="perfect" label="Budgets Overlap" />
                  ) : (
                    <StatusBadge status="conflict" label="No Overlap" />
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      expandedFactor === "budget" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedFactor === "budget" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                  >
                    <div className="p-5 space-y-4">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                        {highlyAligned
                          ? `Excellent financial alignment. Your budget targets are nearly identical, which makes split-rent apartment seeking highly practical.`
                          : overlaps
                          ? `Your budget ranges overlap. You can easily find a shared property that satisfies both of your rent limits (e.g. within Rs. ${Math.max(
                              currentUser.budgetMin || 0,
                              targetUser.budgetMin || 0
                            ).toLocaleString()} - Rs. ${Math.min(
                              currentUser.budgetMax || Infinity,
                              targetUser.budgetMax || Infinity
                            ).toLocaleString()}/month).`
                          : `Financial mismatch. Your budget range (Rs. ${currentUser.budgetMin?.toLocaleString()} - ${currentUser.budgetMax?.toLocaleString()}) does not overlap with ${
                              targetUser.fullName
                            }'s budget parameters. This will make finding a joint flat highly challenging.`}
                      </p>

                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Budget Range Overlap</h4>
                        <div className="space-y-6 pt-2 pb-2">
                          {/* Current User Range */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                              <span>You</span>
                              <span>Rs. {currentUser.budgetMin?.toLocaleString()} - {currentUser.budgetMax?.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                              <div className="absolute left-[20%] right-[30%] h-full bg-[rgb(34,142,222)] rounded-full" />
                            </div>
                          </div>

                          {/* Target User Range */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                              <span>{targetUser.fullName}</span>
                              <span>Rs. {targetUser.budgetMin?.toLocaleString()} - {targetUser.budgetMax?.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                              <div className="absolute left-[35%] right-[15%] h-full bg-[rgb(246,137,83)] rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── WEIGHTED PROGRESS METERS ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(250,192,140)] to-[rgb(246,137,83)] flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-serif text-2xl tracking-tight text-slate-900">
              Score Weighting
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <BreakdownMeter
              label="Lifestyle Compatibility"
              percent={lifestylePercent}
              weight="50% weight"
              color="from-[rgb(46,219,244)] to-[rgb(29,93,185)]"
            />
            <BreakdownMeter
              label="Budget Range Overlap"
              percent={budgetPercent}
              weight="15% weight"
              color="from-[rgb(250,192,140)] to-[rgb(246,137,83)]"
            />
            <BreakdownMeter
              label="Location Proximity"
              percent={locationPercent}
              weight="10% weight"
              color="from-[rgb(236,72,153)] to-[rgb(219,39,119)]"
            />
            {match.facilityMatches && (
              <BreakdownMeter
                label="Facility Preferences"
                percent={match.facilityMatches.scorePercent}
                weight="20% weight"
                color="from-[rgb(46,219,244)] to-[rgb(34,142,222)]"
              />
            )}
          </div>
        </section>

        {/* ── STRENGTHS & CONSIDERATIONS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Great Alignment */}
          <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Strengths & Matches</h3>
            </div>

            {match.reasons.length > 0 ? (
              <div className="space-y-2.5 flex-1">
                {match.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 bg-emerald-50/50 border border-emerald-100/30 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center my-auto">No major routine alignments found.</p>
            )}
          </section>

          {/* Potential Friction */}
          <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Considerations</h3>
            </div>

            {match.conflicts.length > 0 ? (
              <div className="space-y-2.5 flex-1">
                {match.conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 bg-amber-50/50 border border-amber-100/30 rounded-xl p-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{conflict}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center my-auto">No lifestyle conflicts identified.</p>
            )}
          </section>
        </div>

        {/* ── CONNECTION PANEL ── */}
        <section className="pt-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-md p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)]" />

            {isConnected ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">Already Connected</h3>
                <p className="text-sm font-semibold text-slate-500 mb-4">
                  You are connected with {targetUser.fullName}!
                </p>
                <Link
                  href="/messages"
                  className="px-6 py-3 rounded-full bg-[rgb(29,93,185)] hover:bg-[rgb(34,142,222)] text-white font-bold text-sm transition-all"
                >
                  Start Chatting
                </Link>
              </>
            ) : hasPendingRequest ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
                  <Clock className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">Request Pending</h3>
                <p className="text-sm text-slate-500 font-semibold max-w-sm">
                  You have already sent a roommate request to {targetUser.fullName}. They will review your profile compatibility score soon.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-serif tracking-tight text-slate-950 mb-3">
                  Ready to connect?
                </h3>
                <p className="text-sm text-slate-500 font-semibold mb-8 max-w-md">
                  Send a roommate connection request to {targetUser.fullName}. They will be notified and can review your compatibility summary.
                </p>
                <div className="w-full max-w-xs">
                  <button
                    onClick={handleConnect}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Connect as Roommates
                      </>
                    )}
                  </button>
                  {requestError && <p className="text-red-500 text-xs font-semibold mt-2">{requestError}</p>}
                </div>
                <p className="text-xs text-slate-400 font-bold mt-5 flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Secure co-living roommate matching
                </p>
              </>
            )}
          </div>
        </section>
      </div>
      
      <CompatibilityExplanationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

// ─── STAGE DETAILS ACCORDION COMPARISON TRACKS ───

function renderComparisonTrack(factor: any) {
  if (factor.id === "cleanliness") {
    const levels = ["low", "medium", "high"];
    const userIndex = levels.indexOf(factor.rawUserValue?.toLowerCase() || "");
    const targetIndex = levels.indexOf(factor.rawTargetValue?.toLowerCase() || "");

    const labels = ["casual", "moderate", "spotless"];

    return (
      <div className="space-y-4 pt-1">
        <div className="relative h-2 bg-slate-100 rounded-full flex justify-between">
          {levels.map((level, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white -mt-0.5 relative z-10" />
              <span className="text-[10px] text-slate-400 font-bold capitalize mt-2 absolute top-1.5 whitespace-nowrap">
                {labels[idx]}
              </span>
            </div>
          ))}

          {/* Markers */}
          {userIndex === targetIndex ? (
            userIndex !== -1 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(29,93,185)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                style={{ left: `${userIndex * 50}%` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[rgb(29,93,185)]" />
                <span className="absolute -top-6 text-[9px] font-bold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 px-1.5 py-0.5 rounded border border-[rgb(34,142,222)]/20 whitespace-nowrap">
                  You & Them
                </span>
              </div>
            )
          ) : (
            <>
              {userIndex !== -1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(29,93,185)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                  style={{ left: `${userIndex * 50}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[rgb(29,93,185)]" />
                  <span className="absolute -top-6 text-[9px] font-bold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 px-1.5 py-0.5 rounded border border-[rgb(34,142,222)]/20 whitespace-nowrap">
                    You
                  </span>
                </div>
              )}
              {targetIndex !== -1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(246,137,83)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                  style={{ left: `${targetIndex * 50}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[rgb(246,137,83)]" />
                  <span className="absolute -top-6 text-[9px] font-bold text-[rgb(246,137,83)] bg-[rgb(250,192,140)]/20 px-1.5 py-0.5 rounded border border-[rgb(246,137,83)]/25 whitespace-nowrap">
                    Them
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="h-4" />
      </div>
    );
  }

  if (factor.id === "sleep") {
    const levels = ["early", "night_owl"];
    const userIndex = levels.indexOf(factor.rawUserValue?.toLowerCase() || "");
    const targetIndex = levels.indexOf(factor.rawTargetValue?.toLowerCase() || "");

    const labels = ["Early Bird", "Night Owl"];

    return (
      <div className="space-y-4 pt-1">
        <div className="relative h-2 bg-slate-100 rounded-full flex justify-between">
          {levels.map((level, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white -mt-0.5 relative z-10" />
              <span className="text-[10px] text-slate-400 font-bold capitalize mt-2 absolute top-1.5 whitespace-nowrap">
                {labels[idx]}
              </span>
            </div>
          ))}

          {/* Markers */}
          {userIndex === targetIndex ? (
            userIndex !== -1 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(29,93,185)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                style={{ left: `${userIndex * 100}%` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[rgb(29,93,185)]" />
                <span className="absolute -top-6 text-[9px] font-bold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 px-1.5 py-0.5 rounded border border-[rgb(34,142,222)]/20 whitespace-nowrap">
                  You & Them
                </span>
              </div>
            )
          ) : (
            <>
              {userIndex !== -1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(29,93,185)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                  style={{ left: `${userIndex * 100}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[rgb(29,93,185)]" />
                  <span className="absolute -top-6 text-[9px] font-bold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 px-1.5 py-0.5 rounded border border-[rgb(34,142,222)]/20 whitespace-nowrap">
                    You
                  </span>
                </div>
              )}
              {targetIndex !== -1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(246,137,83)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                  style={{ left: `${targetIndex * 100}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[rgb(246,137,83)]" />
                  <span className="absolute -top-6 text-[9px] font-bold text-[rgb(246,137,83)] bg-[rgb(250,192,140)]/20 px-1.5 py-0.5 rounded border border-[rgb(246,137,83)]/25 whitespace-nowrap">
                    Them
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="h-4" />
      </div>
    );
  }

  if (factor.id === "smoker" || factor.id === "drinker") {
    const userBool = !!factor.rawUserValue;
    const targetBool = !!factor.rawTargetValue;

    return (
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your habits</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              userBool
                ? "bg-purple-50 text-purple-700 border border-purple-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {userBool ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Their habits</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              targetBool
                ? "bg-purple-50 text-purple-700 border border-purple-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {targetBool ? "Yes" : "No"}
          </span>
        </div>
      </div>
    );
  }

  if (factor.id === "guestPolicy" || factor.id === "gender") {
    return (
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your {factor.id === "gender" ? "Gender" : "Rule"}</span>
          <span className="text-xs font-black text-slate-700 capitalize">
            {factor.rawUserValue || "Not Set"}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Their {factor.id === "gender" ? "Gender" : "Rule"}</span>
          <span className="text-xs font-black text-slate-700 capitalize">
            {factor.rawTargetValue || "Not Set"}
          </span>
        </div>
      </div>
    );
  }

  if (factor.id === "facilities") {
    const { matched, userOnly, targetOnly } = factor.customData;
    return (
      <div className="pt-2 space-y-3">
        {matched.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Both Selected (Matches)</span>
            <div className="flex flex-wrap gap-2">
              {matched.map((facilityId: string) => {
                const item = FACILITIES_LIST.find(f => f.id === facilityId);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div key={facilityId} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 shadow-sm">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {userOnly.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">You Selected (They Didn't)</span>
            <div className="flex flex-wrap gap-2">
              {userOnly.map((facilityId: string) => {
                const item = FACILITIES_LIST.find(f => f.id === facilityId);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div key={facilityId} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 shadow-sm opacity-80">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold line-through">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {targetOnly.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider block">They Selected (You Didn't)</span>
            <div className="flex flex-wrap gap-2">
              {targetOnly.map((facilityId: string) => {
                const item = FACILITIES_LIST.find(f => f.id === facilityId);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div key={facilityId} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 shadow-sm opacity-80">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold line-through">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (factor.id === "locations") {
    const matched = factor.customData?.matched || [];
    if (matched.length > 0) {
      return (
        <div className="pt-2">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-2">Matched Locations</span>
          <div className="flex flex-wrap gap-2">
            {matched.map((loc: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{loc}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="text-center py-2 text-xs font-semibold text-slate-400">
        No overlapping locations.
      </div>
    );
  }

  return (
    <div className="text-center py-2 text-xs font-semibold text-slate-400">
      Visual comparison not applicable for this factor.
    </div>
  );
}

// ─── STATUS BADGE COMPONENT ───

function StatusBadge({
  status,
  label,
}: {
  status: "perfect" | "partial" | "conflict";
  label: string;
}) {
  const styles = {
    perfect: "bg-emerald-50 text-emerald-700 border-emerald-100",
    partial: "bg-amber-50 text-amber-700 border-amber-100",
    conflict: "bg-red-50 text-red-700 border-red-100",
  };
  const icons = {
    perfect: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    partial: <Info className="w-3.5 h-3.5 shrink-0" />,
    conflict: <XCircle className="w-3.5 h-3.5 shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${styles[status]}`}
    >
      {icons[status]} {label}
    </span>
  );
}

// ─── BREAKDOWN METERS ───

function BreakdownMeter({
  label,
  percent,
  weight,
  color,
}: {
  label: string;
  percent: number;
  weight: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-900 leading-snug">{label}</span>
          <span className="text-sm font-black text-slate-800 tabular-nums">{percent}%</span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold block mb-3">{weight}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── COMPATIBILITY NARRATIVE BRIEF GENERATOR ───

function generateCompatibilityNarrative(score: number, user: any, partner: any) {
  const parts = [];

  // Match Level
  if (score >= 80) {
    parts.push(
      `Based on our analysis, this is an outstanding match (${score}%). You and ${partner.fullName} share highly compatible schedules, routine standards, and social preferences.`
    );
  } else if (score >= 60) {
    parts.push(
      `This is a strong match (${score}%). You align on key routine and boundary expectations with ${partner.fullName}, making flatmate co-living comfortable.`
    );
  } else if (score >= 45) {
    parts.push(
      `This is a moderate match (${score}%). You share some routine goals, but there are differences in sleeping rhythms, budgets, or guest boundaries.`
    );
  } else {
    parts.push(
      `This is a lower compatibility match (${score}%). Multiple daily habits (cleanliness expectations, social values, or budgets) diverge and may create friction.`
    );
  }

  // Cleanliness
  if (user.cleanlinessLevel === partner.cleanlinessLevel) {
    parts.push(
      `Both of you prefer a ${
        user.cleanlinessLevel === "high" ? "spotless" : user.cleanlinessLevel === "medium" ? "moderate" : "casual"
      } cleanliness level, reducing shared chores arguments.`
    );
  } else {
    parts.push(
      `Cleanliness expectations differ (you prefer ${user.cleanlinessLevel || "moderate"} vs their ${
        partner.cleanlinessLevel || "moderate"
      }), indicating chore rules should be pre-planned.`
    );
  }

  // Budget
  const overlaps = user.budgetMin <= partner.budgetMax && partner.budgetMin <= user.budgetMax;
  if (overlaps) {
    parts.push(
      `Additionally, your monthly budget ranges overlap comfortably, enabling shared flat hunting.`
    );
  } else {
    parts.push(
      `Notably, your budgets do not overlap, which may complicate finding a property that satisfies both targets.`
    );
  }

  return parts.join(" ");
}

// ─── FACTORS BUILDER ───

function buildRoommateFactors(currentUser: any, targetUser: any, facilityMatches: any, locationMatches: any) {
  const factors = [];

  const cleanlinessMatch = currentUser.cleanlinessLevel === targetUser.cleanlinessLevel;
  const cleanLevels = { low: 1, medium: 2, high: 3 };
  const aClean = cleanLevels[currentUser.cleanlinessLevel as keyof typeof cleanLevels] || 0;
  const bClean = cleanLevels[targetUser.cleanlinessLevel as keyof typeof cleanLevels] || 0;
  const cleanDiff = (!currentUser.cleanlinessLevel || !targetUser.cleanlinessLevel) ? -1 : Math.abs(aClean - bClean);
  
  const cleanlinessLabels = {
    high: "Spotless (High)",
    medium: "Moderate (Medium)",
    low: "Casual (Low)",
  };
  factors.push({
    id: "cleanliness",
    icon: <Brush className="w-5 h-5 text-[rgb(46,219,244)]" />,
    label: "Cleanliness Expectation",
    scoreLabel: "Lifestyle Routine",
    targetValue: cleanlinessLabels[targetUser.cleanlinessLevel as "high" | "medium" | "low"] || "Moderate",
    status: cleanDiff === 0 ? "perfect" : cleanDiff === 1 ? "partial" : "conflict",
    badgeLabel: cleanDiff === 0 ? "Aligned" : cleanDiff === 1 ? "Differs" : "Conflict",
    rawUserValue: currentUser.cleanlinessLevel,
    rawTargetValue: targetUser.cleanlinessLevel,
    narrative: cleanlinessMatch
      ? "You share the exact same cleanliness expectations. This reduces day-to-day friction in shared areas like bathrooms and kitchens."
      : `You prefer a ${currentUser.cleanlinessLevel || "medium"} standard, while they prefer a ${
          targetUser.cleanlinessLevel || "medium"
        } standard. It is recommended to align on chore schedules.`,
  });

  // Sleep Clock
  const sleepMatch = currentUser.sleepType === targetUser.sleepType;
  factors.push({
    id: "sleep",
    icon: targetUser.sleepType === "night_owl" ? (
      <Moon className="w-5 h-5 text-indigo-400" />
    ) : (
      <Sun className="w-5 h-5 text-amber-400" />
    ),
    label: "Sleeping Schedule",
    scoreLabel: "Bio-Clock Alignment",
    targetValue: targetUser.sleepType === "night_owl" ? "Night Owl" : "Early Bird",
    status: (sleepMatch ? "perfect" : "partial") as "perfect" | "partial" | "conflict",
    badgeLabel: sleepMatch ? "Aligned" : "Differs",
    rawUserValue: currentUser.sleepType,
    rawTargetValue: targetUser.sleepType,
    narrative: sleepMatch
      ? `Both are ${
          currentUser.sleepType === "night_owl" ? "Night Owls" : "Early Birds"
        }, which helps synchronize quiet hours and household activity schedules.`
      : `You are an ${currentUser.sleepType === "night_owl" ? "Night Owl" : "Early Bird"} and they are a ${
          targetUser.sleepType === "night_owl" ? "Night Owl" : "Early Bird"
        }. Make sure to establish noise rules for mornings/evenings.`,
  });

  // Smoker
  const smokerMatch = currentUser.smoker === targetUser.smoker;
  factors.push({
    id: "smoker",
    icon: <Cigarette className="w-5 h-5 text-slate-500" />,
    label: "Smoking Habits",
    scoreLabel: "Lifestyle preference",
    targetValue: targetUser.smoker ? "Smoker" : "Non-smoker",
    status: (smokerMatch ? "perfect" : "conflict") as "perfect" | "partial" | "conflict",
    badgeLabel: smokerMatch ? "Compatible" : "Conflict",
    rawUserValue: currentUser.smoker,
    rawTargetValue: targetUser.smoker,
    narrative: smokerMatch
      ? "Your smoking preferences match perfectly, meaning no smoke smell disputes should arise."
      : "Preference mismatch: One of you smokes, while the other does not. A discussion on outdoor/indoor boundaries is necessary.",
  });

  // Drinker
  const drinkerMatch = currentUser.drinker === targetUser.drinker;
  factors.push({
    id: "drinker",
    icon: <Wine className="w-5 h-5 text-purple-500" />,
    label: "Drinking Habits",
    scoreLabel: "Lifestyle preference",
    targetValue: targetUser.drinker ? "Drinker" : "Non-drinker",
    status: (drinkerMatch ? "perfect" : "conflict") as "perfect" | "partial" | "conflict",
    badgeLabel: drinkerMatch ? "Compatible" : "Conflict",
    rawUserValue: currentUser.drinker,
    rawTargetValue: targetUser.drinker,
    narrative: drinkerMatch
      ? "Your alcohol consumption preferences align perfectly."
      : "One of you drinks occasionally, while the other prefers an alcohol-free space. Make sure boundaries are understood.",
  });

  const guestMatch = currentUser.guestPolicy === targetUser.guestPolicy;
  const guestLevels = { no: 1, often: 2, regular: 3 };
  const aGuest = guestLevels[currentUser.guestPolicy as keyof typeof guestLevels] || 0;
  const bGuest = guestLevels[targetUser.guestPolicy as keyof typeof guestLevels] || 0;
  const guestDiff = (!currentUser.guestPolicy || !targetUser.guestPolicy) ? -1 : Math.abs(aGuest - bGuest);

  factors.push({
    id: "guestPolicy",
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    label: "Guest Policy",
    scoreLabel: "Co-living Rules",
    targetValue: targetUser.guestPolicy || "Regular",
    status: guestDiff === 0 ? "perfect" : guestDiff === 1 ? "partial" : "conflict",
    badgeLabel: guestDiff === 0 ? "Aligned" : guestDiff === 1 ? "Differs" : "Conflict",
    rawUserValue: currentUser.guestPolicy,
    rawTargetValue: targetUser.guestPolicy,
    narrative: guestMatch
      ? `Both share the same guest rules (${currentUser.guestPolicy}), which helps avoid unexpected overnight guest conflicts.`
      : `You prefer guest policy: ${currentUser.guestPolicy || "regular"} vs their guest policy: ${
          targetUser.guestPolicy || "regular"
        }. Make sure to agree on sleepover policies.`,
  });

  // Gender Preference
  const genderMatch = currentUser.gender === targetUser.gender;
  factors.push({
    id: "gender",
    icon: <Users className="w-5 h-5 text-pink-500" />,
    label: "Gender Match",
    scoreLabel: "Co-living Dynamic",
    targetValue: targetUser.gender ? targetUser.gender.charAt(0).toUpperCase() + targetUser.gender.slice(1) : "Any",
    status: (genderMatch ? "perfect" : "conflict") as "perfect" | "partial" | "conflict",
    badgeLabel: genderMatch ? "Aligned" : "Conflict",
    rawUserValue: currentUser.gender,
    rawTargetValue: targetUser.gender,
    narrative: genderMatch
      ? "You share the same gender, which often provides mutual comfort and aligns with common co-living gender preferences."
      : "You are of different genders. While many co-live successfully, be sure you're both comfortable with a mixed-gender living arrangement.",
  });

  // Occupation/Role
  const roleMatch = currentUser.roleType === targetUser.roleType;
  factors.push({
    id: "occupation",
    icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
    label: "Occupation Status",
    scoreLabel: "Lifestyle Requirement",
    targetValue: targetUser.roleType ? targetUser.roleType.charAt(0).toUpperCase() + targetUser.roleType.slice(1) : "Not Set",
    status: roleMatch ? "perfect" : "conflict",
    badgeLabel: roleMatch ? "Aligned" : "Conflict",
    rawUserValue: currentUser.roleType,
    rawTargetValue: targetUser.roleType,
    narrative: roleMatch
      ? `You are both ${currentUser.roleType}s, which often aligns daily routines and financial perspectives.`
      : `You are a ${currentUser.roleType || "Not set"} while they are a ${targetUser.roleType || "Not set"}. Different occupations can mean different waking hours or expectations.`,
  });

  // Facilities Preference
  if (facilityMatches) {
    const isPerfect = facilityMatches.scorePercent === 100;
    
    const userFacilities = currentUser.preferredFacilities || [];
    const targetFacilities = targetUser.preferredFacilities || [];
    const userOnly = userFacilities.filter((f: string) => !targetFacilities.includes(f));
    const targetOnly = targetFacilities.filter((f: string) => !userFacilities.includes(f));

    factors.push({
      id: "facilities",
      icon: <CheckCircle2 className="w-5 h-5 text-teal-500" />,
      label: "Facility Preferences",
      scoreLabel: "Living Conditions",
      targetValue: targetFacilities.length > 0 ? `${targetFacilities.length} Selected` : "None",
      status: (isPerfect ? "perfect" : facilityMatches.scorePercent >= 50 ? "partial" : "conflict") as "perfect" | "partial" | "conflict",
      badgeLabel: isPerfect ? "Perfect Match" : facilityMatches.scorePercent >= 50 ? "Strong Match" : "Mismatched",
      rawUserValue: null,
      rawTargetValue: null,
      customData: {
        matched: facilityMatches.matched,
        userOnly,
        targetOnly,
      },
      narrative: isPerfect
        ? "You have perfectly aligned facility expectations for your future home!"
        : facilityMatches.scorePercent >= 50
        ? "You share most of the same facility requirements, making finding a shared space easier."
        : "You have significantly different facility expectations. Finding a place that satisfies both of your needs might be difficult.",
    });
  }

  // Location Preference
  if (locationMatches) {
    const isPerfect = locationMatches.unmatched.length === 0 && locationMatches.matched.length > 0;
    const hasOverlap = locationMatches.matched.length > 0;
    
    factors.push({
      id: "locations",
      icon: <MapPin className="w-5 h-5 text-red-500" />,
      label: "Location Preferences",
      scoreLabel: "Geography",
      targetValue: targetUser.preferredLocations?.length > 0 ? targetUser.preferredLocations.join(", ") : "None specified",
      status: (isPerfect ? "perfect" : hasOverlap ? "partial" : "conflict") as "perfect" | "partial" | "conflict",
      badgeLabel: isPerfect ? "Perfect Match" : hasOverlap ? "Overlap" : "Mismatched",
      rawUserValue: currentUser.preferredLocations?.join(", "),
      rawTargetValue: targetUser.preferredLocations?.join(", "),
      customData: {
        matched: locationMatches.matched,
      },
      narrative: hasOverlap
        ? `You both want to look for rooms in: ${locationMatches.matched.join(", ")}.`
        : "You are looking to live in completely different areas. Commutes or preferences might clash.",
    });
  }

  return factors;
}
