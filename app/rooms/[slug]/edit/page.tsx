import { auth } from "@/lib/auth";
import { getRoomBySlug } from "@/server/actions/getRoomBySlug";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import EditRoomForm from "./EditRoomForm";

export const metadata: Metadata = {
  title: "Edit Room | Roomy",
};

export default async function EditRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getRoomBySlug(p.slug);
  
  if (data.error || !data.room) {
    notFound();
  }

  const room = data.room;

  let ownerIdStr = "";
  if (typeof room.ownerId === "string") ownerIdStr = room.ownerId;
  else if (room.ownerId?._id) ownerIdStr = room.ownerId._id.toString();
  else if (room.ownerId?.toString) ownerIdStr = room.ownerId.toString();

  if (ownerIdStr !== session.user.id) {
    redirect(`/rooms/${room.slug}`); // unauthorized, just view it
  }

  return <EditRoomForm initialData={room} roomId={room._id?.toString() || room.id} />;
}
