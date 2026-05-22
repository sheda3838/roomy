"use client";

import { motion } from "framer-motion";
import { User, MapPin, Sparkles, Moon, ShieldCheck, Sun, Wind } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const float = (duration = 4, yRange = 10) => ({
  animate: { y: [0, -yRange, 0] },
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
});

export default function CompatibilityVisual() {
  return (
    <div className="relative w-full h-[560px] lg:h-[640px] flex items-center justify-center select-none">

      {/* ── Background Glows ── */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[rgb(46,219,244)] rounded-full opacity-[0.12] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[rgb(248,150,60)] rounded-full opacity-[0.12] blur-[80px] pointer-events-none" />

      {/* ── SVG Connection Lines ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 560 580" preserveAspectRatio="xMidYMid meet">
        {/* User 1 → Center */}
        <line x1="105" y1="160" x2="280" y2="290" stroke="url(#blueGrad)" strokeWidth="1.5" strokeDasharray="6 4" />
        {/* User 2 → Center */}
        <line x1="455" y1="160" x2="280" y2="290" stroke="url(#blueGrad)" strokeWidth="1.5" strokeDasharray="6 4" />
        {/* Center → Room */}
        <line x1="280" y1="290" x2="280" y2="460" stroke="url(#orangeGrad)" strokeWidth="1.5" strokeDasharray="6 4" />

        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(46,219,244)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(29,93,185)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(34,142,222)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(248,150,60)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Central Compatibility Ring ── */}
      <motion.div
        {...fadeUp(0.1)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] opacity-20 blur-xl" />
          {/* SVG ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(226,232,240)" strokeWidth="5" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${87 * 2.64} ${100 * 2.64}`}
            />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(46,219,244)" />
                <stop offset="100%" stopColor="rgb(29,93,185)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-2xl font-bold text-zinc-900 leading-none">87%</span>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">Match</span>
          </div>
        </div>
      </motion.div>

      {/* ── User Card 1 (top-left) ── */}
      <motion.div
        {...fadeUp(0.2)}
        {...float(4.5, 8)}
        className="absolute top-8 left-4 lg:left-8 z-10 w-[172px]"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-xl shadow-zinc-200/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 leading-tight">Sarah K.</p>
              <p className="text-[10px] text-zinc-500 font-medium">Working Professional</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(29,93,185)]/10 text-[rgb(29,93,185)] text-[10px] font-bold">
              <Moon className="w-2.5 h-2.5" /> Night Owl
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold">
              <Wind className="w-2.5 h-2.5" /> Non-Smoker
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── User Card 2 (top-right) ── */}
      <motion.div
        {...fadeUp(0.3)}
        {...float(5.2, 10)}
        className="absolute top-8 right-4 lg:right-8 z-10 w-[172px]"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-xl shadow-zinc-200/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgb(250,192,140)] to-[rgb(246,137,83)] flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 leading-tight">James M.</p>
              <p className="text-[10px] text-zinc-500 font-medium">University Student</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(248,150,60)]/15 text-[rgb(239,62,43)] text-[10px] font-bold">
              <Sun className="w-2.5 h-2.5" /> Early Bird
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5" /> Neat
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Room Card (bottom-center) ── */}
      <motion.div
        {...fadeUp(0.45)}
        {...float(6, 7)}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-[240px]"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-200/70">
          {/* Room Image strip */}
          <div className="relative h-24 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=480&q=75"
              alt="Room"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Highly Compatible badge */}
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] text-white text-[10px] font-bold shadow-lg">
              <ShieldCheck className="w-3 h-3" /> Highly Compatible
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-bold text-zinc-900">$1,150 <span className="text-xs font-medium text-zinc-500">/mo</span></p>
              <div className="flex items-center gap-1 text-zinc-500 text-[11px] font-medium">
                <MapPin className="w-3 h-3" /> Colombo 03
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[rgb(34,142,222)]/10 text-[rgb(34,142,222)] text-[10px] font-bold">Budget Match</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold">Lifestyle Fit</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating Chips ── */}
      <motion.div
        {...fadeUp(0.55)}
        className="absolute top-[42%] left-0 z-30"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[rgb(46,219,244)]" />
          <span className="text-[11px] font-bold text-zinc-700">Same Sleep Schedule</span>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp(0.62)}
        className="absolute top-[42%] right-0 z-30"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[rgb(248,150,60)]" />
          <span className="text-[11px] font-bold text-zinc-700">High Compatibility</span>
        </div>
      </motion.div>

      {/* ── Dot nodes on connection lines ── */}
      {/* Node on User 1 line */}
      <div className="absolute z-20" style={{ top: "calc(27.5% + 10px)", left: "calc(18.75% + 10px)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[rgb(46,219,244)] shadow-[0_0_8px_rgba(46,219,244,0.8)]" />
      </div>
      {/* Node on User 2 line */}
      <div className="absolute z-20" style={{ top: "calc(27.5% + 10px)", right: "calc(18.75% + 10px)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[rgb(46,219,244)] shadow-[0_0_8px_rgba(46,219,244,0.8)]" />
      </div>
      {/* Node on Room line */}
      <div className="absolute z-20" style={{ top: "calc(50% + 80px)", left: "calc(50% - 5px)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[rgb(34,142,222)] shadow-[0_0_8px_rgba(34,142,222,0.8)]" />
      </div>

    </div>
  );
}
