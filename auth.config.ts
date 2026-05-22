import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Extract user info on login and populate JWT token.
    // Also handles client-side update() calls to patch safe fields without a DB round-trip.
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, populate token from the user object
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.isOnboardingComplete = user.isOnboardingComplete;
        token.authProvider = user.authProvider;
      }

      // When update() is called from the client, patch only safe fields.
      // This avoids a DB round-trip and keeps the JWT re-sign fast (~50ms).
      if (trigger === "update" && session) {
        if (typeof session.isOnboardingComplete === "boolean") {
          token.isOnboardingComplete = session.isOnboardingComplete;
        }
        if (typeof session.emailVerified === "boolean") {
          token.emailVerified = session.emailVerified;
        }
      }

      return token;
    },
    
    // Construct session details from the token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
        session.user.isOnboardingComplete = token.isOnboardingComplete as boolean;
        session.user.authProvider = token.authProvider as "google" | "credentials";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
