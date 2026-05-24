"use client";

import { motion } from "framer-motion";
import { 
  MapPin, Brush, Moon, ShieldCheck, Sun, Wind, 
  Coffee, Activity, Users, Wifi, Bath, Utensils
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function CompatibilityVisual() {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center select-none font-sans perspective-1000">
      
      {/* ── Background Elements & Glows ── */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[rgb(46,219,244)] rounded-full opacity-[0.08] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[rgb(248,150,60)] rounded-full opacity-[0.08] blur-[100px] pointer-events-none" />
 
      {/* ── Main Dashboard Window ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[840px] bg-white/70 backdrop-blur-3xl border border-white/80 rounded-[32px] p-6 lg:p-8 shadow-[0_40px_80px_-20px_rgba(29,93,185,0.15)] relative z-10 mx-4"
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300/50" />
            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300/50" />
            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300/50" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engine Active</span>
          </div>
        </div>
 
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ── Left Column: User Profiles ── */}
          <div className="lg:col-span-5 flex flex-col gap-4 relative">
            
            {/* Connecting Vertical Line (SVG) */}
            <svg className="absolute left-7 top-14 bottom-14 w-1 hidden lg:block z-0" preserveAspectRatio="none">
              <line x1="2" y1="0" x2="2" y2="100%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" />
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(46,219,244)" />
                  <stop offset="100%" stopColor="rgb(248,150,60)" />
                </linearGradient>
              </defs>
            </svg>
 
            {/* User 1 */}
            <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative z-10 group hover:shadow-md transition-all">
              <div className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                Online
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sarah K., 24</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Product Designer</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-2.5 h-2.5" /> Downtown
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[rgb(29,93,185)]/10 text-[rgb(29,93,185)] text-[10px] font-bold">
                  <Moon className="w-2.5 h-2.5" /> Night Owl
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">
                  <Brush className="w-2.5 h-2.5" /> Clean
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">
                  <Coffee className="w-2.5 h-2.5" /> Quiet
                </span>
              </div>
            </motion.div>

            {/* Connecting Match Badge */}
            <motion.div {...fadeUp(0.3)} className="hidden lg:flex justify-center z-10 py-1">
              <div className="bg-[rgb(34,142,222)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Potential Match
              </div>
            </motion.div>

            {/* User 2 */}
            <motion.div {...fadeUp(0.4)} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative z-10 group hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="James" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">James M., 26</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Software Engineer</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-2.5 h-2.5" /> Tech District
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[rgb(248,150,60)]/15 text-[rgb(239,62,43)] text-[10px] font-bold">
                  <Sun className="w-2.5 h-2.5" /> Early Bird
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">
                  <Wind className="w-2.5 h-2.5" /> Non-Smoker
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">
                  <Users className="w-2.5 h-2.5" /> Social
                </span>
              </div>
            </motion.div>

          </div>

          {/* ── Right Column: Analysis & Room ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Compatibility Analysis Card */}
            <motion.div {...fadeUp(0.5)} className="bg-gradient-to-br from-white to-slate-50/50 rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] opacity-80" />
              
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Circular Score */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[rgb(34,142,222)]/5 blur-xl group-hover:bg-[rgb(34,142,222)]/10 transition-colors" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(241,245,249)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="44"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${92 * 2.76} ${100 * 2.76}`}
                      initial={{ strokeDashoffset: 100 * 2.76 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(46,219,244)" />
                        <stop offset="100%" stopColor="rgb(29,93,185)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-3xl font-serif font-bold text-slate-900 leading-none">92<span className="text-xl text-slate-400">%</span></span>
                    <span className="text-[10px] font-bold text-[rgb(34,142,222)] uppercase tracking-wider mt-1">Match</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 w-full space-y-4">
                  {[
                    { label: "Lifestyle Sync", val: 95, color: "bg-[rgb(34,142,222)]" },
                    { label: "Cleanliness", val: 88, color: "bg-[rgb(46,219,244)]" },
                    { label: "Budget Fit", val: 92, color: "bg-[rgb(246,137,83)]" },
                  ].map((item, i) => (
                    <div key={item.label} className="w-full">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                        <span>{item.label}</span>
                        <span className="text-slate-400">{item.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          transition={{ duration: 1, delay: 1 + (i * 0.15), ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Room Preview Card */}
            <motion.div {...fadeUp(0.6)} className="bg-white rounded-[24px] p-3 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 group hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
              
              <div className="w-full sm:w-36 h-36 rounded-[16px] overflow-hidden shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                  alt="Room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white text-[9px] font-bold border border-white/20">
                  2 spots left
                </div>
              </div>
              
              <div className="flex-1 py-1 pr-2 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-tight">Sunny Loft in Westside</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> 1.2 miles from work
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <p className="text-lg font-bold text-[rgb(34,142,222)] leading-none">$1,250<span className="text-[10px] font-medium text-slate-400">/mo</span></p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)] text-[9px] font-bold">
                    <Activity className="w-2.5 h-2.5" /> High Fit
                  </span>
                </div>
                
                {/* Amenities mini row */}
                <div className="flex items-center gap-3 text-slate-400 pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-[10px] font-semibold"><Wifi className="w-3 h-3" /> Fast WiFi</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold"><Bath className="w-3 h-3" /> Private Bath</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold"><Utensils className="w-3 h-3" /> Kitchen</span>
                </div>
              </div>
              
              {/* Decorative side accent */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-100 rounded-l-full group-hover:bg-[rgb(34,142,222)] transition-colors opacity-0 sm:opacity-100" />
            </motion.div>

          </div>
        </div>

      </motion.div>

    </div>
  );
}
