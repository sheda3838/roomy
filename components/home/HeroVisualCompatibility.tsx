"use client";

import React from "react";
import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";
import {
  Cigarette,
  Sun,
  Users,
  Brush,
  MapPin,
  Briefcase,
  Moon,
  DollarSign,
} from "lucide-react";

interface TagType {
  label: string;
  icon: React.ComponentType<any>;
  x: string;
  y: string;
  color: string;
  dotColor: string;
}

const TAGS: TagType[] = [
  {
    label: "Non-Smoker",
    icon: Cigarette,
    x: "15%",
    y: "20%",
    color: "text-slate-600 bg-slate-50/90 border-slate-200/60 shadow-sm",
    dotColor: "bg-slate-400",
  },
  {
    label: "Early Bird",
    icon: Sun,
    x: "38%",
    y: "12%",
    color: "text-amber-600 bg-amber-50/90 border-amber-200/60 shadow-sm",
    dotColor: "bg-amber-400",
  },
  {
    label: "No Guests",
    icon: Users,
    x: "82%",
    y: "22%",
    color: "text-rose-600 bg-rose-50/90 border-rose-200/60 shadow-sm",
    dotColor: "bg-rose-400",
  },
  {
    label: "Very Neat",
    icon: Brush,
    x: "14%",
    y: "48%",
    color: "text-cyan-600 bg-cyan-50/90 border-cyan-200/60 shadow-sm",
    dotColor: "bg-cyan-400",
  },
  {
    label: "Colombo 05",
    icon: MapPin,
    x: "86%",
    y: "50%",
    color: "text-blue-600 bg-blue-50/90 border-blue-200/60 shadow-sm",
    dotColor: "bg-blue-400",
  },
  {
    label: "Worker",
    icon: Briefcase,
    x: "16%",
    y: "76%",
    color: "text-purple-600 bg-purple-50/90 border-purple-200/60 shadow-sm",
    dotColor: "bg-purple-400",
  },
  {
    label: "Night Owl",
    icon: Moon,
    x: "42%",
    y: "86%",
    color: "text-indigo-600 bg-indigo-50/90 border-indigo-200/60 shadow-sm",
    dotColor: "bg-indigo-400",
  },
  {
    label: "Budget Friendly",
    icon: DollarSign,
    x: "80%",
    y: "76%",
    color: "text-emerald-600 bg-emerald-50/90 border-emerald-200/60 shadow-sm",
    dotColor: "bg-emerald-400",
  },
];

export default function HeroVisualCompatibility() {
  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] xl:h-[460px] flex items-center justify-center scale-95 lg:scale-100 origin-center select-none overflow-visible">
      {/* Background soft glowing blur elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] bg-gradient-to-r from-[rgb(46,219,244)]/15 to-[rgb(29,93,185)]/15 blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute left-1/2 top-1/2 -translate-x-[calc(50%+48px)] -translate-y-[calc(50%+48px)] w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] bg-gradient-to-r from-[rgb(250,192,140)]/15 to-[rgb(246,137,83)]/15 blur-[60px] rounded-full pointer-events-none z-0" />

      {/* SVG Connecting network lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <defs>
          <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(46, 219, 244, 0.2)" />
            <stop offset="50%" stopColor="rgba(34, 142, 222, 0.25)" />
            <stop offset="100%" stopColor="rgba(29, 93, 185, 0.2)" />
          </linearGradient>
        </defs>
        {TAGS.map((tag, idx) => (
          <line
            key={idx}
            x1="50%"
            y1="50%"
            x2={tag.x}
            y2={tag.y}
            stroke="url(#networkGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="opacity-75"
          />
        ))}
      </svg>

      {/* Central Compatibility Circle Card (Wrapper handles absolute centering) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-25 w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full rounded-full flex items-center justify-center pointer-events-auto relative"
        >
          {/* Soft pulsing glow behind the core */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] rounded-full blur-xl opacity-25 animate-pulse" />

          {/* Outer glass border circle */}
          <div className="absolute inset-0 rounded-full bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_16px_40px_rgba(29,93,185,0.12)] p-2 sm:p-2.5 flex items-center justify-center">
            {/* Inner white circle */}
            <div className="w-full h-full rounded-full bg-white shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
              {/* Soft spinning background mesh */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(46,219,244)]/10 via-transparent to-[rgb(29,93,185)]/10 animate-spin [animation-duration:12s]" />

              <div className="flex items-baseline justify-center relative z-10 leading-none">
                <Counter
                  value={92}
                  places={[10, 1]}
                  fontSize={32}
                  padding={2}
                  gap={1}
                  textColor="rgb(15, 23, 42)"
                  fontWeight={900}
                />
                <span className="text-[16px] font-black text-[rgb(29,93,185)] ml-0.5 select-none">%</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[rgb(29,93,185)] uppercase tracking-wider relative z-10 mt-1 sm:mt-1.5">
                Excellent Match
              </span>
              
              <div className="flex items-center gap-1 mt-1 sm:mt-1.5 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Preference Tags */}
      {TAGS.map((tag, idx) => {
        const IconComponent = tag.icon;
        return (
          <div
            key={idx}
            className="absolute z-20 pointer-events-auto -translate-x-1/2 -translate-y-1/2"
            style={{ left: tag.x, top: tag.y }}
          >
            <motion.div
              className="origin-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 4 + (idx % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.6, delay: 0.1 * idx },
                scale: { duration: 0.6, delay: 0.1 * idx },
              }}
              whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`flex items-center gap-1 px-2.5 py-1.5 sm:gap-1.5 sm:px-3.5 sm:py-2 rounded-full border bg-white/80 backdrop-blur-md shadow-sm transition-all duration-200 cursor-default ${tag.color}`}>
                <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-tight whitespace-nowrap">{tag.label}</span>
                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${tag.dotColor}`} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
