import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[rgb(243,244,237)] border-t border-zinc-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Roomy" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold font-serif text-zinc-900">Roomy</span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Compatibility-first shared living. Find rooms and roommates that truly match your lifestyle.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/discover" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">Discover</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">How it works</Link></li>
              <li><Link href="/#faq" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/#about" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-600 hover:text-[rgb(34,142,222)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Roomy. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[rgb(34,142,222)]" />
            <span className="text-xs text-zinc-500 font-medium">Compatibility-First Living</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
