"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher";
import {
  getChatConnections,
  getMessages,
  sendMessage as apiSendMessage,
  markAsRead as apiMarkAsRead,
  sendTypingStatus as apiSendTypingStatus,
} from "@/server/actions/chat";

export interface MessageType {
  _id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: "text" | "system";
  createdAt: string;
}

export interface ConnectionType {
  _id: string;
  roomId?: string;
  room?: {
    title: string;
    slug: string;
    locationText: string;
    image?: string | null;
  } | null;
  partner?: {
    _id: string;
    fullName: string;
    profilePicture?: string;
    roleType?: string;
  } | null;
  lastMessage?: {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  lastActiveTime: string;
}

interface FloatingChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  connections: ConnectionType[];
  activeConnectionId: string | null;
  setActiveConnectionId: (id: string | null) => void;
  messages: Record<string, MessageType[]>;
  partnerTyping: Record<string, boolean>;
  isLoadingConnections: boolean;
  isLoadingMessages: boolean;
  unreadTotal: number;
  openChat: (connectionId: string) => void;
  closeChat: () => void;
  sendMessage: (connectionId: string, content: string) => Promise<void>;
  markAsRead: (connectionId: string) => Promise<void>;
  sendTypingStatus: (connectionId: string, isTyping: boolean) => Promise<void>;
  refreshConnections: () => Promise<void>;
}

const FloatingChatContext = createContext<FloatingChatContextType | undefined>(undefined);

export function useFloatingChat() {
  const context = useContext(FloatingChatContext);
  if (!context) {
    throw new Error("useFloatingChat must be used within a FloatingChatProvider");
  }
  return context;
}

export default function FloatingChatProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, MessageType[]>>({});
  const [partnerTyping, setPartnerTyping] = useState<Record<string, boolean>>({});
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const activeConnectionIdRef = useRef<string | null>(null);
  const isOpenRef = useRef(false);
  const typingTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const subscribedChannelsRef = useRef<Set<string>>(new Set());

  // Keep refs up-to-date for Pusher callbacks
  useEffect(() => {
    activeConnectionIdRef.current = activeConnectionId;
  }, [activeConnectionId]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Sum of unread messages across all connections
  const unreadTotal = connections.reduce((sum, conn) => sum + conn.unreadCount, 0);

  // Fetch connections list
  const refreshConnections = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoadingConnections(true);
    try {
      const res = await getChatConnections();
      if (res.success && res.connections) {
        setConnections((prev) => {
          // Merge to avoid losing placeholders that might not be returned due to DB lag
          const newConns = [...res.connections];
          prev.forEach((pConn) => {
            if (!newConns.some((nc) => nc._id === pConn._id)) {
              newConns.push(pConn);
            } else if (pConn.partner) {
               // Ensure partner details aren't lost if the new one is missing it
               const idx = newConns.findIndex(nc => nc._id === pConn._id);
               if (!newConns[idx].partner) newConns[idx].partner = pConn.partner;
            }
          });
          return newConns.sort(
            (a, b) => new Date(b.lastActiveTime).getTime() - new Date(a.lastActiveTime).getTime()
          );
        });
      }
    } catch (err) {
      console.error("refreshConnections error:", err);
    } finally {
      setIsLoadingConnections(false);
    }
  }, [session?.user?.id]);

  // Load connection list on session load
  useEffect(() => {
    if (session?.user?.id) {
      refreshConnections();
    } else {
      setConnections([]);
      setActiveConnectionId(null);
      setMessages({});
      setPartnerTyping({});
    }
  }, [session?.user?.id, refreshConnections]);

  // Mark messages in a connection as read
  const markAsRead = useCallback(async (connectionId: string) => {
    if (!session?.user?.id) return;
    try {
      await apiMarkAsRead(connectionId);
      // Reset unread count locally
      setConnections((prev) =>
        prev.map((c) => (c._id === connectionId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, [session?.user?.id]);

  // Open a specific connection chat
  const openChat = useCallback((connectionId: string) => {
    setActiveConnectionId(connectionId);
    setIsOpen(true);
    markAsRead(connectionId);
  }, [markAsRead]);

  // Close or go back to list
  const closeChat = useCallback(() => {
    setActiveConnectionId(null);
  }, []);

  // Fetch messages history for a connection
  const loadMessages = useCallback(async (connectionId: string) => {
    // Only load if not already cached
    if (messages[connectionId]) return;
    
    setIsLoadingMessages(true);
    try {
      const res = await getMessages(connectionId);
      if (res.success && res.messages) {
        setMessages((prev) => ({ ...prev, [connectionId]: res.messages }));

        // Ensure partner details are stored in connections state
        if (res.partner) {
          setConnections((prev) => {
            const hasConnection = prev.some((c) => c._id === connectionId);
            if (hasConnection) {
              return prev.map((c) =>
                c._id === connectionId && !c.partner
                  ? { ...c, partner: res.partner }
                  : c
              );
            } else {
              // Create a placeholder connection so that ConversationView header renders details immediately
              const placeholderConn: ConnectionType = {
                _id: connectionId,
                partner: res.partner,
                unreadCount: 0,
                lastActiveTime: new Date().toISOString(),
              };
              return [placeholderConn, ...prev];
            }
          });
        }
      }
    } catch (err) {
      console.error("loadMessages error:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [messages]);

  // Trigger load when connection is opened
  useEffect(() => {
    if (activeConnectionId) {
      loadMessages(activeConnectionId);
      markAsRead(activeConnectionId);
    }
  }, [activeConnectionId, loadMessages, markAsRead]);

  // Send a message
  const sendMessage = useCallback(async (connectionId: string, content: string) => {
    if (!session?.user?.id || !content.trim()) return;

    const currentUserId = session.user.id;
    const conn = connections.find((c) => c._id === connectionId);
    const partnerId = conn?.partner?._id || "";

    // Generate optimistic message ID
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: MessageType = {
      _id: tempId,
      connectionId,
      senderId: currentUserId,
      receiverId: partnerId,
      content: content.trim(),
      messageType: "text",
      createdAt: new Date().toISOString(),
    };

    // Update messages locally (optimistic UI)
    setMessages((prev) => ({
      ...prev,
      [connectionId]: [...(prev[connectionId] || []), optimisticMsg],
    }));

    // Update connection's last message locally
    setConnections((prev) => {
      const updated = prev.map((c) =>
        c._id === connectionId
          ? {
              ...c,
              lastMessage: {
                _id: tempId,
                content: content.trim(),
                senderId: currentUserId,
                createdAt: optimisticMsg.createdAt,
              },
              lastActiveTime: optimisticMsg.createdAt,
            }
          : c
      );
      // Re-sort
      return updated.sort(
        (a, b) => new Date(b.lastActiveTime).getTime() - new Date(a.lastActiveTime).getTime()
      );
    });

    try {
      const res = await apiSendMessage(connectionId, content);
      if (res.success && res.message) {
        // Swap optimistic message with actual message from DB
        setMessages((prev) => {
          const list = prev[connectionId] || [];
          const hasTemp = list.some((m) => m._id === tempId);
          if (!hasTemp) {
            // Already swapped by Pusher. Ensure the real message is in list.
            const hasReal = list.some((m) => m._id === res.message._id);
            if (!hasReal) {
              return {
                ...prev,
                [connectionId]: [...list, res.message],
              };
            }
            return prev;
          }
          return {
            ...prev,
            [connectionId]: list.map((m) => (m._id === tempId ? res.message : m)),
          };
        });
        
        // Update connection details with actual DB message
        setConnections((prev) =>
          prev.map((c) =>
            c._id === connectionId
              ? {
                  ...c,
                  lastMessage: {
                    _id: res.message._id,
                    content: res.message.content,
                    senderId: res.message.senderId,
                    createdAt: res.message.createdAt,
                  },
                }
              : c
          )
        );
      } else {
        // Remove optimistic message on failure
        setMessages((prev) => ({
          ...prev,
          [connectionId]: (prev[connectionId] || []).filter((m) => m._id !== tempId),
        }));
        refreshConnections();
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      setMessages((prev) => ({
        ...prev,
        [connectionId]: (prev[connectionId] || []).filter((m) => m._id !== tempId),
      }));
    }
  }, [session?.user?.id, connections, refreshConnections]);

  // Send typing status to partner
  const sendTypingStatus = useCallback(async (connectionId: string, isTyping: boolean) => {
    try {
      await apiSendTypingStatus(connectionId, isTyping);
    } catch (err) {
      console.error("sendTypingStatus error:", err);
    }
  }, []);

  // Global user channel subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusherClient();
    const userId = session.user.id;
    const userChannelName = `user-${userId}`;
    let userChannel = pusher.channel(userChannelName);
    
    if (!userChannel) {
      userChannel = pusher.subscribe(userChannelName);
    }

    const handleConnectionCreated = () => {
      refreshConnections();
    };

    userChannel.bind("connection:created", handleConnectionCreated);

    return () => {
      userChannel?.unbind("connection:created", handleConnectionCreated);
    };
  }, [session?.user?.id, refreshConnections]);

  // Dynamic chat channel subscriptions
  useEffect(() => {
    if (!session?.user?.id) return;

    const pusher = getPusherClient();
    const userId = session.user.id;

    connections.forEach((conn) => {
      const chatChannelName = `private-chat-${conn._id}`;
      if (subscribedChannelsRef.current.has(chatChannelName)) return;

      subscribedChannelsRef.current.add(chatChannelName);
      const chatChannel = pusher.subscribe(chatChannelName);

      // Listen for new messages
      chatChannel.bind("message:new", (newMsg: MessageType) => {
        const activeId = activeConnectionIdRef.current;
        const panelOpen = isOpenRef.current;

        // Append message to cached conversation list
        setMessages((prev) => {
          const list = prev[newMsg.connectionId] || [];
          if (list.some((m) => m._id === newMsg._id)) return prev; // Prevent duplicate

          // Look for matching optimistic message to replace it
          const tempIndex = list.findIndex(
            (m) =>
              m._id.startsWith("temp-") &&
              m.content === newMsg.content &&
              m.senderId === newMsg.senderId
          );

          if (tempIndex !== -1) {
            const updatedList = [...list];
            updatedList[tempIndex] = newMsg;
            return { ...prev, [newMsg.connectionId]: updatedList };
          }
          return { ...prev, [newMsg.connectionId]: [...list, newMsg] };
        });

        // Update connection lastMessage and unread count
        setConnections((prev) => {
          const updated = prev.map((c) => {
            if (c._id === newMsg.connectionId) {
              const isCurrentActive = activeId === newMsg.connectionId && panelOpen;
              const isSentByMe = newMsg.senderId.toLowerCase() === userId.toLowerCase();
              
              return {
                ...c,
                lastMessage: {
                  _id: newMsg._id,
                  content: newMsg.content,
                  senderId: newMsg.senderId,
                  createdAt: newMsg.createdAt,
                },
                lastActiveTime: newMsg.createdAt,
                unreadCount: (isCurrentActive || isSentByMe) ? c.unreadCount : c.unreadCount + 1,
              };
            }
            return c;
          });

          return updated.sort(
            (a, b) => new Date(b.lastActiveTime).getTime() - new Date(a.lastActiveTime).getTime()
          );
        });

        if (activeId === newMsg.connectionId && panelOpen && newMsg.senderId !== userId) {
          apiMarkAsRead(newMsg.connectionId).catch((err) => console.error("Error marking read:", err));
        }

        setPartnerTyping((prev) => ({ ...prev, [newMsg.connectionId]: false }));
      });

      // Listen for typing events
      chatChannel.bind("client-typing", (data: { userId: string; isTyping: boolean }) => {
        if (data.userId === userId) return;

        setPartnerTyping((prev) => ({
          ...prev,
          [conn._id]: data.isTyping,
        }));

        if (typingTimers.current[conn._id]) {
          clearTimeout(typingTimers.current[conn._id]);
        }

        if (data.isTyping) {
          typingTimers.current[conn._id] = setTimeout(() => {
            setPartnerTyping((prev) => ({ ...prev, [conn._id]: false }));
          }, 3500);
        }
      });
    });

  }, [session?.user?.id, connections]);

  return (
    <FloatingChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        connections,
        activeConnectionId,
        setActiveConnectionId,
        messages,
        partnerTyping,
        isLoadingConnections,
        isLoadingMessages,
        unreadTotal,
        openChat,
        closeChat,
        sendMessage,
        markAsRead,
        sendTypingStatus,
        refreshConnections,
      }}
    >
      {children}
    </FloatingChatContext.Provider>
  );
}
