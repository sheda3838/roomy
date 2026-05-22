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
    <div className="w-full space-y-4">
      <textarea
        placeholder="Add a short message introducing yourself (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
      />
      <button
        onClick={handleRequest}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
        ) : (
          <>Request to Join <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
