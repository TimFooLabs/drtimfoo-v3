"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/lib/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

function ConvexProviders({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  return (
    <ConvexProviderWithAuth
      client={convex}
      useAuth={() => ({
        isLoading: !isLoaded,
        isAuthenticated: isSignedIn ?? false,
        fetchAccessToken: async ({ forceRefreshToken: _forceRefreshToken }) => {
          return (await getToken()) || null;
        },
      })}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
        <Analytics />
      </ThemeProvider>
    </ConvexProviderWithAuth>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      signInForceRedirectUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      signUpForceRedirectUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
    >
      <ConvexProviders>{children}</ConvexProviders>
    </ClerkProvider>
  );
}
