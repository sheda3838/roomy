"use client";
import { IUser, IRoom } from "@/types";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { sendJoinRequest } from "@/server/actions/sendJoinRequest";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function RequestToJoinButton({ roomId, isOwner, compatibilityScore }: { roomId: string, isOwner?: boolean, compatibilityScore?: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);

  if (isOwner) {
    return (
      <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-400 font-semibold cursor-not-allowed">
        You own this room
      </button>
    );
  }

  const handleRequestClick = () => {
    if (compatibilityScore !== undefined && compatibilityScore < 50) {
      setShowWarningModal(true);
    } else {
      executeRequest();
    }
  };

  const executeRequest = async () => {
    setShowWarningModal(false);
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await sendJoinRequest(roomId, message);
      if (res.error) {
        setStatus("error");
        setErrorMsg(res.error);
      } else {
        setStatus("success");
        toast.success("Request sent successfully!");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <button disabled className="w-full py-4 rounded-xl bg-emerald-900/50 text-emerald-400 border border-emerald-800 font-semibold cursor-not-allowed">
        Request Sent Successfully!
      </button>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleRequestClick}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] text-white font-bold shadow-lg hover:shadow-[rgb(29,93,185)]/20 transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
        ) : (
          <>Request to Join <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-3 text-center font-semibold">{errorMsg}</p>
      )}

      {/* LOW COMPATIBILITY WARNING MODAL */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] shadow-2xl p-6 md:p-8 max-w-sm w-full border border-amber-200/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-5 mx-auto">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                Low Compatibility Warning
              </h3>
              <p className="text-sm text-center font-semibold text-slate-500 mb-6 leading-relaxed">
                You have significant lifestyle differences with this room. Are you sure you want to send a connection request anyway?
              </p>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeRequest}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Anyway"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
