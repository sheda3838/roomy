"use client";

import { MessageType } from "./FloatingChatProvider";

interface MessageBubbleProps {
  message: MessageType;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if message is a temporary optimistic one
  const isTemp = message._id.startsWith("temp-");

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group`}>
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap break-words transition-all ${
          isMe
            ? "roomy-gradient text-white rounded-br-sm shadow-sm"
            : "bg-slate-100/70 border border-slate-100 text-slate-800 rounded-bl-sm"
        } ${isTemp ? "opacity-60" : "opacity-100"}`}
      >
        <p>{message.content}</p>
      </div>
      <span className="text-[9px] font-semibold text-slate-400 mt-1 px-1 transition-opacity duration-200 opacity-60 group-hover:opacity-100">
        {formattedTime}
      </span>
    </div>
  );
}
