import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import dbConnect from "@/lib/db";
import Connection from "@/models/Connection";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let socketId = "";
    let channelName = "";

    try {
      const data = await req.formData();
      socketId = data.get("socket_id") as string;
      channelName = data.get("channel_name") as string;
    } catch {
      const body = await req.text();
      const params = new URLSearchParams(body);
      socketId = params.get("socket_id") as string;
      channelName = params.get("channel_name") as string;
    }

    console.log("[Pusher Auth Request]", { socketId, channelName, userId: session.user.id });

    if (!socketId || !channelName) {
      console.error("[Pusher Auth] Missing socketId or channelName");
      return new NextResponse("Missing socket_id or channel_name", { status: 400 });
    }

    // Verify channelName is a private chat channel
    if (channelName.startsWith("private-chat-")) {
      const connectionId = channelName.replace("private-chat-", "");
      
      await dbConnect();
      
      // Ensure the user is actually part of this connection
      const connection = await Connection.findOne({
        _id: connectionId,
        users: session.user.id,
        isActive: true,
      });

      if (!connection) {
        return new NextResponse("Forbidden: You do not have access to this chat.", { status: 403 });
      }

      // Authorize the channel
      const authResponse = pusherServer.authorizeChannel(socketId, channelName);
      return NextResponse.json(authResponse);
    }

    // Allow users to subscribe to their own personal notification channel
    if (channelName === `private-user-${session.user.id}`) {
      const authResponse = pusherServer.authorizeChannel(socketId, channelName);
      console.log("[Pusher Auth] Authorized personal channel", channelName);
      return NextResponse.json(authResponse);
    }

    // Block everything else
    console.error("[Pusher Auth] Forbidden. Mismatch between channel and userId:", { channelName, expected: `private-user-${session.user.id}` });
    return new NextResponse("Forbidden", { status: 403 });


  } catch (error: any) {
    console.error("Pusher auth error:", error);
    return new NextResponse(`Internal Server Error: ${error.message || String(error)}`, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const socketId = req.nextUrl.searchParams.get("socket_id") || "123.456";
    const channelName = req.nextUrl.searchParams.get("channel_name");

    if (!channelName) return new NextResponse("Missing channel_name", { status: 400 });

    const connectionId = channelName.replace("private-chat-", "");
    await dbConnect();
    const connection = await Connection.findOne({ _id: connectionId, users: session.user.id, isActive: true });
    
    if (!connection) return new NextResponse("Forbidden", { status: 403 });

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message || String(error)}`, { status: 500 });
  }
}
