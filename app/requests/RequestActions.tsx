"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Loader2, MessageSquare } from "lucide-react";
import { handleRoommateRequestAction } from "@/server/actions/handleRoommateRequest";

interface RequestActionsProps {
  requestId: string;
}

export default function RequestActions({ requestId }: RequestActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "accepted" | "rejected">("idle");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAction = async (action: "accept" | "reject") => {
    setIsLoading(true);
    setError("");

    try {
      const res = await handleRoommateRequestAction(requestId, action);
      if (res.success) {
        setStatus(action === "accept" ? "accepted" : "rejected");
        if (action === "accept" && res.connectionId) {
          setConnectionId(res.connectionId);
        }
      } else {
        setError(res.error || "Failed to process request");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "accepted") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
          <Check className="w-4 h-4" /> Accepted
        </div>
        {connectionId && (
          <Link
            href={`/chat/${connectionId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition-all hover:scale-105 shadow-md"
            style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Start Chat
          </Link>
        )}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
        Declined
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("reject")}
          disabled={isLoading}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Decline"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
        <button
          onClick={() => handleAction("accept")}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-white text-sm font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
          title="Accept"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Accept
        </button>
      </div>
      {error && <p className="text-xs text-red-400 text-right">{error}</p>}
    </div>
  );
}

