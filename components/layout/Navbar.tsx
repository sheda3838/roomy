"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = status === "authenticated";

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl rounded-full transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60"
          : "bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg shadow-black/5"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img src="/logo.png" alt="Roomy" className="h-7 w-7 object-contain" />
          <span className="text-[17px] font-bold tracking-tight text-zinc-900 font-serif">Roomy</span>
        </Link>

        {/* Desktop Center Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link href="/" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <Link href="/discover" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
            Discover
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
              My Profile
            </Link>
          )}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Log out
              </button>
              <Link
                href="/create-room"
                className="rounded-full bg-zinc-900 hover:bg-zinc-700 px-5 py-2 text-[13px] font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                Post a Room
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-zinc-900 hover:bg-zinc-700 px-5 py-2 text-[13px] font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
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
        <div className="flex flex-col p-5 gap-4">
          <Link href="/" className="text-[15px] font-semibold text-zinc-900" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/discover" className="text-[15px] font-semibold text-zinc-900" onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-[15px] font-semibold text-zinc-900" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
          )}

          <div className="h-px bg-zinc-200/60" />

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

