import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingChatProvider from "@/components/chat/FloatingChatProvider";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import "./globals.css";

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
        <SessionProvider>
          <FloatingChatProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <FloatingChatWidget />
          </FloatingChatProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
