"use client";

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { sendRoommateRequest } from "@/server/actions/handleRoommateRequest";

interface SendRequestButtonProps {
  targetUserId: string;
  targetName: string;
}

export default function SendRequestButton({ targetUserId, targetName }: SendRequestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendRequest = async () => {
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await sendRoommateRequest(targetUserId, `Hi ${targetName}, I saw we have a great compatibility score! Would you like to connect?`);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to send request.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
        <CheckCircle2 className="w-5 h-5" /> Request Sent
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center md:items-start">
      <button
        onClick={handleSendRequest}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
        Connect
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
