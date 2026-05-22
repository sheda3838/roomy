import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified: boolean;
    isOnboardingComplete: boolean;
    authProvider: "google" | "credentials";
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified: boolean;
      isOnboardingComplete: boolean;
      authProvider: "google" | "credentials";
    } & Omit<DefaultSession["user"], "emailVerified">;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: boolean;
    isOnboardingComplete: boolean;
    authProvider: "google" | "credentials";
  }
}
