"use client";

import Link from "next/link";
import { Users, Zap, Shield } from "lucide-react";

interface RoomActionBottomBarProps {
  roomSlug: string;
  isOwner: boolean;
}

export default function RoomActionBottomBar({ roomSlug, isOwner }: RoomActionBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-4 md:pb-6 flex justify-center pointer-events-none">
      <div className="w-full max-w-lg mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-2 shadow-[0_20px_60px_-15px_rgba(29,93,185,0.3)] flex flex-col sm:flex-row items-center gap-2">
          
          {isOwner ? (
            <Link
              href={`/rooms/${roomSlug}/requests`}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[rgb(29,93,185)] hover:bg-[rgb(34,142,222)] text-white text-sm font-bold transition-all shadow-md"
            >
              <Users className="w-4 h-4" />
              View Join Requests
            </Link>
          ) : (
            <>
              {/* Check Compatibility - Primary */}
              <Link
                href={`/rooms/${roomSlug}/match`}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] shadow-md flex-1"
                style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
              >
                <Zap className="w-4 h-4 fill-white" />
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
  );
}
