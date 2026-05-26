"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { sendJoinRequest } from "@/server/actions/sendJoinRequest";

export default function RequestToJoinButton({ roomId, isOwner }: { roomId: string, isOwner?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");

  if (isOwner) {
    return (
      <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-400 font-semibold cursor-not-allowed">
        You own this room
      </button>
    );
  }

  const handleRequest = async () => {
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
      }
    } catch (err: any) {
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
        onClick={handleRequest}
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
    </div>
  );
}
