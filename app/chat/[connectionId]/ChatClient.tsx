"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPusherClient } from "@/lib/pusher";
import { sendMessage } from "@/server/actions/chat";
import UserAvatar from "@/components/shared/UserAvatar";

interface MessageType {
  _id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: "text" | "system";
  createdAt: string;
}

interface ChatClientProps {
  connectionId: string;
  currentUserId: string;
  partner: any;
  initialMessages: MessageType[];
}

export default function ChatClient({ connectionId, currentUserId, partner, initialMessages }: ChatClientProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pusher Subscription
  useEffect(() => {
    // Enable pusher logging for debugging
    getPusherClient().connection.bind('error', function (err: any) {
      console.error('Pusher connection error:', err);
    });

    const pusher = getPusherClient();
    const channelName = `private-chat-${connectionId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log(`Successfully subscribed to ${channelName}`);
    });

    channel.bind("pusher:subscription_error", (status: any) => {
      console.error(`Subscription to ${channelName} failed with status:`, status);
    });

    channel.bind("message:new", (newMsg: MessageType) => {
      console.log("Received new message via Pusher:", newMsg);
      // Prevent duplicating the message if it's the one we just optimistically added
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      console.log(`Unsubscribing from ${channelName}`);
      pusher.unsubscribe(channelName);
    };
  }, [connectionId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    // Optimistic UI Update
    const optimisticMsg: MessageType = {
      _id: `temp-${Date.now()}`, // Temporary ID
      connectionId,
      senderId: currentUserId,
      receiverId: partner._id,
      content,
      messageType: "text",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    // Send to server
    try {
      const res = await sendMessage(connectionId, content);
      if (res.success) {
        // Handle race condition: if Pusher already delivered the real message, 
        // just remove the temp message. Otherwise, replace temp with real.
        setMessages((prev) => {
          const alreadyHasRealMessage = prev.some((m) => m._id === res.message._id);
          if (alreadyHasRealMessage) {
            return prev.filter((m) => m._id !== optimisticMsg._id);
          }
          return prev.map((m) => m._id === optimisticMsg._id ? res.message : m);
        });
      } else {
        // Handle error (e.g., remove optimistic message or show error state)
        console.error("Failed to send message:", res.error);
        setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <Link href="/messages" className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <UserAvatar
            src={partner?.profilePicture}
            alt={partner?.fullName}
            className="w-10 h-10 rounded-full border border-zinc-700 shadow-sm"
          />
          <div>
            <h1 className="font-bold text-white text-base leading-tight">
              {partner?.fullName || "Roommate"}
            </h1>
            <p className="text-xs text-emerald-400 font-medium">Connected</p>
          </div>
        </div>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
              <Send className="w-6 h-6 text-indigo-500/50" />
            </div>
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isMe 
                      ? "bg-indigo-600 text-white rounded-br-sm" 
                      : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-indigo-200" : "text-zinc-400"} text-right`}>
                    {mounted ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-zinc-950 border-t border-zinc-900">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Message..."
              className="w-full max-h-32 p-3 bg-transparent text-white placeholder:text-zinc-500 resize-none focus:outline-none"
              rows={1}
              style={{ minHeight: '44px' }}
            />
          </div>
          <button 
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="w-11 h-11 shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-zinc-600 mt-2">
          Messages are private and secured end-to-end between connected roommates.
        </p>
      </footer>

    </div>
  );
}
