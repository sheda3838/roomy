"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, User as UserIcon, Loader2 } from "lucide-react";
import { useFloatingChat, MessageType } from "./FloatingChatProvider";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import UserAvatar from "@/components/shared/UserAvatar";

interface ConversationViewProps {
  connectionId: string;
}

export default function ConversationView({ connectionId }: ConversationViewProps) {
  const {
    connections,
    messages,
    partnerTyping,
    isLoadingMessages,
    sendMessage,
    closeChat,
    sendTypingStatus,
  } = useFloatingChat();

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Find connection info
  const conn = connections.find((c) => c._id === connectionId);
  const partner = conn?.partner;
  const conversationMessages = messages[connectionId] || [];
  const isPartnerTyping = partnerTyping[connectionId] || false;

  // Auto-scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  // Scroll to bottom on new messages or typing changes
  useEffect(() => {
    scrollToBottom(conversationMessages.length <= 1 ? "auto" : "smooth");
  }, [conversationMessages.length, isPartnerTyping]);

  // Cleanup typing timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // If we were typing, notify partner we stopped
      if (isTypingRef.current) {
        sendTypingStatus(connectionId, false);
      }
    };
  }, [connectionId, sendTypingStatus]);

  // Handle typing event dispatching
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(connectionId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTypingStatus(connectionId, false);
    }, 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = inputValue.trim();
    if (!content) return;

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Stop typing immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    sendTypingStatus(connectionId, false);

    setIsSending(true);
    try {
      await sendMessage(connectionId, content);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]/50 relative">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 shrink-0">
        <button
          onClick={closeChat}
          className="p-1.5 -ml-1 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <UserAvatar
            src={partner?.profilePicture}
            alt={partner?.fullName}
            className="w-9 h-9 rounded-full border border-slate-100 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-slate-800 text-[13.5px] leading-tight">
              {partner?.fullName || "Roommate"}
            </h3>
            {isPartnerTyping ? (
              <span className="text-[10px] text-[rgb(34,142,222)] font-semibold animate-pulse">Typing...</span>
            ) : (
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {conversationMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Send className="w-5 h-5 text-[rgb(34,142,222)]/70 rotate-45 -translate-x-0.5" />
            </div>
            <h4 className="font-bold text-[14px] text-slate-700">No Messages Yet</h4>
            <p className="text-[11.5px] max-w-[200px] leading-normal">
              Introduce yourself and start searching for room compatibility!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversationMessages.map((msg: MessageType) => {
              const isMe = msg.senderId !== partner?._id;
              return (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isMe={isMe}
                />
              );
            })}

            {isPartnerTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Input Footer */}
      <footer className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:border-[rgb(34,142,222)]/50 focus-within:ring-1 focus-within:ring-[rgb(34,142,222)]/30 transition-all">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full p-3 max-h-28 bg-transparent text-slate-800 placeholder:text-slate-400 text-[13px] resize-none focus:outline-none leading-normal"
              rows={1}
              style={{ minHeight: "40px" }}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="w-9 h-9 shrink-0 rounded-xl roomy-gradient text-white flex items-center justify-center disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-100"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}
