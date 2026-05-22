"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Roomy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/rooms" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Find Rooms
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            How it works
          </Link>
          <Link href="/#about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
              <Link
                href="/create-room"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
              >
                Post a Room
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-6 shadow-xl">
          <div className="flex flex-col space-y-4">
            <Link
              href="/rooms"
              className="text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Rooms
            </Link>
            <Link
              href="/#how-it-works"
              className="text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/#about"
              className="text-base font-medium text-gray-900 hover:text-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <div className="my-4 h-px w-full bg-gray-100" />

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-base font-medium text-gray-900 hover:text-indigo-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-room"
                  className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3 text-base font-medium text-white shadow-md hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Post a Room
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-left text-base font-medium text-red-500 hover:text-red-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-base font-medium text-white shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
