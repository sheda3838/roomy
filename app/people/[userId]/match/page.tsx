import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Connection from "@/models/Connection";
import RoommateRequest from "@/models/RoommateRequest";
import { calculatePeopleMatch } from "@/server/actions/calculatePeopleMatch";
import UserCompatibilityClient from "@/components/people/UserCompatibilityClient";

export const metadata: Metadata = {
  title: "Roommate Compatibility | Roomy",
  description: "Check your co-living compatibility score with potential roommates on Roomy.",
};

export default async function MatchPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUserId = session.user.id;
  const targetUserId = params.userId;

  // You cannot match with yourself
  if (currentUserId === targetUserId) {
    redirect("/discover?tab=people");
  }

  await dbConnect();

  // Fetch both users to compare
  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId).lean(),
    User.findById(targetUserId).lean(),
  ]);

  if (!currentUser || !targetUser) {
    notFound();
  }

  // Calculate Match details on the server side
  const matchResult = calculatePeopleMatch(currentUser, targetUser);

  // Check connection status
  const connection = await Connection.findOne({
    users: { $all: [currentUserId, targetUserId] },
    isActive: true,
  }).lean();
  const isConnected = !!connection;

  // Check pending request from current user to target
  const pendingRequest = await RoommateRequest.findOne({
    requesterId: currentUserId,
    receiverId: targetUserId,
    status: "pending",
  }).lean();
  const hasPendingRequest = !!pendingRequest;

  const connectionState = {
    isConnected,
    hasPendingRequest,
  };

  const matchData = {
    score: matchResult.score,
    label: matchResult.score >= 80 ? "Excellent Match" 
         : matchResult.score >= 60 ? "Strong Match" 
         : matchResult.score >= 45 ? "Moderate Match" : "Poor Match",
    reasons: matchResult.reasons,
    conflicts: matchResult.conflicts,
    facilityMatches: matchResult.facilityMatches,
  };

  return (
    <UserCompatibilityClient
      currentUser={JSON.parse(JSON.stringify(currentUser))}
      targetUser={JSON.parse(JSON.stringify(targetUser))}
      match={matchData}
      connectionState={connectionState}
    />
  );
}
