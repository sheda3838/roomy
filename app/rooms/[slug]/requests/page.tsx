import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoomRequest from "@/models/RoomRequest";
import Room from "@/models/Room";
import User from "@/models/User";
import Connection from "@/models/Connection";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Users } from "lucide-react";
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
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center p-4">
        <div className="text-center bg-white border border-slate-100 rounded-3xl p-8 shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Unauthorized</h1>
          <p className="text-slate-500 mb-6">You are not the owner of this room.</p>
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] text-white font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Return to Room
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all pending and accepted requests
  const requests = await RoomRequest.find({
    roomId: room._id,
    status: { $in: ["pending", "accepted"] },
  })
    .populate({
      path: "fromUserId",
      select: "fullName profilePicture roleType gender",
      model: User,
    })
    .sort({ createdAt: -1 })
    .lean();

  // Fetch connections for this room to map accepted requests to connectionIds
  const connections = await Connection.find({ roomId: room._id }).lean();
  const connectionMap: Record<string, string> = {};
  connections.forEach((conn: any) => {
    const partnerId = conn.users
      .map((u: any) => u.toString())
      .find((id: string) => id !== session.user.id);
    if (partnerId) {
      connectionMap[partnerId] = conn._id.toString();
    }
  });

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900 py-10 px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-80 h-80 bg-[rgb(46,219,244)] rounded-full opacity-[0.05] blur-[80px]" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[rgb(248,150,60)] rounded-full opacity-[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/rooms/${room.slug}`} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[rgb(29,93,185)] hover:border-[rgb(34,142,222)]/40 hover:shadow-sm transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900 leading-tight">Room Requests</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage join requests for <span className="font-semibold text-slate-600">{room.title}</span></p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity Status</p>
              <p className="font-bold text-slate-800 text-sm">Room Occupancy</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold tracking-tight text-[rgb(29,93,185)]">
              {room.occupantsCount}
            </span>
            <span className="text-slate-400 font-semibold text-sm"> / {room.capacity} Occupants</span>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">No requests yet</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">
              When users request to join your room, their profiles and messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any) => {
              const requester = req.fromUserId;
              if (!requester) return null;
              
              const isAccepted = req.status === "accepted";
              const connId = connectionMap[requester._id.toString()];

              return (
                <div
                  key={req._id.toString()}
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Status Indicator Stripe */}
                  {isAccepted && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600" />
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(46,219,244)]/20 to-[rgb(29,93,185)]/20 border border-[rgb(34,142,222)]/20 overflow-hidden flex items-center justify-center shrink-0">
                      {requester.profilePicture ? (
                        <img src={requester.profilePicture} alt={requester.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-[rgb(29,93,185)]">
                          {requester.fullName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{requester.fullName}</h3>
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle className="w-3 h-3" /> Accepted Flatmate
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-400 capitalize font-medium">
                        {[requester.gender, requester.roleType].filter(Boolean).join(" · ")}
                      </p>
                      
                      {req.message && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600 italic relative">
                          &ldquo;{req.message}&rdquo;
                        </div>
                      )}
                      
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-2.5">
                        Requested on {new Date(req.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 flex items-center justify-end">
                    <HandleRequestButtons
                      requestId={req._id.toString()}
                      initialStatus={req.status}
                      initialConnectionId={connId}
                      disabled={room.occupantsCount >= room.capacity && !isAccepted}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
