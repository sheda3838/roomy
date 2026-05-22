"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { handleRoommateRequestAction } from "@/server/actions/handleRoommateRequest";

interface RequestActionsProps {
  requestId: string;
}

export default function RequestActions({ requestId }: RequestActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "accepted" | "rejected">("idle");
  const [error, setError] = useState("");

  const handleAction = async (action: "accept" | "reject") => {
    setIsLoading(true);
    setError("");

    try {
      const res = await handleRoommateRequestAction(requestId, action);
      if (res.success) {
        setStatus(action === "accept" ? "accepted" : "rejected");
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
    return <div className="text-sm font-medium text-emerald-400">Request Accepted</div>;
  }
  if (status === "rejected") {
    return <div className="text-sm font-medium text-orange-400">Request Rejected</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleAction("reject")}
          disabled={isLoading}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleAction("accept")}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          Accept
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
