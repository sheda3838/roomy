"use client";

import Link from "next/link";
import { User, Briefcase, GraduationCap } from "lucide-react";
import { SuggestedPerson } from "@/server/actions/getSuggestedPeople";
import UserAvatar from "@/components/shared/UserAvatar";

interface RoommateCardProps {
  person: SuggestedPerson;
}

export default function RoommateCard({ person }: RoommateCardProps) {
  const { user } = person;

  return (
    <Link
      href={`/people/${user._id}`}
      data-testid="user-card"
      className="group relative flex flex-col p-6 rounded-[28px] bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-[rgb(34,142,222)]/40 hover:shadow-[0_20px_50px_rgba(29,93,185,0.08)] transition-all duration-500 overflow-hidden hover:-translate-y-1.5"
    >
      {/* Subtle brand hover background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(46,219,244)]/0 to-[rgb(29,93,185)]/0 group-hover:from-[rgb(46,219,244)]/2 group-hover:to-[rgb(29,93,185)]/4 transition-all duration-500 rounded-[28px] pointer-events-none" />

      {/* Main card visual grid layout */}
      <div className="flex flex-col items-center text-center space-y-4 relative z-10 py-2">
        {/* Profile Avatar with double borders and hover scale */}
        <div className="relative w-24 h-24 rounded-full p-[3px] bg-slate-100 border border-slate-200/60 shadow-inner overflow-hidden shrink-0 group-hover:scale-[1.03] transition-transform duration-500">
          <div className="w-full h-full rounded-full overflow-hidden bg-white border border-slate-200/40 relative">
            <UserAvatar
              src={user.profilePicture}
              alt={user.fullName}
              className="w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        {/* User Info with premium typography */}
        <div className="space-y-1.5 w-full">
          <h3 className="font-sans text-lg font-bold tracking-tight text-slate-900 group-hover:text-[rgb(29,93,185)] transition-colors duration-300">
            {user.fullName}
          </h3>
          
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50/80 border border-slate-100 text-xs font-bold text-slate-500 capitalize">
              {user.roleType === "student" ? (
                <GraduationCap className="w-3.5 h-3.5 text-[rgb(34,142,222)]" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 text-[rgb(248,150,60)]" />
              )}
              {user.roleType || "Member"}
            </span>

            {user.gender && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50/80 border border-slate-100 text-xs font-bold text-slate-500 capitalize">
                {user.gender}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
