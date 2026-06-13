"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Heart, Shield, Edit2, Power, Loader2, X, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toggleRoomStatus } from "@/server/actions/toggleRoomStatus";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

interface RoomActionBottomBarProps {
  roomSlug: string;
  isOwner: boolean;
  isActive?: boolean;
}

export default function RoomActionBottomBar({ roomSlug, isOwner, isActive = true }: RoomActionBottomBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    const res = await toggleRoomStatus(roomSlug);
    setIsLoading(false);
    if (res.error) {
      showErrorToast("Error", res.error);
    } else {
      showSuccessToast(
        res.isActive ? "Room Reactivated" : "Room Deactivated",
        res.isActive ? "Your room is now visible in discovery." : "Your room has been hidden from discovery."
      );
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-4 md:pb-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-lg mx-auto pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-2 shadow-[0_20px_60px_-15px_rgba(29,93,185,0.3)] flex flex-col sm:flex-row items-center gap-2">
            
            {isOwner ? (
              <div className="flex w-full gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all text-xs sm:text-sm font-bold ${
                    isActive 
                      ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200" 
                      : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 bg-emerald-50/50"
                  }`}
                  title={isActive ? "Deactivate Room" : "Reactivate Room"}
                >
                  <Power className="w-4 h-4" />
                  <span className="hidden sm:inline">{isActive ? "Deactivate" : "Reactivate"}</span>
                  <span className="sm:hidden">{isActive ? "Deactivate" : "Reactivate"}</span>
                </button>
                <Link
                  href={`/rooms/${roomSlug}/requests`}
                  className="flex-[1.5] flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl bg-[rgb(29,93,185)] hover:bg-[rgb(34,142,222)] text-white text-xs sm:text-sm font-bold transition-all shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Requests</span>
                </Link>
                <Link
                  href={`/rooms/${roomSlug}/edit`}
                  data-testid="edit-room-button"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl bg-white text-[rgb(34,142,222)] hover:bg-slate-50 border border-[rgb(34,142,222)]/20 text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Room</span>
                  <span className="sm:hidden">Edit</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Check Compatibility - Primary */}
                <Link
                  href={`/rooms/${roomSlug}/match`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] shadow-md flex-1"
                  style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Check Compatibility & Join
                </Link>
              </>
            )}
            
          </div>
          
          {/* Trust badge below the bar */}
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-3 flex items-center justify-center gap-1.5 drop-shadow-sm">
            <Shield className="w-3 h-3 text-[rgb(34,142,222)]" /> Secure application process
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isLoading && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isActive ? <AlertTriangle className="w-8 h-8" /> : <Power className="w-8 h-8" />}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {isActive ? "Deactivate Room?" : "Reactivate Room?"}
                </h3>
                
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  {isActive 
                    ? "This room will no longer appear in discovery or search results. All chats and requests will be preserved." 
                    : "This room will become visible again in discovery and matching for potential roommates."}
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold transition-all shadow-sm disabled:opacity-50 ${
                      isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isActive ? "Deactivate" : "Reactivate")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
