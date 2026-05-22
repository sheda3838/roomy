import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toString().toLowerCase() });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password.toString(),
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          image: user.profilePicture,
          emailVerified: user.emailVerified,
          isOnboardingComplete: user.isOnboardingComplete,
          authProvider: user.authProvider,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    
    // Validate or create user profile on Google OAuth login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email, name, image } = user;
        if (!email) return false;

        try {
          await dbConnect();
          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            dbUser = await User.create({
              fullName: name || "",
              email: email,
              profilePicture: image || "",
              authProvider: "google",
              emailVerified: true, // OAuth is pre-verified
              isOnboardingComplete: false,
            });
          }

          // Save ID and status to User object so JWT callback captures it
          user.id = dbUser._id.toString();
          user.emailVerified = dbUser.emailVerified;
          user.isOnboardingComplete = dbUser.isOnboardingComplete;
          user.authProvider = dbUser.authProvider;
          return true;
        } catch (error) {
          console.error("Error inside Google signIn callback:", error);
          return false;
        }
      }

      if (account?.provider === "credentials") {
        return true;
      }

      return true;
    },

    async jwt(params) {
      // Execute base token mappings first
      let updatedToken = await authConfig.callbacks.jwt(params);

      // Refresh database states if an update request is sent
      if (params.trigger === "update") {
        try {
          await dbConnect();
          const dbUser = await User.findById(updatedToken.id);
          if (dbUser) {
            updatedToken.emailVerified = dbUser.emailVerified;
            updatedToken.isOnboardingComplete = dbUser.isOnboardingComplete;
          }
        } catch (error) {
          console.error("Error in dynamic Mongoose JWT callback:", error);
        }
      }

      return updatedToken;
    },
  },
});
