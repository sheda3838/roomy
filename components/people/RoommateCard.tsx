"use client";

import Link from "next/link";
import { User, Sparkles, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { SuggestedPerson } from "@/server/actions/getSuggestedPeople";

interface RoommateCardProps {
  person: SuggestedPerson;
}

export default function RoommateCard({ person }: RoommateCardProps) {
  const { user } = person;

  return (
    <Link
      href={`/people/${user._id}/match`}
      className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-100 hover:border-[rgb(34,142,222)]/40 hover:shadow-xl hover:shadow-[rgb(34,142,222)]/10 transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(46,219,244)]/0 to-[rgb(29,93,185)]/0 group-hover:from-[rgb(46,219,244)]/3 group-hover:to-[rgb(29,93,185)]/5 transition-all duration-500 rounded-2xl pointer-events-none" />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(46,219,244)]/15 to-[rgb(29,93,185)]/20 border border-[rgb(34,142,222)]/20 overflow-hidden flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[rgb(34,142,222)]/50" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 group-hover:text-[rgb(29,93,185)] transition-colors">
              {user.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-slate-400 capitalize flex items-center gap-1">
                {user.roleType === 'student' ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                {user.roleType || 'Member'}
              </span>
              {user.gender && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-400 capitalize">{user.gender}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-auto relative z-10">
        {user.budgetMax && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-[rgb(250,192,140)]/20 text-sm shrink-0">💰</span>
            <span>Budget up to <span className="font-semibold text-[rgb(29,93,185)]">${user.budgetMax}</span></span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[rgb(34,142,222)] font-semibold group-hover:text-[rgb(29,93,185)] transition-colors">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Check Compatibility
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
