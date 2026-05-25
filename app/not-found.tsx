"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, ArrowLeft, DoorOpen, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[rgb(243,244,237)] text-slate-900 flex items-center justify-center p-6 pt-32 pb-20 relative overflow-hidden font-sans">
      
      {/* Moving Ambient Gradient Blobs for Cinematic Feeling */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[rgb(46,219,244)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[rgb(250,192,140)]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-[rgb(34,142,222)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        
        {/* Floating Empty Room Illustration */}
        <motion.div 
          className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glass background plate */}
          <div className="absolute inset-4 bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-[0_20px_40px_rgba(29,93,185,0.1)] rotate-3" />
          <div className="absolute inset-4 bg-gradient-to-tr from-[rgb(46,219,244)]/20 to-[rgb(250,192,140)]/20 backdrop-blur-2xl rounded-[40px] border border-white/80 shadow-inner -rotate-6" />
          
          {/* Main Door / Room graphic */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-32 bg-white rounded-t-full border-[6px] border-slate-100 shadow-xl overflow-hidden flex flex-col items-center pt-6">
              {/* Inside the room - dark / empty void */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950 opacity-90" />
              
              {/* A subtle glowing light inside */}
              <div className="absolute top-6 w-12 h-12 bg-amber-400/20 blur-xl rounded-full" />
              
              {/* Star / Dust particles inside */}
              <motion.div 
                className="absolute w-1.5 h-1.5 bg-white/60 rounded-full top-8 right-6"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-1 h-1 bg-white/40 rounded-full bottom-10 left-8"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />

              {/* Icon in the dark */}
              <DoorOpen className="w-8 h-8 text-white/40 relative z-10 mt-auto mb-4" />
            </div>
            
            {/* The 404 tag floating nearby */}
            <motion.div 
              className="absolute -right-4 top-10 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-lg rotate-12"
              animate={{ rotate: [12, 16, 12], y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[rgb(250,192,140)] to-[rgb(239,62,43)]">
                404
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] text-[11px] font-bold uppercase tracking-wider mb-6">
            <Compass className="w-3.5 h-3.5" /> Room Not Found
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[-0.02em] leading-tight text-slate-900 mb-4">
            You've wandered into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] font-bold">empty listing</span>
          </h1>
          
          <p className="text-slate-500 font-medium text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            The room you are looking for might have been deactivated by the host, moved to a different url, or never existed at all.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] text-white font-bold text-sm shadow-[0_10px_30px_-10px_rgba(29,93,185,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(29,93,185,0.6)] transition-all hover:-translate-y-1"
          >
            <Home className="w-4 h-4" />
            Go Back Home
          </Link>
          
          <Link
            href="/discover"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[rgb(29,93,185)] font-bold text-sm shadow-sm border border-slate-200 hover:border-[rgb(34,142,222)]/30 hover:bg-slate-50 transition-all hover:-translate-y-1"
          >
            <Map className="w-4 h-4" />
            Browse Available Rooms
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <button 
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to previous page
          </button>
        </motion.div>

      </div>
    </div>
  );
}
