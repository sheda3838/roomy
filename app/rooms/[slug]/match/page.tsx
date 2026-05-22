import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getRoomMatchDetails } from "@/server/actions/getRoomMatchDetails";
import MatchExperienceClient from "@/components/match/MatchExperienceClient";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoomRequest from "@/models/RoomRequest";

// Dynamic metadata based on room
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const data = await getRoomMatchDetails(p.slug);
  
  if (data.error || !data.room) {
    return { title: "Compatibility Engine | Roomy" };
  }

  return {
    title: `Compatibility Match for ${data.room.title} | Roomy`,
    description: `Check your compatibility match score for ${data.room.title} in ${data.room.locationText}.`,
  };
}

export const revalidate = 60;

export default async function MatchExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const p = await params;
  const data = await getRoomMatchDetails(p.slug);
  
  if (data.error || !data.room || !data.match) {
    notFound();
  }

  const { room, match } = data;

  // Connection State Checks
  await dbConnect();
  let ownerIdStr = "";
  if (typeof room.ownerId === "string") ownerIdStr = room.ownerId;
  else if (room.ownerId?._id) ownerIdStr = room.ownerId._id.toString();
  else if (room.ownerId?.toString) ownerIdStr = room.ownerId.toString();

  const isOwner = ownerIdStr === session.user.id;
  
  // Check if joined
  const occupantIds = room.occupantIds || [];
  const isJoined = occupantIds.some((id: any) => id.toString() === session.user.id);

  // Check pending request
  let hasPendingRequest = false;
  if (!isOwner && !isJoined) {
    const existingRequest = await RoomRequest.findOne({
      fromUserId: session.user.id,
      roomId: room._id,
      status: "pending",
    }).lean();
    hasPendingRequest = !!existingRequest;
  }

  const connectionState = {
    isOwner,
    isJoined,
    hasPendingRequest,
  };

  return (
    <MatchExperienceClient 
      room={room} 
      match={match} 
      connectionState={connectionState} 
    />
  );
}
