import Link from "next/link";
import CompatibilityVisual from "@/components/home/CompatibilityVisual";
import { ArrowRight, Sparkles, Users, Zap, MessageCircle, ShieldCheck, Home } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-[rgb(243,244,237)] text-zinc-900 overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 px-6 lg:px-16">

        {/* Subtle background glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[rgb(46,219,244)] rounded-full opacity-[0.07] blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[rgb(248,150,60)] rounded-full opacity-[0.07] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: Editorial Copy ── */}
          <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">

            {/* Label */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start mb-7 px-3.5 py-1.5 rounded-full border border-[rgb(34,142,222)]/25 bg-[rgb(34,142,222)]/8 text-[rgb(29,93,185)] text-xs font-bold tracking-[0.15em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Compatibility-First Living
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl leading-[0.92] tracking-[-0.03em] text-zinc-900 mb-6">
              Compatible<br />
              people.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)]">
                Better<br className="hidden lg:block" /> living.
              </span>
            </h1>

            {/* Subline */}
            <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-[480px] self-center lg:self-start mb-10">
              Roomy intelligently matches you with rooms and roommates that truly fit your lifestyle — not just your budget.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/discover?tab=rooms"
                className="w-full sm:w-auto text-center rounded-full bg-zinc-900 hover:bg-zinc-800 px-9 py-4 text-[15px] font-semibold text-white shadow-xl shadow-zinc-900/10 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Find Rooms
              </Link>
              <Link
                href="/discover?tab=people"
                className="w-full sm:w-auto text-center rounded-full bg-white/80 hover:bg-white backdrop-blur-sm px-9 py-4 text-[15px] font-semibold text-zinc-800 shadow-sm border border-zinc-200/80 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Find Roommates
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)]",
                  "bg-gradient-to-br from-[rgb(250,192,140)] to-[rgb(246,137,83)]",
                  "bg-gradient-to-br from-[rgb(239,62,43)] to-[rgb(248,150,60)]",
                  "bg-zinc-200",
                ].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[rgb(243,244,237)] flex items-center justify-center`}>
                    <Users className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-500 font-medium">
                <span className="font-bold text-zinc-800">2,400+</span> people matched this month
              </p>
            </div>
          </div>

          {/* ── Right: Compatibility Dashboard Visual ── */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <CompatibilityVisual />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════ */}
      <section id="about" className="py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(250,192,140)]/20 border border-[rgb(246,137,83)]/30 text-[rgb(239,62,43)] text-xs font-bold mb-6 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Beyond Listings
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-6 text-zinc-900">
              Not just a room.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(250,192,140)] to-[rgb(246,137,83)]">The right home.</span>
            </h2>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-[520px]">
              Roomy goes beyond square footage and price. Our engine analyses sleep schedules, cleanliness habits, social preferences, and over 20 lifestyle dimensions to recommend people and rooms you&apos;ll actually enjoy sharing life with.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: "Verified Compatibility", color: "text-[rgb(34,142,222)]", bg: "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)]/15" },
              { icon: Sparkles, label: "Lifestyle Matching", color: "text-[rgb(248,150,60)]", bg: "bg-[rgb(248,150,60)]/10 border-[rgb(248,150,60)]/20" },
              { icon: MessageCircle, label: "Real-time Chat", color: "text-[rgb(29,93,185)]", bg: "bg-[rgb(29,93,185)]/8 border-[rgb(29,93,185)]/15" },
              { icon: Users, label: "People + Rooms", color: "text-[rgb(239,62,43)]", bg: "bg-[rgb(239,62,43)]/8 border-[rgb(239,62,43)]/15" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`rounded-2xl border p-6 ${bg}`}>
                <Icon className={`w-7 h-7 ${color} mb-4`} />
                <p className="text-sm font-bold text-zinc-800">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-[rgb(243,244,237)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] text-xs font-bold mb-4 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> The Process
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-zinc-900">
              How Roomy works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Users,
                title: "Build your profile",
                desc: "Tell us your lifestyle — sleep habits, budget, cleanliness, and personality. It takes 3 minutes.",
                accent: "from-[rgb(46,219,244)] to-[rgb(29,93,185)]",
                bg: "bg-white",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Discover your matches",
                desc: "Our algorithm surfaces rooms and roommates ranked by genuine compatibility, not just proximity.",
                accent: "from-[rgb(250,192,140)] to-[rgb(246,137,83)]",
                bg: "bg-white",
              },
              {
                step: "03",
                icon: MessageCircle,
                title: "Connect and move in",
                desc: "Send a connection request. Chat securely. Arrange a viewing. Find your next home.",
                accent: "from-[rgb(239,62,43)] to-[rgb(248,150,60)]",
                bg: "bg-white",
              },
            ].map(({ step, icon: Icon, title, desc, accent, bg }) => (
              <div key={step} className={`${bg} rounded-3xl p-8 shadow-sm border border-zinc-100`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">{step}</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="py-28 px-6 lg:px-16 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[rgb(46,219,244)] to-transparent opacity-10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-6 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> The Future of Shared Living
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-[-0.03em] mb-6">
            Ready to find your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)]">perfect match?</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands discovering a smarter, more human way to find a home.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 px-10 py-4 text-[15px] font-bold shadow-2xl transition-all hover:scale-[1.04] active:scale-[0.98]"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section id="faq" className="py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-zinc-900 text-center mb-12 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "How does the compatibility algorithm work?", a: "We match based on 20+ lifestyle dimensions including sleep schedules, cleanliness, noise tolerance, social habits, and budget. The more you fill in your profile, the better your matches." },
              { q: "Can I post a room even if I'm already looking for a roommate?", a: "Absolutely. Roomy supports both sides. You can post a room listing, search for compatible roommates, or do both simultaneously." },
              { q: "Is Roomy free to use?", a: "Core discovery and matching is free. Premium features for advanced filtering and priority visibility are available for power users." },
              { q: "How do I start chatting with a match?", a: "Send a connection request from any profile or room card. Once accepted, you can chat directly in Roomy's built-in messaging system." },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-2xl border border-zinc-100 bg-[rgb(243,244,237)]/60 px-6 py-5 cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-zinc-900 text-[15px] list-none">
                  {q}
                  <span className="ml-4 shrink-0 text-zinc-400 group-open:rotate-45 transition-transform duration-200 text-xl font-light">+</span>
                </summary>
                <p className="mt-4 text-zinc-500 leading-relaxed text-[15px]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="bg-[rgb(243,244,237)] border-t border-zinc-200 py-12 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Roomy" className="h-7 w-7 object-contain" />
            <span className="text-xl font-bold font-serif text-zinc-900">Roomy</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <Link href="/discover" className="hover:text-zinc-900 transition-colors">Discover</Link>
            <Link href="/#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</Link>
            <Link href="/#faq" className="hover:text-zinc-900 transition-colors">FAQ</Link>
          </div>
          <p className="text-sm text-zinc-400">© 2026 Roomy. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}