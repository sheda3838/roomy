import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoomRequest from "@/models/RoomRequest";
import Room from "@/models/Room";
import User from "@/models/User";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Users } from "lucide-react";
import HandleRequestButtons from "./HandleRequestButtons"; // Client component

export const metadata: Metadata = {
  title: "Room Requests | Roomy",
};

export const revalidate = 0; // Don't cache owner dashboard

export default async function RoomRequestsPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();
  
  const room = await Room.findOne({ slug: p.slug });
  if (!room) notFound();

  // Ensure user is the owner
  if (room.ownerId.toString() !== session.user.id) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Unauthorized</h1>
          <p className="text-zinc-400 mb-6">You are not the owner of this room.</p>
          <Link href={`/rooms/${room.slug}`} className="text-indigo-400 hover:underline">
            Return to Room
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all pending requests
  const requests = await RoomRequest.find({
    roomId: room._id,
    status: "pending",
  })
    .populate({
      path: "fromUserId",
      select: "fullName profilePicture roleType gender",
      model: User,
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/rooms/${room.slug}`} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Join Requests</h1>
            <p className="text-zinc-500 text-sm">For {room.title}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold">Capacity Status:</span>
          </div>
          <span className="text-zinc-300">
            {room.occupantsCount} / {room.capacity} Occupants
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-medium">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any) => (
              <div key={req._id.toString()} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                    {req.fromUserId.profilePicture ? (
                      <img src={req.fromUserId.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-900/50 text-indigo-400 font-bold">
                        {req.fromUserId.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{req.fromUserId.fullName}</h3>
                    <p className="text-sm text-zinc-400 capitalize">
                      {req.fromUserId.gender || 'Not specified'} • 
                      {req.fromUserId.roleType || 'No role specified'}
                    </p>
                    
                    {req.message && (
                      <div className="mt-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300 italic">
                        "{req.message}"
                      </div>
                    )}
                    
                    <p className="text-xs text-zinc-500 mt-2">
                      Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                  <HandleRequestButtons requestId={req._id.toString()} disabled={room.occupantsCount >= room.capacity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
