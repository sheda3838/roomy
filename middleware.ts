import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Initialize Edge-safe auth middleware helper
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Route match conditions
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isVerifyEmailConfirmRoute = nextUrl.pathname === "/verify-email/confirm";
  const isVerifyEmailRoute = nextUrl.pathname === "/verify-email";
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // Publicly accessible pages that do not require active user session
  const publicRoutes = ["/", "/login", "/register", "/rooms"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // 1. Allow auth callbacks & token refresh routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Handling unauthenticated users
  if (!isLoggedIn) {
    // Prevent access to protected dashboards, onboarding, or verification states
    if (!isPublicRoute && !isVerifyEmailRoute && !isOnboardingRoute && !isVerifyEmailConfirmRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Handling authenticated users
  const emailVerified = req.auth?.user?.emailVerified;
  const isOnboardingComplete = req.auth?.user?.isOnboardingComplete;

  // Gate A: Email Verification check
  if (!emailVerified) {
    // Let users access the request or validation endpoints
    if (isVerifyEmailRoute || isVerifyEmailConfirmRoute) {
      return NextResponse.next();
    }
    // Redirect all other navigations to verification notice page
    return NextResponse.redirect(new URL("/verify-email", nextUrl));
  }

  // Gate B: Onboarding state check
  if (!isOnboardingComplete) {
    // Let verified users access onboarding form
    if (isOnboardingRoute) {
      return NextResponse.next();
    }
    // Redirect all other navigations to onboarding form page
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  // User is fully verified and onboarded:
  // Prevent access to utility pages (login, register, onboarding, verification confirmation)
  if (
    isOnboardingRoute || 
    isVerifyEmailRoute || 
    nextUrl.pathname === "/login" || 
    nextUrl.pathname === "/register"
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Ensure /create-room is protected (it falls through to here naturally,
  // but if we want to restrict it specifically from anything, we do it here.
  // Actually, unauthenticated users are already blocked at line 30 because it's not a public route.)

  return NextResponse.next();
});

// Match all route patterns except static files, public images, icons, and next internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
