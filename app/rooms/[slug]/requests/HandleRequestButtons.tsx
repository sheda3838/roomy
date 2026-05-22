"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { handleRequest } from "@/server/actions/handleRequest";

export default function HandleRequestButtons({ requestId, disabled }: { requestId: string, disabled: boolean }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onAction = async (action: "accept" | "reject") => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const res = await handleRequest(requestId, action);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => onAction("reject")}
          disabled={isProcessing}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 font-semibold hover:bg-red-900/40 transition-colors disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          Decline
        </button>
        <button
          onClick={() => onAction("accept")}
          disabled={isProcessing || disabled}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-800 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Accept
        </button>
      </div>
      {errorMsg && <p className="text-red-400 text-xs font-medium text-center md:text-right mt-1">{errorMsg}</p>}
      {disabled && <p className="text-amber-400 text-xs font-medium text-center md:text-right mt-1">Room is at full capacity</p>}
    </div>
  );
}
