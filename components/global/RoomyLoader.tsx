"use client";

import React from "react";
import { motion } from "framer-motion";

interface RoomyLoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export default function RoomyLoader({ fullScreen = false, text = "Loading..." }: RoomyLoaderProps) {
  // --- Animation Variants --- //

  // Loop Duration
  const DURATION = 3.5;

  const characterVariants = {
    initial: { x: 40, opacity: 0, rotate: 0 },
    animate: {
      x: [40, 160, 160, 160, 160, 160, 40],
      rotate: [0, 0, 0, 12, 0, 0, 0],
      opacity: [0, 1, 1, 1, 1, 0, 0],
      transition: {
        duration: DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
      },
    },
  };

  const shadowVariants = {
    initial: { scale: 0, opacity: 0, x: 40 },
    animate: {
      scale: [0, 1, 1, 0.8, 1, 0, 0],
      opacity: [0, 0.2, 0.2, 0.15, 0.2, 0, 0],
      x: [40, 160, 160, 160, 160, 160, 40],
      transition: {
        duration: DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
      },
    },
  };

  const doorVariants = {
    initial: { scaleX: 1 },
    animate: {
      scaleX: [1, 1, 0.15, 0.15, 1, 1],
      transition: {
        duration: DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.35, 0.45, 0.7, 0.8, 1],
      },
    },
  };

  const lightVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0, 1, 1, 0, 0],
      scale: [0.8, 0.8, 1, 1, 0.8, 0.8],
      transition: {
        duration: DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.35, 0.45, 0.7, 0.8, 1],
      },
    },
  };

  // --- Loader Core Content --- //
  const LoaderContent = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[180px] h-[132px]">
        <svg viewBox="0 0 300 220" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lightGlow" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(248,150,60)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(248,150,60)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="doorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(46,219,244)" />
              <stop offset="100%" stopColor="rgb(29,93,185)" />
            </linearGradient>
          </defs>

          {/* Floor Line */}
          <path
            d="M 20 180 L 280 180"
            stroke="rgb(226,232,240)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Light Beam */}
          <motion.path
            d="M 230 180 L 80 180 L 110 90 L 230 62 Z"
            fill="url(#lightGlow)"
            style={{ transformOrigin: "230px 180px" }}
            variants={lightVariants}
            initial="initial"
            animate="animate"
          />

          {/* Door Frame */}
          <path
            d="M 226 180 L 226 58 L 274 58 L 274 180"
            fill="none"
            stroke="rgb(203,213,225)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Inside Room Background (Visible when door opens) */}
          <rect x="228" y="60" width="44" height="120" fill="rgb(248,250,252)" />

          {/* Door Panel */}
          <motion.g
            style={{ transformOrigin: "272px 120px" }}
            variants={doorVariants}
            initial="initial"
            animate="animate"
          >
            <rect x="228" y="60" width="44" height="120" fill="url(#doorGradient)" rx="2" />
            <circle cx="236" cy="120" r="3" fill="white" />
          </motion.g>

          {/* Character Shadow */}
          <motion.ellipse
            cx="0"
            cy="180"
            rx="20"
            ry="3"
            fill="rgb(15,23,42)"
            variants={shadowVariants}
            initial="initial"
            animate="animate"
          />

          {/* Character */}
          <motion.g
            variants={characterVariants}
            initial="initial"
            animate="animate"
            style={{ transformOrigin: "0px 180px" }}
          >
            {/* Backpack */}
            <rect x="-20" y="112" width="14" height="28" rx="5" fill="rgb(248,150,60)" />
            {/* Body */}
            <rect x="-10" y="106" width="22" height="46" rx="11" fill="rgb(34,142,222)" />
            {/* Head */}
            <circle cx="1" cy="90" r="13" fill="rgb(29,93,185)" />
            
            {/* Minimal Face / Glasses (SaaS abstract detail) */}
            <path d="M 6 88 L 12 88" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>
        </svg>
      </div>

      <motion.p 
        className="mt-2 text-sm font-semibold tracking-wide text-slate-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );

  // --- Render Mode --- //
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(34,142,222)]/5 to-[rgb(248,150,60)]/5 pointer-events-none" />
        {LoaderContent}
      </div>
    );
  }

  return <div className="w-full flex justify-center py-8">{LoaderContent}</div>;
}
