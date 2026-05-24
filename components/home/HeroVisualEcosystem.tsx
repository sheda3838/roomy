"use client";

import { User, MapPin, Sparkles, MessageCircle, Moon } from "lucide-react";

export default function HeroVisualEcosystem() {
  return (
    <div className="relative w-full h-[450px] lg:h-[550px] flex items-center justify-center scale-90 lg:scale-100 origin-center">
      
      {/* Abstract Glowing Orbs for background depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[rgb(46,219,244)]/20 to-[rgb(29,93,185)]/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-gradient-to-tr from-[rgb(250,192,140)]/20 to-[rgb(246,137,83)]/20 blur-[80px] rounded-full pointer-events-none" />

      {/* 1. Main Room Preview Card (Center-Right) */}
      <div
        className="absolute z-20 w-[280px] sm:w-[320px] rounded-3xl bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(29,93,185,0.15)] overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-pointer"
        style={{ right: '5%', top: '15%' }}
      >
        <div className="h-[180px] w-full bg-slate-200 relative">
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop" alt="Room interior" className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[rgb(29,93,185)] uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> Top Match
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">Sunny Loft in Brooklyn</h3>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5" /> Williamsburg, NY
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[rgb(29,93,185)]">$1,400<span className="text-sm text-slate-400 font-medium">/mo</span></span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Available</span>
          </div>
        </div>
      </div>

      {/* 2. Compatibility Match Card (Center-Left) */}
      <div
        className="absolute z-30 w-[220px] rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-300 cursor-default"
        style={{ left: '5%', top: '35%' }}
      >
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="283" strokeDashoffset="28"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(46,219,244)" />
                <stop offset="100%" stopColor="rgb(29,93,185)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">92<span className="text-sm">%</span></span>
          </div>
        </div>
        <h4 className="font-bold text-slate-800 text-sm mb-3">Excellent Fit</h4>
        <div className="flex flex-wrap justify-center gap-1.5">
          <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1"><Moon className="w-3 h-3" /> Night Owl</span>
          <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Neat</span>
        </div>
      </div>

      {/* 3. Roommate Profile Snippet (Bottom Right) */}
      <div
        className="absolute z-10 w-[200px] rounded-2xl bg-white border border-slate-100 shadow-xl p-3 flex items-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300 cursor-pointer"
        style={{ right: '15%', bottom: '10%' }}
      >
        <div className="relative">
          <img src="https://i.pravatar.cc/150?u=sarah" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm object-cover" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Sarah M.</p>
          <p className="text-[10px] font-semibold text-slate-500">Looking for a room</p>
        </div>
      </div>

      {/* 4. Live Chat Bubble (Top Left) */}
      <div
        className="absolute z-40 rounded-2xl rounded-bl-sm bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] text-white shadow-lg shadow-[rgb(29,93,185)]/20 p-3 max-w-[200px]"
        style={{ left: '15%', top: '20%' }}
      >
        <p className="text-xs font-medium leading-relaxed">Hey! It looks like our lifestyle preferences match perfectly. ✨</p>
      </div>

    </div>
  );
}
