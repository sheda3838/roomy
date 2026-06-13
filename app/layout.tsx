import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingChatProvider from "@/components/chat/FloatingChatProvider";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import RoomyToastProvider from "@/components/global/RoomyToastProvider";
import "./globals.css";

import NextTopLoader from 'nextjs-toploader';

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Roomy",
  description: "Find your perfect roommate and flat match",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-[rgb(34,142,222)]/20 selection:text-[rgb(29,93,185)]">
        <NextTopLoader color="rgb(34,142,222)" showSpinner={false} shadow="0 0 10px rgb(34,142,222),0 0 5px rgb(34,142,222)" />
        <SessionProvider>
          <FloatingChatProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <FloatingChatWidget />
            <RoomyToastProvider />
          </FloatingChatProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
