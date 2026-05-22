import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight, User as UserIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getIncomingRoommateRequests } from "@/server/actions/getIncomingRoommateRequests";
import RequestActions from "./RequestActions";

export const metadata: Metadata = {
  title: "Requests | Roomy",
};

export const revalidate = 0;

export default async function RequestsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { requests, error } = await getIncomingRoommateRequests();

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="text-center bg-red-950/20 border border-red-900/50 p-6 rounded-2xl max-w-md w-full">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Connection Requests</h1>
            <p className="text-zinc-400">People who want to connect with you.</p>
          </div>
          <Link href="/people" className="hidden sm:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Find more people <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        {(!requests || requests.length === 0) ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No pending requests</h2>
            <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
              When someone sends you a roommate connection request, it will appear here.
            </p>
            <Link 
              href="/people"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
            >
              Discover People <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request: any) => {
              const requester = request.requesterId;
              if (!requester) return null; // Safe guard

              return (
                <div 
                  key={request._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
                >
                  <div className="flex items-start gap-4">
                    <Link href={`/people/${requester._id}/match`} className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                      {requester.profilePicture ? (
                        <img src={requester.profilePicture} alt={requester.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-zinc-500" />
                      )}
                    </Link>
                    <div>
                      <Link href={`/people/${requester._id}/match`} className="font-bold text-xl text-white hover:text-indigo-400 transition-colors">
                        {requester.fullName}
                      </Link>
                      {requester.roleType && (
                        <p className="text-sm text-zinc-500 capitalize mt-0.5">{requester.roleType}</p>
                      )}
                      {request.message && (
                        <div className="mt-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-zinc-300 text-sm italic">
                          "{request.message}"
                        </div>
                      )}
                    </div>
                  </div>

                  <RequestActions requestId={request._id} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
