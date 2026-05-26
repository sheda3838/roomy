import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Roomy" className="h-6 w-6 object-contain" />
              <span className="text-lg font-bold font-serif text-slate-900 tracking-tight">Roomy</span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/discover" className="text-sm font-medium text-slate-500 hover:text-[rgb(34,142,222)] transition-colors">
                Discover
              </Link>
              <Link href="/#faq" className="text-sm font-medium text-slate-500 hover:text-[rgb(34,142,222)] transition-colors">
                FAQ
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-slate-500 hover:text-[rgb(34,142,222)] transition-colors">
                How It Works
              </Link>
              <Link href="/#about" className="text-sm font-medium text-slate-500 hover:text-[rgb(34,142,222)] transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-all hover:scale-110 hover:border-[rgb(34,142,222)]/40 hover:bg-[rgb(34,142,222)]/5 hover:text-[rgb(34,142,222)] hover:shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span className="sr-only">WhatsApp</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-all hover:scale-110 hover:border-[rgb(34,142,222)]/40 hover:bg-[rgb(34,142,222)]/5 hover:text-[rgb(34,142,222)] hover:shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span className="sr-only">Instagram</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-all hover:scale-110 hover:border-[rgb(34,142,222)]/40 hover:bg-[rgb(34,142,222)]/5 hover:text-[rgb(34,142,222)] hover:shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                <span className="sr-only">Twitter/X</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-all hover:scale-110 hover:border-[rgb(34,142,222)]/40 hover:bg-[rgb(34,142,222)]/5 hover:text-[rgb(34,142,222)] hover:shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
                <span className="sr-only">Threads</span>
              </button>
            </div>
            
            <div className="hidden md:block h-4 w-px bg-slate-200/60" />
            
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} Roomy.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
