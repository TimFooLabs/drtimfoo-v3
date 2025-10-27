import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { Providers } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Professional Booking System - Enhanced Calendar Experience",
    template: "%s | Professional Booking System",
  },
  description:
    "Experience our enhanced booking system with intelligent calendar interface, real-time availability, and seamless appointment scheduling.",
  keywords: [
    "booking system",
    "appointment scheduling",
    "calendar interface",
    "professional services",
    "enhanced booking",
  ],
  authors: [{ name: "Professional Booking Team" }],
  creator: "Professional Booking Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Professional Booking System",
    title: "Professional Booking System - Enhanced Calendar Experience",
    description:
      "Experience our enhanced booking system with intelligent calendar interface, real-time availability, and seamless appointment scheduling.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Booking System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Booking System - Enhanced Calendar Experience",
    description:
      "Experience our enhanced booking system with intelligent calendar interface, real-time availability, and seamless appointment scheduling.",
    images: ["/og-image.jpg"],
    creator: "@professionalbooking",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SkipToContent />
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
