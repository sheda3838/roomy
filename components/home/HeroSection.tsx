"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { HeroEntrance } from "@/components/home/animations";
import HeroVisualCompatibility from "@/components/home/HeroVisualCompatibility";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[calc(100vh-80px)] lg:max-h-[700px] xl:max-h-[760px] pt-20 pb-6 lg:pt-24 lg:pb-6 px-6 lg:px-16 bg-white overflow-hidden flex flex-col justify-center rounded-b-[40px] shadow-sm">

      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[rgb(34,142,222)]/10 to-transparent blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">

        {/* ── Left: Cinematic Copy ── */}
        <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left pt-2 lg:pt-0">

          {/* Badge */}
          <HeroEntrance delay={0.1} y={12}>
            <div className="inline-flex items-center gap-2 self-center lg:self-start mb-4 px-3.5 py-1.5 rounded-full bg-slate-50/80 backdrop-blur-md border border-slate-200/60 shadow-sm text-slate-700 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all hover:bg-white hover:shadow-md cursor-default">
              <Heart className="w-3 h-3 text-[rgb(29,93,185)]" />
              Lifestyle Compatibility
            </div>
          </HeroEntrance>

          {/* H1 */}
          <HeroEntrance delay={0.22} y={28}>
            <h1 className="font-sans font-bold tracking-tighter text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] xl:text-[64px] leading-[1.02] text-slate-900 mb-4">
              Find roommates that<br />
              actually{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] font-bold">
                match your lifestyle.
              </span>
            </h1>
          </HeroEntrance>

          {/* Subtitle */}
          <HeroEntrance delay={0.36} y={20}>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-[440px] self-center lg:self-start mb-6">
              Roomy goes beyond square footage and price. Our platform matches you with people and places based on lifestyle preferences, sleeping schedules, and co-living habits for stress-free shared living.
            </p>
          </HeroEntrance>

          {/* CTA Buttons */}
          <HeroEntrance delay={0.48} y={16}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/discover?tab=rooms"
                className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[rgb(29,93,185)]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Matches
              </Link>
              <Link
                href="/discover?tab=people"
                className="w-full sm:w-auto text-center rounded-full border border-slate-200/60 bg-white/70 backdrop-blur-md text-slate-700 font-bold px-7 py-3 hover:bg-white hover:border-[rgb(34,142,222)]/40 shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Browse People
              </Link>
            </div>
          </HeroEntrance>
        </div>

        {/* ── Right: Hero Visual ── */}
        <HeroEntrance className="order-1 lg:order-2" delay={0.3} y={24}>
          <HeroVisualCompatibility />
        </HeroEntrance>

      </div>
    </section>
  );
}
