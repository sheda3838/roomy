"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, MessageSquare } from "lucide-react";
import { handleRequest } from "@/server/actions/handleRequest";
import Link from "next/link";

interface HandleRequestButtonsProps {
  requestId: string;
  initialStatus: "pending" | "accepted";
  initialConnectionId?: string;
  disabled: boolean;
}

export default function HandleRequestButtons({
  requestId,
  initialStatus,
  initialConnectionId,
  disabled,
}: HandleRequestButtonsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "accepted">(initialStatus);
  const [connectionId, setConnectionId] = useState<string | undefined>(initialConnectionId);
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
        if (action === "accept") {
          setStatus("accepted");
          if (res.connectionId) {
            setConnectionId(res.connectionId);
          }
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "accepted") {
    return (
      <div className="flex flex-col gap-2 w-full">
        {connectionId ? (
          <Link
            href={`/chat/${connectionId}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-md roomy-gradient hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm w-full md:w-auto"
          >
            <MessageSquare className="w-4 h-4" />
            Chat Now
          </Link>
        ) : (
          <div className="text-emerald-600 font-semibold flex items-center gap-1.5 justify-center md:justify-end text-sm">
            <Check className="w-4 h-4" /> Accepted
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3 w-full justify-end">
        <button
          onClick={() => onAction("reject")}
          disabled={isProcessing}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          Decline
        </button>
        <button
          onClick={() => onAction("accept")}
          disabled={isProcessing || disabled}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Accept
        </button>
      </div>
      {errorMsg && <p className="text-red-500 text-xs font-semibold text-center md:text-right mt-1">{errorMsg}</p>}
      {disabled && <p className="text-amber-500 text-xs font-semibold text-center md:text-right mt-1">Room is at full capacity</p>}
    </div>
  );
}
