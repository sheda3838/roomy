"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/80 rounded-2xl px-4 py-2.5 w-fit shadow-sm">
      <span className="text-[11px] font-semibold text-slate-400 mr-0.5">Typing</span>
      <div className="w-1.5 h-1.5 rounded-full bg-[rgb(34,142,222)] animate-bounce [animation-duration:1s]" style={{ animationDelay: "0ms" }} />
      <div className="w-1.5 h-1.5 rounded-full bg-[rgb(34,142,222)] animate-bounce [animation-duration:1s]" style={{ animationDelay: "150ms" }} />
      <div className="w-1.5 h-1.5 rounded-full bg-[rgb(34,142,222)] animate-bounce [animation-duration:1s]" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
