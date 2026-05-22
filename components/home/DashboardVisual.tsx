"use client";

import { motion } from "framer-motion";
import { User, Sparkles, MapPin, MessageCircle, ShieldCheck, Search } from "lucide-react";
import TypingEffect from "./TypingEffect";

export default function DashboardVisual() {
  return (
    // Outer Tablet Frame - Editorial Light Theme
    <div className="relative w-[850px] h-[550px] rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-zinc-200/50 overflow-hidden flex flex-col p-6 ring-1 ring-black/5">
      
      {/* Tablet Screen Glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-white/10" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[rgb(250,192,140)] to-[rgb(246,137,83)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* Mockup Top Nav & Typing Ecosystem */}
      <div className="relative z-10 w-full flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] flex items-center justify-center text-white font-bold text-xs shadow-md">R</div>
          <div className="h-4 w-24 bg-zinc-200/50 rounded-full" />
        </div>
        
        {/* Typing Bar Component embedded centrally */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white shadow-sm w-[350px]">
          <Search className="w-4 h-4 text-[rgb(34,142,222)] shrink-0" />
          <TypingEffect />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm"><User className="w-4 h-4 text-zinc-600" /></div>
        </div>
      </div>

      {/* Mockup Grid Content */}
      <div className="relative z-10 flex-1 grid grid-cols-12 gap-6">
        
        {/* Left Column: Room Preview */}
        <div className="col-span-5 h-full flex flex-col gap-4">
          <div className="w-full flex-1 rounded-2xl bg-white border border-zinc-100 shadow-sm overflow-hidden relative group p-2">
             <div className="w-full h-full rounded-xl overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400&h=300" alt="Room" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute bottom-3 left-3 z-20">
                 <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-zinc-900 font-bold text-sm mb-1 shadow-sm">$1,200/mo</div>
                 <div className="flex items-center gap-1 text-white text-xs font-medium drop-shadow-md"><MapPin className="w-3 h-3" /> Colombo 03</div>
               </div>
             </div>
          </div>
          <div className="h-20 w-full rounded-2xl bg-white p-4 flex items-center justify-between shadow-sm border border-zinc-100">
             <div>
               <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase font-sans">Compatibility</p>
               <p className="font-serif text-2xl text-zinc-800">Perfect Match</p>
             </div>
             <ShieldCheck className="w-7 h-7 text-[rgb(34,142,222)]" />
          </div>
        </div>

        {/* Right Column: Roommate Match & Chat */}
        <div className="col-span-7 h-full flex flex-col gap-4">
          
          {/* Match Card */}
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                   <User className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-zinc-900">Alex Chen</h4>
                  <p className="text-xs font-semibold text-[rgb(246,137,83)] uppercase tracking-wide">Looking for a room</p>
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-[rgb(46,219,244)] bg-[rgb(46,219,244)]/10">
                <span className="font-bold text-lg text-[rgb(34,142,222)]">98%</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <span className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-600 text-[11px] font-bold">Early Bird</span>
              <span className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-600 text-[11px] font-bold">Non-Smoker</span>
              <span className="px-3 py-1.5 rounded-full bg-[rgb(250,192,140)]/20 text-[rgb(239,62,43)] text-[11px] font-bold flex items-center gap-1"><Sparkles className="w-3 h-3"/> Clean Freak</span>
            </div>
          </div>

          {/* Chat Bubble */}
          <div className="w-full flex-1 bg-white/60 border border-zinc-100 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-end">
            <div className="flex items-end gap-3 self-end w-[85%]">
              <div className="bg-[rgb(34,142,222)] text-white p-4 rounded-2xl rounded-br-sm shadow-md text-sm leading-relaxed font-medium">
                "Hey! Our profiles are a 98% match. Your place looks perfect, are you free for a quick call tomorrow?"
              </div>
              <div className="w-8 h-8 rounded-full bg-[rgb(46,219,244)] shrink-0 flex items-center justify-center shadow-sm">
                 <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
