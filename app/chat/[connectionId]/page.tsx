import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ChatPage({ params }: { params: Promise<{ connectionId: string }> }) {
  const p = await params;
  redirect(`/?openChat=${p.connectionId}`);
}
