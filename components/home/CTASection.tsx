"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FadeUp } from "@/components/home/animations";

export default function CTASection() {
  return (
    <section className="py-28 px-6 lg:px-16 bg-zinc-900 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[rgb(46,219,244)] to-transparent opacity-10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <FadeUp delay={0}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-6 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> The Future of Shared Living
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-[-0.03em] mb-6">
            Ready to find your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)]">
              perfect match?
            </span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.22}>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands discovering a smarter, more human way to find a home.
          </p>
        </FadeUp>

        <FadeUp delay={0.32}>
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 px-10 py-4 text-[15px] font-bold shadow-2xl transition-all hover:scale-[1.04] active:scale-[0.98]"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </FadeUp>

      </div>
    </section>
  );
}
