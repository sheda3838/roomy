"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Home,
  DollarSign,
  Heart,
  Brush,
  Wine,
  Cigarette,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  AlertTriangle,
  ChevronDown,
  Activity,
  User,
  Coffee,
  Info
} from "lucide-react";
import RequestToJoinButton from "@/components/rooms/RequestToJoinButton";
import Counter from "@/components/ui/Counter";

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

export default function MatchExperienceClient({
  room,
  match,
  connectionState,
}: MatchExperienceClientProps) {
  const { isOwner, isJoined, hasPendingRequest } = connectionState;

  // Cinematic scanner state
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  // Analysis stages messages
  const stages = [
    { text: "Initializing Roomy Compatibility Core...", duration: 500 },
    { text: "Comparing lifestyle schedules and habits...", duration: 700 },
    { text: "Evaluating budget margins & price points...", duration: 600 },
    { text: "Mapping neighborhood geographical preferences...", duration: 500 },
    { text: "Synthesizing compatibility index...", duration: 400 },
  ];

  // Run the analysis scanner simulation
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

  // Dynamic Compatibility Narrative brief generator
  const compatibilityNarrative = generateCompatibilityNarrative(match, room);

  // Score-based theme colors
  let themeColor = "text-[rgb(29,93,185)]";
  let themeBg = "bg-[rgb(34,142,222)]/10";
  let themeBorder = "border-[rgb(34,142,222)]/20";
  let themeGradient = "from-[rgb(46,219,244)] to-[rgb(29,93,185)]";

  if (match.score >= 90) {
    themeColor = "text-emerald-500";
    themeBg = "bg-emerald-500/10";
    themeBorder = "border-emerald-500/20";
    themeGradient = "from-emerald-400 to-emerald-600";
  } else if (match.score < 60) {
    themeColor = "text-amber-500";
    themeBg = "bg-amber-500/10";
    themeBorder = "border-amber-500/20";
    themeGradient = "from-amber-400 to-orange-500";
  }

  // Calculate the SVG circle properties for overall compatibility score
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (match.score / 100) * circumference;

  // Build the list of compatibility factors
  const factors = buildFactors(match);

  // Score metrics
  const budgetPercent = match.budget.isPerfect
    ? 100
    : match.budget.isUnder
    ? 80
    : match.budget.isSlightlyOver
    ? 60
    : 30;

  const lifestyleMatches = factors.filter((f) => f.status === "perfect").length;
  const lifestylePercent = Math.round((lifestyleMatches / factors.length) * 100);
  const locationPercent = match.location.isMatched ? 100 : 30;

  const toggleFactor = (name: string) => {
    setExpandedFactor(expandedFactor === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-[rgb(243,244,237)] text-slate-900 pb-20 relative overflow-hidden font-sans">
      {/* Moving Ambient Gradient Blobs for Cinematic Feeling */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[rgb(46,219,244)]/8 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[rgb(250,192,140)]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[rgb(34,142,222)]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* ── CINEMATIC SCANNING SEQUENCE OVERLAY ── */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[rgb(243,244,237)] flex flex-col items-center justify-center p-6"
          >
            {/* Ambient glows behind scanner */}
            <div className="absolute w-[400px] h-[400px] bg-[rgb(34,142,222)]/12 rounded-full blur-[80px] animate-pulse" />

            <div className="w-full max-w-lg text-center relative z-10">
              {/* Rotating Logo Core */}
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

              {/* Progress Count */}
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 tabular-nums">
                {progress}%
              </h2>
              
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mb-8 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[rgb(46,219,244)] via-[rgb(34,142,222)] to-[rgb(29,93,185)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps checklist */}
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

              {/* Skip scan option */}
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

      {/* ── MAIN DASHBOARD INTERFACE ── */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Navigation back */}
        <Link
          href={`/rooms/${room.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to room details
        </Link>

        {/* ── STAGE 1: COMPATIBILITY HEADER & SCORE CORE ── */}
        <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-10 mb-8 relative overflow-hidden">
          {/* subtle inside glow */}
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
                      places={[10, 1]}
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

            {/* Title Copy */}
            <div className="text-center lg:text-left flex-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${themeBg} ${themeColor} ${themeBorder} border text-[11px] font-bold uppercase tracking-wider mb-4`}
              >
                <Heart className="w-3.5 h-3.5" /> {match.label}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl tracking-[-0.02em] leading-tight text-slate-900 mb-3">
                Compatibility Profile with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] font-bold">
                  {room.title}
                </span>
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 mt-2">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> {room.locationText}
                </p>
                <span className="text-slate-300">•</span>
                <p className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-slate-400" /> Rs. {room.rentAmount.toLocaleString()}/mo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAGE 2: COMPATIBILITY SYNTHESIS NARRATIVE ── */}
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
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                Compatibility Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {compatibilityNarrative}
              </p>
            </div>
          </div>
        </section>

        {/* ── STAGE 3: CORE COMPATIBILITY FACTOR ROWS ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-serif text-2xl tracking-tight text-slate-900">
              Interactive Factor Analysis
            </h2>
            <span className="text-xs text-slate-400 font-semibold ml-auto flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Click any row to expand details
            </span>
          </div>

          <div className="space-y-3">
            {factors.map((factor, idx) => {
              const isExpanded = expandedFactor === factor.id;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Summary Bar */}
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
                        Room expectation: <span className="font-semibold text-slate-800">{factor.roomValue}</span>
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

                  {/* Expansion Area */}
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

                          {/* Visual Match Bar comparison */}
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

            {/* Budget Row */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => toggleFactor("budget")}
                className="w-full text-left p-5 flex items-center gap-4 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgb(34,142,222)]/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-[rgb(29,93,185)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-950">Budget / Rent</span>
                    <span className="text-xs font-semibold text-slate-400">Financial</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Rent: <span className="font-semibold text-slate-800">Rs. {match.budget.roomRent.toLocaleString()}/mo</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {match.budget.isPerfect ? (
                    <StatusBadge status="perfect" label="Perfect Fit" />
                  ) : match.budget.isUnder ? (
                    <StatusBadge status="perfect" label="Under Budget" />
                  ) : match.budget.isSlightlyOver ? (
                    <StatusBadge status="partial" label="Slightly Over" />
                  ) : (
                    <StatusBadge status="conflict" label="Over Budget" />
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
                        {match.budget.isPerfect
                          ? "The rent fits perfectly within your specified monthly range, keeping you comfortable and avoiding financial stress."
                          : match.budget.isUnder
                          ? "Great! The room is priced below your minimum budget target, allowing you to save money or spend on other needs."
                          : match.budget.isSlightlyOver
                          ? "The room is slightly over your maximum target budget. Make sure you can manage the extra cost before proceeding."
                          : "This room's rent exceeds your stated budget limit significantly. We advise looking for a more financially suitable room."}
                      </p>

                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Your Budget Range vs. Room Rent</h4>
                        <div className="space-y-4 pt-2 pb-1">
                          <div className="relative h-2.5 bg-slate-100 rounded-full">
                            {/* Target budget highlighted track */}
                            <div className="absolute left-[20%] right-[20%] h-full bg-[rgb(34,142,222)]/20 rounded-full border-x border-white" />
                            
                            {/* Rent Pin */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                              style={{
                                left: match.budget.isUnder ? "10%" 
                                    : match.budget.isPerfect ? "50%" 
                                    : match.budget.isSlightlyOver ? "85%" : "95%"
                              }}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                match.budget.isPerfect || match.budget.isUnder ? "bg-emerald-500" 
                                : match.budget.isSlightlyOver ? "bg-amber-500" : "bg-red-500"
                              }`} />
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Rs. {match.budget.userMin.toLocaleString()} (Min)</span>
                            <span className="text-[rgb(29,93,185)]">Rent: Rs. {match.budget.roomRent.toLocaleString()}</span>
                            <span>Rs. {match.budget.userMax.toLocaleString()} (Max)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Row */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => toggleFactor("location")}
                className="w-full text-left p-5 flex items-center gap-4 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgb(34,142,222)]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[rgb(29,93,185)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-950">Location / Area</span>
                    <span className="text-xs font-semibold text-slate-400">Geography</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Room location: <span className="font-semibold text-slate-800">{match.location.roomLocation}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {match.location.isMatched ? (
                    <StatusBadge status="perfect" label="Matched Area" />
                  ) : (
                    <StatusBadge status="partial" label="Different Area" />
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      expandedFactor === "location" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedFactor === "location" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                  >
                    <div className="p-5 space-y-4">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                        {match.location.isMatched
                          ? `Excellent fit. The room is located directly in or near one of your specified preferred neighborhoods: ${match.location.userPreferred.join(
                              ", "
                            )}.`
                          : `The room is situated in ${
                              match.location.roomLocation
                            }, which is not in your explicit list of preferred locations (${
                              match.location.userPreferred.length > 0
                                ? match.location.userPreferred.join(", ")
                                : "None specified"
                            }). However, the overall compatibility in lifestyle and budget remains strong.`}
                      </p>

                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Geographic Alignment</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                          <div>
                            <span className="text-[11px] text-slate-400 font-bold block mb-1">Your Preferred Zones</span>
                            <div className="flex flex-wrap gap-1.5">
                              {match.location.userPreferred.length > 0 ? (
                                match.location.userPreferred.map((loc: string, index: number) => (
                                  <span key={index} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                                    {loc}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-slate-500 italic font-semibold">Any location preferred</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] text-slate-400 font-bold block mb-1">Room Location</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)] border border-[rgb(34,142,222)]/20 text-[10px] font-bold">
                              <MapPin className="w-3 h-3" /> {match.location.roomLocation}
                            </span>
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

        {/* ── STAGE 4: DETAILED WEIGHTED METER BREAKDOWN ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(250,192,140)] to-[rgb(246,137,83)] flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-serif text-2xl tracking-tight text-slate-900">
              Factor Weighting
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
              label="Financial Alignment"
              percent={budgetPercent}
              weight="30% weight"
              color="from-[rgb(250,192,140)] to-[rgb(246,137,83)]"
            />
            <BreakdownMeter
              label="Location Proximity"
              percent={locationPercent}
              weight="20% weight"
              color="from-[rgb(239,62,43)] to-[rgb(248,150,60)]"
            />
          </div>
        </section>

        {/* ── STAGE 5: COMPATIBILITY PROS & CONS (STRENGTHS / CONSIDERATIONS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Why this matches you */}
          <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Strengths & Matches</h3>
            </div>
            
            {match.positiveSignals.length > 0 ? (
              <div className="space-y-2.5 flex-1">
                {match.positiveSignals.map((signal, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 bg-emerald-50/50 border border-emerald-100/30 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center my-auto">No strong matches flagged.</p>
            )}
          </section>

          {/* Things to consider */}
          <section className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Considerations</h3>
            </div>

            {match.possibleConflicts.length > 0 ? (
              <div className="space-y-2.5 flex-1">
                {match.possibleConflicts.map((conflict, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 bg-amber-50/50 border border-amber-100/30 rounded-xl p-3">
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

        {/* ── STAGE 6: ACTION / APPLICATION PANEL ── */}
        <section className="pt-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-md p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)]" />

            {isOwner ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[rgb(34,142,222)]/10 flex items-center justify-center mb-5">
                  <Home className="w-7 h-7 text-[rgb(29,93,185)]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                  Your Room Listing
                </h3>
                <p className="text-sm font-semibold text-slate-500">
                  You are the owner of this room listing.
                </p>
              </>
            ) : isJoined ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                  Occupant Connected
                </h3>
                <p className="text-sm font-semibold text-slate-500">
                  You are already a member of this co-living room.
                </p>
              </>
            ) : hasPendingRequest ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
                  <Clock className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                  Application In Review
                </h3>
                <p className="text-sm text-slate-500 font-semibold max-w-sm">
                  You have already sent a request to join. The owner is reviewing your profile and compatibility index.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-serif tracking-tight text-slate-950 mb-3">
                  Ready to send a request?
                </h3>
                <p className="text-sm text-slate-500 font-semibold mb-8 max-w-md">
                  Send a connection request to the owner. They will review your profile and match details to ensure a good fit.
                </p>
                <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-200/60 p-5 shadow-inner">
                  <RequestToJoinButton roomId={room._id} isOwner={false} />
                </div>
                <p className="text-xs text-slate-400 font-bold mt-5 flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Secure, private co-living matchmaking
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── ACCORDION EXPANSION COMPARISON TRACK RENDERER ───

function renderComparisonTrack(factor: any) {
  if (factor.id === "cleanliness") {
    const levels = ["casual", "moderate", "spotless"];
    const userIndex = levels.indexOf(factor.rawUserValue?.toLowerCase() || "");
    const roomIndex = levels.indexOf(factor.rawRoomValue?.toLowerCase() || "");
    
    return (
      <div className="space-y-4 pt-1">
        <div className="relative h-2 bg-slate-100 rounded-full flex justify-between">
          {levels.map((level, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white -mt-0.5 relative z-10" />
              <span className="text-[10px] text-slate-400 font-bold capitalize mt-2 absolute top-1.5 whitespace-nowrap">{level}</span>
            </div>
          ))}

          {/* Markers */}
          {userIndex === roomIndex ? (
            userIndex !== -1 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(29,93,185)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                style={{ left: `${userIndex * 50}%` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[rgb(29,93,185)]" />
                <span className="absolute -top-6 text-[9px] font-bold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 px-1.5 py-0.5 rounded border border-[rgb(34,142,222)]/20 whitespace-nowrap">
                  You & Room
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
              {roomIndex !== -1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[rgb(246,137,83)] shadow-md flex items-center justify-center z-20 transition-all duration-500"
                  style={{ left: `${roomIndex * 50}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[rgb(246,137,83)]" />
                  <span className="absolute -top-6 text-[9px] font-bold text-[rgb(246,137,83)] bg-[rgb(250,192,140)]/20 px-1.5 py-0.5 rounded border border-[rgb(246,137,83)]/25 whitespace-nowrap">
                    Room
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="h-4" /> {/* spacers */}
      </div>
    );
  }

  if (factor.id === "smoker" || factor.id === "drinker") {
    const userBool = !!factor.rawUserValue;
    const roomBool = !!factor.rawRoomValue;
    
    return (
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your Setting</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${userBool ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
            {userBool ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Room Allowance</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${roomBool ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
            {roomBool ? "Allowed" : "Not Allowed"}
          </span>
        </div>
      </div>
    );
  }

  if (factor.id === "guestPolicy") {
    return (
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your Preference</span>
          <span className="text-xs font-black text-slate-700 capitalize">
            {factor.rawUserValue || "Not Set"}
          </span>
        </div>
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Room Policy</span>
          <span className="text-xs font-black text-slate-700 capitalize">
            {factor.rawRoomValue || "Not Set"}
          </span>
        </div>
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

// ─── BREAKDOWN WEIGHTED PROGRESS METERS ───

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

function generateCompatibilityNarrative(match: any, room: any) {
  const parts = [];

  // Match Label and Score
  if (match.score >= 90) {
    parts.push(
      `Based on our analysis, this is an outstanding match (${match.score}%). You and the household are highly aligned on routine expectations, routine schedules, and lifestyle boundaries.`
    );
  } else if (match.score >= 75) {
    parts.push(
      `This is a strong match (${match.score}%). You share highly compatible core values and cleanliness habits with the room owners, suggesting an easy, comfortable co-living flow.`
    );
  } else if (match.score >= 60) {
    parts.push(
      `This is a moderate match (${match.score}%). You have a solid foundation, but there are a few lifestyle differences or rule variations you will want to talk through.`
    );
  } else {
    parts.push(
      `This is a lower compatibility match (${match.score}%). There are multiple key areas (such as budget alignment, location, or daily routines) where your preferences differ.`
    );
  }

  // Budget
  if (match.budget.isPerfect || match.budget.isUnder) {
    parts.push(
      `Rent is Rs. ${room.rentAmount.toLocaleString()} which fits well within or under your target budget margins.`
    );
  } else if (match.budget.isSlightlyOver) {
    parts.push(
      `The rent amount slightly exceeds your specified target max, but is likely manageable.`
    );
  } else {
    parts.push(
      `The monthly rent is above your maximum budget limit, which poses a potential conflict.`
    );
  }

  // Location
  if (match.location.isMatched) {
    parts.push(
      `Furthermore, the room is perfectly located in ${room.locationText}, aligning directly with your preferred neighborhood zones.`
    );
  } else if (match.location.userPreferred.length > 0) {
    parts.push(
      `The location in ${room.locationText} is outside your specified preferred areas, which is a trade-off to consider.`
    );
  }

  // Cleanliness
  if (match.lifestyle.cleanliness.match === "perfect") {
    parts.push(
      `Your spotless/cleanliness habits align perfectly with the expectations of the room.`
    );
  }

  return parts.join(" ");
}

// ─── FACTORS BUILDER ───

function buildFactors(match: any) {
  const factors = [];

  // Cleanliness expectation
  factors.push({
    id: "cleanliness",
    icon: <Brush className="w-5 h-5 text-[rgb(46,219,244)]" />,
    label: "Cleanliness",
    scoreLabel: "Lifestyle Habit",
    roomValue: match.lifestyle.cleanliness.room || "Moderate",
    status: match.lifestyle.cleanliness.match as "perfect" | "partial" | "conflict",
    badgeLabel:
      match.lifestyle.cleanliness.match === "perfect"
        ? "Aligned"
        : match.lifestyle.cleanliness.match === "partial"
        ? "Partial Fit"
        : "Conflict",
    rawUserValue: match.lifestyle.cleanliness.user,
    rawRoomValue: match.lifestyle.cleanliness.room,
    narrative:
      match.lifestyle.cleanliness.match === "perfect"
        ? "You and the room owner share the exact same cleanliness expectations. This reduces day-to-day friction in shared kitchen, bath, and living spaces."
        : match.lifestyle.cleanliness.match === "partial"
        ? "Your cleanliness habits are close, but there may be small differences. A quick alignment on who does what chores is recommended."
        : "Your cleanliness expectations differ. It's best to discuss rules for shared spaces before requesting connection.",
  });

  // Smoking Policy
  factors.push({
    id: "smoker",
    icon: <Cigarette className="w-5 h-5 text-slate-500" />,
    label: "Smoking Policy",
    scoreLabel: "House Rule",
    roomValue: match.lifestyle.smoker.roomAllowed ? "Allowed" : "Not Allowed",
    status: match.lifestyle.smoker.match as "perfect" | "partial" | "conflict",
    badgeLabel: match.lifestyle.smoker.match === "perfect" ? "Compatible" : "Conflict",
    rawUserValue: match.lifestyle.smoker.user,
    rawRoomValue: match.lifestyle.smoker.roomAllowed,
    narrative:
      match.lifestyle.smoker.match === "perfect"
        ? "Your smoking habits completely align with the room's policy. No smoke smell conflicts are expected."
        : "Conflict detected: You smoke, but this listing enforces a strict no-smoking policy. This is typically a firm boundary.",
  });

  // Drinking Policy
  factors.push({
    id: "drinker",
    icon: <Wine className="w-5 h-5 text-purple-500" />,
    label: "Drinking Policy",
    scoreLabel: "House Rule",
    roomValue: match.lifestyle.drinker.roomAllowed ? "Allowed" : "Not Allowed",
    status: match.lifestyle.drinker.match as "perfect" | "partial" | "conflict",
    badgeLabel: match.lifestyle.drinker.match === "perfect" ? "Compatible" : "Conflict",
    rawUserValue: match.lifestyle.drinker.user,
    rawRoomValue: match.lifestyle.drinker.roomAllowed,
    narrative:
      match.lifestyle.drinker.match === "perfect"
        ? "Your drinking choices align perfectly with the house guidelines."
        : "Conflict detected: You drink, but this room does not allow alcohol. This rule conflict should be respected.",
  });

  // Guest Policy
  factors.push({
    id: "guestPolicy",
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    label: "Guest Policy",
    scoreLabel: "House Rule",
    roomValue: match.lifestyle.guestPolicy.room || "No restrictions",
    status: match.lifestyle.guestPolicy.match as "perfect" | "partial" | "conflict",
    badgeLabel:
      match.lifestyle.guestPolicy.match === "perfect" ? "Aligned" : "Slightly Differs",
    rawUserValue: match.lifestyle.guestPolicy.user,
    rawRoomValue: match.lifestyle.guestPolicy.room,
    narrative:
      match.lifestyle.guestPolicy.match === "perfect"
        ? "Your guest policy preferences match the room rules. You are both on the same page regarding daytime visitors and overnight stays."
        : "The room has different rules regarding guests (e.g. sleepovers, number of guests allowed) than your preferences. Discuss during visit.",
  });

  // Sleep Schedule
  if (match.lifestyle.sleep?.user) {
    const isNightOwl = match.lifestyle.sleep.user === "night_owl";
    factors.push({
      id: "sleep",
      icon: isNightOwl ? (
        <Moon className="w-5 h-5 text-indigo-400" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400" />
      ),
      label: "Sleep Schedule",
      scoreLabel: "Bio-Clock Alignment",
      roomValue: match.lifestyle.sleep.room || "Flexible",
      status: "perfect" as const,
      badgeLabel: "Noted",
      rawUserValue: match.lifestyle.sleep.user,
      rawRoomValue: match.lifestyle.sleep.room,
      narrative: isNightOwl
        ? "As a Night Owl, you tend to stay active later. Be sure to discuss noise levels and quiet hours with any early risers."
        : "As an Early Bird, you prefer quiet, bright mornings. Coordinate schedule offsets to avoid bathroom bottle-necks.",
    });
  }

  return factors;
}
