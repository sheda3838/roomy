import { Metadata } from "next";
import { redirect } from "next/navigation";
import { validateChatAccess, getMessages } from "@/server/actions/chat";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Chat | Roomy",
};

export const revalidate = 0; // Never cache the chat page

export default async function ChatPage({ params }: { params: Promise<{ connectionId: string }> }) {
  const p = await params;
  
  // 1. Validate access
  const access = await validateChatAccess(p.connectionId);
  if (access.error || !access.success || !access.userId) {
    // Redirect unauthorized users to dashboard or home
    redirect("/"); 
  }

  // 2. Fetch initial messages
  const messagesData = await getMessages(p.connectionId);
  const initialMessages = messagesData.success ? messagesData.messages : [];

  return (
    <ChatClient 
      connectionId={p.connectionId} 
      currentUserId={access.userId}
      partner={access.partner}
      initialMessages={initialMessages}
    />
  );
}
