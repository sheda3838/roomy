"use client";

import { Home, ShieldCheck, Heart, MessageCircle, Users } from "lucide-react";
import { FadeUp, StaggerReveal, StaggerItem } from "@/components/home/animations";

const FEATURES = [
  { icon: ShieldCheck, label: "Verified Compatibility", color: "text-[rgb(34,142,222)]", bg: "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)]/15" },
  { icon: Heart, label: "Lifestyle Matching", color: "text-[rgb(248,150,60)]", bg: "bg-[rgb(248,150,60)]/10 border-[rgb(248,150,60)]/20" },
  { icon: MessageCircle, label: "Real-time Chat", color: "text-[rgb(29,93,185)]", bg: "bg-[rgb(29,93,185)]/8 border-[rgb(29,93,185)]/15" },
  { icon: Users, label: "People + Rooms", color: "text-[rgb(239,62,43)]", bg: "bg-[rgb(239,62,43)]/8 border-[rgb(239,62,43)]/15" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left copy */}
        <div>
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(250,192,140)]/20 border border-[rgb(246,137,83)]/30 text-[rgb(239,62,43)] text-xs font-bold mb-6 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Beyond Listings
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-6 text-zinc-900">
              Not just a room.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(250,192,140)] to-[rgb(246,137,83)]">
                The right home.
              </span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-zinc-500 leading-relaxed text-lg max-w-[520px]">
              Roomy goes beyond square footage and price. Our engine analyses sleep schedules, cleanliness habits, social preferences, and over 20 lifestyle dimensions to recommend people and rooms you'll actually enjoy sharing life with.
            </p>
          </FadeUp>
        </div>

        {/* Right feature grid */}
        <StaggerReveal className="grid grid-cols-2 gap-4" stagger={0.1} delay={0.1}>
          {FEATURES.map(({ icon: Icon, label, color, bg }) => (
            <StaggerItem key={label}>
              <div className={`rounded-2xl border p-6 ${bg} h-full`}>
                <Icon className={`w-7 h-7 ${color} mb-4`} />
                <p className="text-sm font-bold text-zinc-800">{label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

      </div>
    </section>
  );
}
