import Link from "next/link";
import { Search, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28 lg:pt-32 lg:pb-40 border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
            Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">roommate</span> instantly.
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop scrolling endlessly. Our smart matching engine pairs you with flatmates who share your lifestyle, habits, and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rooms"
              className="w-full sm:w-auto rounded-full bg-gray-900 px-8 py-4 text-lg font-medium text-white shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Find Rooms
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-lg font-medium text-gray-900 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Post a Room
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-gray-600">Your perfect living situation is just three steps away.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Create Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us about your lifestyle, habits, and budget. The more honest you are, the better the matches.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-inner">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Find Matches</h3>
              <p className="text-gray-600 leading-relaxed">
                Our algorithm scores every room against your unique profile to show you the most compatible options first.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 shadow-inner">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Join Rooms</h3>
              <p className="text-gray-600 leading-relaxed">
                Send requests instantly. Once accepted, move in with peace of mind knowing you're a great fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Built for Modern Living</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Roomy was created because finding a place to live shouldn't be a gamble. We believe that compatibility matters more than just the rent price. By focusing on lifestyle alignment, we help prevent awkward living situations before they even happen.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}