"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NotificationBell from "@/components/layout/NotificationBell";


export default function Navbar() {
  const { status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    if (path === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/rooms") || pathname.startsWith("/people");
    if (path === "/dashboard") return pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/messages");
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = status === "authenticated";

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 py-1"
          : "bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm py-2"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img src="/logo.png" alt="Roomy" className="h-7 w-7 object-contain" />
          <span className="text-[17px] font-bold tracking-tight text-zinc-900 font-serif">Roomy</span>
        </Link>

        {/* Desktop Center Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            href="/" 
            className={`px-3 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
              isActive("/") 
                ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold shadow-sm" 
                : "text-zinc-500 font-semibold hover:text-zinc-900 hover:bg-zinc-100/80"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/discover" 
            className={`px-3 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
              isActive("/discover") 
                ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold shadow-sm" 
                : "text-zinc-500 font-semibold hover:text-zinc-900 hover:bg-zinc-100/80"
            }`}
          >
            Discover
          </Link>
          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              className={`px-3 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
                isActive("/dashboard") 
                  ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold shadow-sm" 
                  : "text-zinc-500 font-semibold hover:text-zinc-900 hover:bg-zinc-100/80"
              }`}
            >
              My Profile
            </Link>
          )}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Log out
              </button>
              <Link
                href="/create-room"
                className="rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-2.5 text-[13px] font-bold text-white transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:scale-[1.02]"
              >
                Post a Room
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-bold text-slate-600 hover:text-[rgb(29,93,185)] transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-[rgb(46,219,244)] to-[rgb(29,93,185)] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[rgb(29,93,185)]/20 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>


        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-zinc-800 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 rounded-3xl bg-white/95 backdrop-blur-3xl border border-zinc-200/60 shadow-2xl transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-5 gap-2">
          <Link 
            href="/" 
            className={`px-4 py-3 rounded-2xl text-[15px] transition-all duration-300 ${
              isActive("/") 
                ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold" 
                : "text-zinc-600 font-semibold hover:text-zinc-900 hover:bg-zinc-50"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/discover" 
            className={`px-4 py-3 rounded-2xl text-[15px] transition-all duration-300 ${
              isActive("/discover") 
                ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold" 
                : "text-zinc-600 font-semibold hover:text-zinc-900 hover:bg-zinc-50"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Discover
          </Link>
          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              className={`px-4 py-3 rounded-2xl text-[15px] transition-all duration-300 ${
                isActive("/dashboard") 
                  ? "text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 font-bold" 
                  : "text-zinc-600 font-semibold hover:text-zinc-900 hover:bg-zinc-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Profile
            </Link>
          )}

          <div className="h-px bg-zinc-200/60 my-2" />

          {isAuthenticated ? (
            <>
              <Link
                href="/create-room"
                className="flex items-center justify-center rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Post a Room
              </Link>
              <button
                onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                className="text-sm font-semibold text-red-500 text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-2xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

