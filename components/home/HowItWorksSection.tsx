"use client";

import { useState } from "react";
import { Users, Compass, MessageCircle, BarChart2 } from "lucide-react";
import { FadeUp, StaggerReveal, StaggerItem } from "@/components/home/animations";
import CompatibilityExplanationModal from "@/components/shared/CompatibilityExplanationModal";

const STEPS = [
  {
    step: "01",
    icon: Users,
    title: "Build your profile",
    desc: "Tell us your lifestyle — sleep habits, budget, cleanliness, and personality. It takes 3 minutes.",
    accent: "from-[rgb(46,219,244)] to-[rgb(29,93,185)]",
  },
  {
    step: "02",
    icon: Compass,
    title: "Discover your matches",
    desc: "Our algorithm surfaces rooms and roommates ranked by genuine compatibility, not just proximity.",
    accent: "from-[rgb(250,192,140)] to-[rgb(246,137,83)]",
  },
  {
    step: "03",
    icon: MessageCircle,
    title: "Connect and move in",
    desc: "Send a connection request. Chat securely. Arrange a viewing. Find your next home.",
    accent: "from-[rgb(239,62,43)] to-[rgb(248,150,60)]",
  },
];

export default function HowItWorksSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-[rgb(243,244,237)]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] text-xs font-bold mb-4 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> The Process
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-zinc-900">
              How Roomy Works?
            </h2>
          </FadeUp>
        </div>

        {/* Step cards */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.13} delay={0.05}>
          {STEPS.map(({ step, icon: Icon, title, desc, accent }) => (
            <StaggerItem key={step}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 h-full">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">{step}</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px]">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <FadeUp delay={0.2}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BarChart2 className="w-5 h-5" /> Understand Compatibility
            </button>
          </FadeUp>
        </div>

      </div>
      
      <CompatibilityExplanationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
