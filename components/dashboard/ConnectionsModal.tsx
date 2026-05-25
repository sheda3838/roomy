"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, MessageCircle, UserMinus, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/shared/UserAvatar";
import { removeConnection } from "@/server/actions/removeConnection";

interface Connection {
  _id: string;
  roomId?: string;
  room?: {
    title: string;
    slug: string;
    locationText: string;
    image?: string;
  } | null;
  partner?: {
    _id: string;
    fullName: string;
    profilePicture?: string;
    roleType?: string;
  } | null;
  connectedAt: string;
}

interface ConnectionsModalProps {
  connections: Connection[];
}

export default function ConnectionsModal({ connections: initialConnections }: ConnectionsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRemove = async (connectionId: string) => {
    setRemovingId(connectionId);
    setError("");
    const res = await removeConnection(connectionId);
    if (res.success) {
      setConnections((prev) => prev.filter((c) => c._id !== connectionId));
    } else {
      setError(res.error || "Failed to remove connection.");
    }
    setRemovingId(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:bg-slate-50 whitespace-nowrap"
      >
        <Users className="w-4 h-4 text-[rgb(34,142,222)]" />
        My Connections
        {connections.length > 0 && (
          <span className="ml-1 bg-[rgb(34,142,222)] text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {connections.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(34,142,222)]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[rgb(29,93,185)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Connections</h2>
                    <p className="text-xs font-semibold text-slate-500">People you have matched with</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                  </div>
                )}

                {connections.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 mb-1">No connections yet</p>
                    <p className="text-xs text-slate-400 font-medium">When you match with someone, they will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connections.map((conn) => {
                      if (!conn.partner) return null;
                      return (
                        <div key={conn._id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-[rgb(34,142,222)]/30">
                          <Link href={`/people/${conn.partner._id}`} className="flex items-center gap-3 flex-1 group">
                            <UserAvatar
                              src={conn.partner.profilePicture}
                              alt={conn.partner.fullName}
                              className="w-12 h-12 rounded-xl shadow-sm border border-slate-100 group-hover:border-[rgb(34,142,222)]/50 transition-colors"
                            />
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[rgb(29,93,185)] transition-colors flex items-center gap-1">
                                {conn.partner.fullName} <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 capitalize">{conn.partner.roleType || "Member"}</p>
                              {conn.room && (
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                                  via {conn.room.title}
                                </p>
                              )}
                            </div>
                          </Link>
                          
                          <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
                            <Link
                              href="/messages"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)] rounded-lg text-xs font-bold hover:bg-[rgb(34,142,222)]/20 transition-colors flex-1 sm:flex-none"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> Chat
                            </Link>
                            <button
                              onClick={() => handleRemove(conn._id)}
                              disabled={removingId === conn._id}
                              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                            >
                              {removingId === conn._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <>
                                  <UserMinus className="w-3.5 h-3.5" /> Remove
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
