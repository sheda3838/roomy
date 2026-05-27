"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Heart, 
  MapPin, 
  Wallet, 
  Home, 
  CheckCircle2,
  Brush,
  Cigarette,
  Wine,
  Users,
  Moon,
  Briefcase
} from "lucide-react";

interface CompatibilityExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompatibilityExplanationModal({ isOpen, onClose }: CompatibilityExplanationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-2xl pointer-events-auto"
              // Add a subtle inner shadow to make it feel premium
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)" }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 p-6 sm:p-8 flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-slate-900 mb-2">
                    How Roomy Finds the Right Match
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 max-w-md">
                    We use multiple lifestyle and preference signals to help you find better rooms and roommates.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Lifestyle Compatibility */}
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">Lifestyle Compatibility</h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mb-5">
                    We deeply analyze your daily habits to minimize friction and ensure a harmonious co-living experience.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Brush, label: "Cleanliness" },
                      { icon: Cigarette, label: "Smoking" },
                      { icon: Wine, label: "Drinking" },
                      { icon: Users, label: "Guest Preferences" },
                      { icon: Moon, label: "Sleep Schedule" },
                      { icon: Briefcase, label: "Occupation" },
                      { icon: CheckCircle2, label: "Gender Compatibility" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                        <item.icon className="w-3.5 h-3.5 text-slate-400" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid for Budget & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Budget Match */}
                  <div className="bg-gradient-to-br from-orange-50/50 to-white border border-orange-100/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-orange-600" />
                      </div>
                      <h3 className="font-bold text-slate-900">Budget Match</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      We compare your budget range with the room rent to ensure financial comfort and alignment.
                    </p>
                  </div>

                  {/* Location Match */}
                  <div className="bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-100/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-slate-900">Location Match</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      We prioritize rooms located in your preferred neighborhoods to reduce travel stress.
                    </p>
                  </div>
                </div>

                {/* Facilities Match */}
                <div className="bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Facilities Match</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    We match specific room facilities like kitchen access, washroom type, laundry, meals, parking, and more to ensure your needs are met.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 sm:p-8 pt-2 border-t border-slate-100/50 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-md"
                >
                  Got it!
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
