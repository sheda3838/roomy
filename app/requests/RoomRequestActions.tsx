"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { acceptRequest } from "@/server/actions/acceptRequest";
import { rejectRequest } from "@/server/actions/rejectRequest";

interface RoomRequestActionsProps {
  requestId: string;
  roomSlug?: string;
  atCapacity: boolean;
}

export default function RoomRequestActions({
  requestId,
  roomSlug,
  atCapacity,
}: RoomRequestActionsProps) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState<"accepted" | "rejected" | null>(null);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    if (atCapacity) return;
    setLoading(true);
    setError("");
    const res = await acceptRequest(requestId);
    if (res.success) {
      setResolved("accepted");
    } else {
      setError(res.error || "Failed to accept");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    setError("");
    const res = await rejectRequest(requestId);
    if (res.success) {
      setResolved("rejected");
    } else {
      setError(res.error || "Failed to reject");
    }
    setLoading(false);
  };

  if (resolved === "accepted") {
    return (
      <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
        <Check className="w-4 h-4" /> Accepted
      </div>
    );
  }
  if (resolved === "rejected") {
    return (
      <div className="text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
        Declined
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {atCapacity && (
        <p className="text-xs text-amber-500 font-medium text-right">Room is at capacity</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleReject}
          disabled={loading}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Decline"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
        <button
          onClick={handleAccept}
          disabled={loading || atCapacity}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-white text-sm font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          style={{ background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))" }}
          title={atCapacity ? "Room is full" : "Accept"}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Accept
        </button>
      </div>
      {error && <p className="text-xs text-red-400 text-right">{error}</p>}
    </div>
  );
}
