"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Connection from "@/models/Connection";
import Room from "@/models/Room";
import User from "@/models/User";

export async function getConnections() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to view your connections." };
    }

    const userId = session.user.id;
    await dbConnect();

    // 1. Find all active connections where the user is a participant
    const connections = await Connection.find({
      users: userId,
      isActive: true,
    })
      .populate({
        path: "roomId",
        select: "title slug locationText images",
        model: Room,
      })
      .sort({ updatedAt: -1 })
      .lean();

    if (!connections || connections.length === 0) {
      return { success: true, connections: [] };
    }

    // 2. Map through connections and format the data, fetching the partner's details
    const formattedConnections = await Promise.all(
      connections.map(async (conn: any) => {
        // Find the partner's ID (the user in the array who is NOT the current user)
        const partnerId = conn.users.find((id: any) => id.toString() !== userId);
        
        let partner = null;
        if (partnerId) {
          partner = await User.findById(partnerId)
            .select("fullName profilePicture roleType gender")
            .lean();
        }

        return {
          _id: conn._id.toString(),
          roomId: conn.roomId?._id?.toString(),
          room: conn.roomId ? {
            title: conn.roomId.title,
            slug: conn.roomId.slug,
            locationText: conn.roomId.locationText,
            image: conn.roomId.images && conn.roomId.images.length > 0 ? conn.roomId.images[0] : null,
          } : null,
          partner: partner ? {
            _id: partner._id.toString(),
            fullName: partner.fullName,
            profilePicture: partner.profilePicture,
            roleType: partner.roleType,
          } : null,
          connectedAt: conn.connectedAt,
          updatedAt: conn.updatedAt,
        };
      })
    );

    return { 
      success: true, 
      connections: JSON.parse(JSON.stringify(formattedConnections)) 
    };
  } catch (error: any) {
    console.error("getConnections Server Action error:", error);
    return { error: "Failed to fetch connections." };
  }
}
