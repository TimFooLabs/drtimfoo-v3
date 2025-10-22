# drtimfoo-v3 UI Delivery Plan (Production-Ready, AI-Assisted Solo Development)

## Tech Stack & Foundations

### Core Technologies
- **Framework**: Next.js 16 App Router with Server Components, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with minimal brand token overrides
- **UI Primitives**: shadcn@latest components (with brand customization layer)
- **Backend**: Convex for real-time data, mutations, and queries
- **Authentication**: Clerk OAuth-first with role-based access control
- **Tooling**: Bun for all package management and scripts
- **Testing**: Vitest (unit), Playwright (e2e), Storybook (component docs)
- **Quality**: ESLint, Biome, TypeScript strict, Husky + lint-staged
- **Dev Server**: Turbopack

### Initial Setup Tasks

1. **Project Scaffolding**
   ```bash
   bun create next-app . --ts --tailwind --app
   bun install
   ```

2. **Dependencies Installation**
   ```bash
   # Core
   bun add convex @clerk/nextjs
   bun add -d @types/node
   
   # UI & Styling
   bun add class-variance-authority clsx tailwind-merge
   bun add lucide-react @radix-ui/react-*
   
   # Forms & Validation
   bun add react-hook-form @hookform/resolvers zod
   
   # Testing
   bun add -d vitest @vitest/ui @testing-library/react @testing-library/jest-dom
   bun add -d playwright @playwright/test
   bun add -d @axe-core/playwright @axe-core/react
   
   # Storybook
   bun add -d storybook @storybook/nextjs @storybook/addon-a11y
   
   # Monitoring & Analytics
   bun add @sentry/nextjs
   bun add @vercel/analytics
   
   # Utilities
   bun add date-fns
   bun add pino pino-pretty
   bun add mdx-bundler gray-matter reading-time
   ```

3. **Configuration Files**

**`package.json` scripts:**
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && biome check .",
    "lint:fix": "next lint --fix && biome check --apply .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:content": "bun run scripts/validate-content.ts",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "prepare": "husky install",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy"
  }
}
```

**`tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/shared/*": ["./shared-modules/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/content/*": ["./content/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**`tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './shared-modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Minimal brand token overrides
      colors: {
        brand: {
          primary: 'hsl(var(--brand-primary))',
          secondary: 'hsl(var(--brand-secondary))',
          accent: 'hsl(var(--brand-accent))',
        },
        // Keep shadcn/ui semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config
```

**`src/styles/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Minimal brand tokens */
    --brand-primary: 220 90% 56%;
    --brand-secondary: 280 70% 60%;
    --brand-accent: 24 90% 60%;
    
    /* shadcn/ui defaults */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

**`.env.example`:**
```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# Contact Form (optional)
RESEND_API_KEY=
CONTACT_EMAIL_TO=
```

**`src/lib/env.ts` (Runtime validation):**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
})
```

**`next.config.js`:**
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://*.convex.cloud https://*.clerk.accounts.dev;
              frame-src 'self' https://*.clerk.accounts.dev;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
})
```

---

## Directory Structure

```
drtimfoo-v3/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   └── contact/
│   │   ├── (blog)/
│   │   │   ├── layout.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # Blog index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Blog post
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── testimonials/
│   │   │   │   └── bookings/
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts
│   │   │   ├── bookings/
│   │   │   │   └── route.ts
│   │   │   └── webhooks/
│   │   │       └── clerk/
│   │   ├── error.tsx                    # Root error boundary
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx                   # Root layout
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/                          # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── skip-to-content.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── features/
│   │       ├── hero/
│   │       ├── testimonials/
│   │       ├── services/
│   │       ├── booking/
│   │       └── contact-form/
│   ├── lib/
│   │   ├── convex/
│   │   │   ├── client.ts
│   │   │   ├── hooks.ts
│   │   │   └── server.ts
│   │   ├── clerk/
│   │   │   ├── auth.ts
│   │   │   └── middleware.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── validation.ts
│   │   ├── logger.ts
│   │   ├── env.ts
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   └── middleware.ts
├── shared-modules/
│   ├── components/
│   │   ├── booking-widget/
│   │   ├── analytics/
│   │   └── admin-ui/
│   └── lib/
│       ├── convex/
│       ├── validation/
│       └── utilities/
├── content/
│   ├── blog/
│   │   ├── post-1.mdx
│   │   └── post-2.mdx
│   ├── pages/
│   │   ├── about.mdx
│   │   └── services.mdx
│   └── config/
│       ├── site.ts
│       └── navigation.ts
├── convex/
│   ├── schema.ts
│   ├── bookings.ts
│   ├── testimonials.ts
│   ├── users.ts
│   └── _generated/
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   │   ├── booking.spec.ts
│   │   ├── contact.spec.ts
│   │   └── accessibility.spec.ts
│   └── helpers/
├── docs/
│   ├── architecture.md
│   ├── components.md
│   ├── testing.md
│   ├── deployment.md
│   ├── security.md
│   └── content-guide.md
├── scripts/
│   ├── validate-content.ts
│   └── generate-sitemap.ts
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── theme.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── preview.yml
│       └── production.yml
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── package.json
├── bun.lockb
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── .env.example
├── .env.local
├── .eslintrc.json
├── biome.json
├── sentry.client.config.ts
├── sentry.server.config.ts
└── README.md
```

---

## Design System & Component Library

### shadcn/ui Component Generation

```bash
# Install shadcn/ui CLI
bunx shadcn@latest init

# Generate base components
bunx shadcn@latest add button
bunx shadcn@latest add input
bunx shadcn@latest add card
bunx shadcn@latest add dialog
bunx shadcn@latest add tabs
bunx shadcn@latest add toast
bunx shadcn@latest add form
bunx shadcn@latest add label
bunx shadcn@latest add select
bunx shadcn@latest add textarea
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add navigation-menu
bunx shadcn@latest add sheet
bunx shadcn@latest add skeleton
bunx shadcn@latest add alert
bunx shadcn@latest add badge
bunx shadcn@latest add separator
bunx shadcn@latest add avatar
bunx shadcn@latest add calendar
bunx shadcn@latest add popover
bunx shadcn@latest add table
```

### Layout Components

**`src/app/providers.tsx`:**
```typescript
'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import { Analytics } from '@vercel/analytics/react'

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </ConvexProvider>
    </ClerkProvider>
  )
}
```

**`src/app/layout.tsx`:**
```typescript
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'App Name - Tagline',
    template: '%s | App Name',
  },
  description: 'Your app description for SEO',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'App Name',
    title: 'App Name - Tagline',
    description: 'Your app description for SEO',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'App Name',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Name - Tagline',
    description: 'Your app description for SEO',
    images: ['/og-image.jpg'],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**`src/components/layout/skip-to-content.tsx`:**
```typescript
export function SkipToContent() {
  return (
    
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  )
}
```

**`src/components/layout/header.tsx`:**
```typescript
import Link from 'next/link'
import { Navigation } from './navigation'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Logo</span>
          </Link>
          <Navigation className="hidden md:flex" />
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
          <MobileNav className="md:hidden" />
        </div>
      </div>
    </header>
  )
}
```

**`src/components/layout/footer.tsx`:**
```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          {/* Add more sections */}
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

### Error Boundaries

**`src/app/error.tsx`:**
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Route error:', { error, digest: error.digest })
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        We've been notified and are working on a fix.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

**`src/app/global-error.tsx`:**
```typescript
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  )
}
```

### Storybook Configuration

**`.storybook/main.ts`:**
```typescript
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
}

export default config
```

**`.storybook/preview.ts`:**
```typescript
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      dark: { ...themes.dark },
      light: { ...themes.normal },
      stylePreview: true,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'duplicate-id',
            enabled: true,
          },
        ],
      },
    },
  },
}

export default preview
```

---

## Content Management & SEO

### Content Configuration

**`content/config/site.ts`:**
```typescript
export const siteConfig = {
  name: 'Your App Name',
  description: 'Your app description for SEO',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/youraccount',
    github: 'https://github.com/youraccount',
  },
  creator: {
    name: 'Your Name',
    email: 'your@email.com',
  },
}

export const navigationConfig = {
  main: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Services', href: '/services' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ],
  footer: [
    {
      title: 'Company',
      items: [
        { title: 'About', href: '/about' },
        { title: 'Services', href: '/services' },
        { title: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
      ],
    },
  ],
}
```

### MDX Content Processing

**`src/lib/mdx.ts`:**
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'
import { z } from 'zod'

const contentDirectory = path.join(process.cwd(), 'content')

const blogPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  published: z.boolean().default(true),
})

export type BlogPost = z.infer<typeof blogPostSchema> & {
  slug: string
  readingTime: string
  content: string
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(contentDirectory, 'blog', `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')
  
  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: contentDirectory,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? [])]
      options.rehypePlugins = [...(options.rehypePlugins ?? [])]
      return options
    },
  })

  const validated = blogPostSchema.parse(frontmatter)
  const stats = readingTime(source)

  return {
    ...validated,
    slug,
    content: code,
    readingTime: stats.text,
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(contentDirectory, 'blog')
  const files = fs.readdirSync(blogDir)

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        return getPostBySlug(slug)
      })
  )

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

### Content Validation Script

**`scripts/validate-content.ts`:**
```typescript
#!/usr/bin/env bun

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const contentDir = path.join(process.cwd(), 'content', 'blog')

const frontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  published: z.boolean().default(true),
})

let errors = 0

const files = fs.readdirSync(contentDir)

for (const file of files) {
  if (!file.endsWith('.mdx')) continue

  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(content)

  try {
    frontmatterSchema.parse(data)
    console.log(`✓ ${file}`)
  } catch (error) {
    console.error(`✗ ${file}:`, error)
    errors++
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s) found`)
  process.exit(1)
} else {
  console.log('\n✓ All content validated successfully')
  process.exit(0)
}
```

### Image Optimization

**`src/components/optimized-image.tsx`:**
```typescript
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      className={cn('object-cover', className)}
      sizes={
        fill
          ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          : undefined
      }
    />
  )
}
```

---

## Convex Backend Setup

### Schema Definition

**`convex/schema.ts`:**
```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal('user'), v.literal('admin')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  bookings: defineTable({
    userId: v.id('users'),
    serviceType: v.string(),
    date: v.number(),
    time: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('cancelled'),
      v.literal('completed')
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_date', ['date'])
    .index('by_status', ['status']),

  testimonials: defineTable({
    userId: v.id('users'),
    name: v.string(),
    role: v.optional(v.string()),
    content: v.string(),
    rating: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_featured', ['featured'])
    .index('by_user', ['userId']),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
    createdAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_created_at', ['createdAt']),
})
```

### Convex Mutations & Queries

**`convex/bookings.ts`:**
```typescript
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

export const create = mutation({
  args: {
    userId: v.id('users'),
    serviceType: v.string(),
    date: v.number(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    const bookingId = await ctx.db.insert('bookings', {
      ...args,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })

    return bookingId
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect()
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('bookings'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('cancelled'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    })
  },
})

export const getUpcoming = query({
  handler: async (ctx) => {
    const now = Date.now()
    
    return await ctx.db
      .query('bookings')
      .withIndex('by_date')
      .filter((q) => q.and(
        q.gte(q.field('date'), now),
        q.neq(q.field('status'), 'cancelled')
      ))
      .order('asc')
      .take(10)
  },
})
```

**`convex/testimonials.ts`:**
```typescript
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    role: v.optional(v.string()),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    return await ctx.db.insert('testimonials', {
      ...args,
      status: 'pending',
      featured: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const getApproved = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('testimonials')
      .withIndex('by_status', (q) => q.eq('status', 'approved'))
      .order('desc')
      .collect()
  },
})

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('testimonials')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .filter((q) => q.eq(q.field('status'), 'approved'))
      .take(6)
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('testimonials'),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    })
  },
})

export const toggleFeatured = mutation({
  args: { id: v.id('testimonials') },
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id)
    
    if (!testimonial) throw new Error('Testimonial not found')
    
    await ctx.db.patch(args.id, {
      featured: !testimonial.featured,
      updatedAt: Date.now(),
    })
  },
})
```

**`convex/users.ts`:**
```typescript
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createOrUpdate = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first()

    const now = Date.now()

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        updatedAt: now,
      })
      return existingUser._id
    }

    return await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first()
  },
})

export const isAdmin = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first()

    return user?.role === 'admin'
  },
})
```

### Convex Client Helpers

**`src/lib/convex/client.ts`:**
```typescript
'use client'

import { useConvex, useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

// Booking hooks
export function useCreateBooking() {
  return useMutation(api.bookings.create)
}

export function useUserBookings(userId: Id<'users'> | undefined) {
  return useQuery(
    api.bookings.getByUser,
    userId ? { userId } : 'skip'
  )
}

export function useUpcomingBookings() {
  return useQuery(api.bookings.getUpcoming)
}

// Testimonial hooks
export function useCreateTestimonial() {
  return useMutation(api.testimonials.create)
}

export function useFeaturedTestimonials() {
  return useQuery(api.testimonials.getFeatured)
}

export function useApprovedTestimonials() {
  return useQuery(api.testimonials.getApproved)
}

// User hooks
export function useCurrentUser(clerkId: string | undefined) {
  return useQuery(
    api.users.getByClerkId,
    clerkId ? { clerkId } : 'skip'
  )
}

export function useIsAdmin(clerkId: string | undefined) {
  return useQuery(
    api.users.isAdmin,
    clerkId ? { clerkId } : 'skip'
  )
}
```

**`src/lib/convex/server.ts`:**
```typescript
import { auth } from '@clerk/nextjs'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { env } from '../env'

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function getServerUser() {
  const { userId } = auth()
  
  if (!userId) return null

  return await client.query(api.users.getByClerkId, { clerkId: userId })
}

export async function requireServerUser() {
  const user = await getServerUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function requireAdmin() {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isAdmin = await client.query(api.users.isAdmin, { clerkId: userId })
  
  if (!isAdmin) {
    throw new Error('Forbidden: Admin access required')
  }
  
  return userId
}
```

---

## Authentication & Middleware

### Clerk Integration

**`src/middleware.ts`:**
```typescript
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/about',
    '/services',
    '/blog(.*)',
    '/contact',
    '/api/webhooks(.*)',
  ],
  ignoredRoutes: [
    '/api/health',
  ],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### Clerk Webhook Handler

**`src/app/api/webhooks/clerk/route.ts`:**
```typescript
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../convex/_generated/api'
import { env } from '@/lib/env'

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    await client.mutation(api.users.createOrUpdate, {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim() || undefined,
    })
  }

  return new Response('Webhook processed', { status: 200 })
}
```

---

## Feature Components

### Booking Flow

**`src/components/features/booking/booking-form.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useCreateBooking, useCurrentUser } from '@/lib/convex/client'
import { useUser } from '@clerk/nextjs'

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Please select a service'),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

const services = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'service-a', label: 'Service A' },
  { value: 'service-b', label: 'Service B' },
]

export function BookingForm() {
  const { user: clerkUser } = useUser()
  const convexUser = useCurrentUser(clerkUser?.id)
  const createBooking = useCreateBooking()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  async function onSubmit(data: BookingFormData) {
    if (!convexUser) {
      toast({
        title: 'Error',
        description: 'Please sign in to book an appointment',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createBooking({
        userId: convexUser._id,
        serviceType: data.serviceType,
        date: data.date.getTime(),
        time: data.time,
        notes: data.notes,
      })

      toast({
        title: 'Success!',
        description: 'Your booking has been submitted',
      })

      form.reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or questions?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Book Appointment'}
        </Button>
      </form>
    </Form>
  )
}
```

### Contact Form with Rate Limiting

**`src/app/api/contact/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

// Initialize rate limiter (10 requests per 10 minutes per IP)
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '10 m'),
      analytics: true,
    })
  : null

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
})

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    if (ratelimit) {
      const ip = req.ip ?? '127.0.0.1'
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        )
      }
    }

    const body = await req.json()
    const data = contactSchema.parse(body)

    // Store in Convex
    await client.mutation(api.contacts.create, {
      ...data,
      createdAt: Date.now(),
      status: 'new',
    })

    // Optional: Send email notification
    // await sendEmailNotification(data)

    logger.info('Contact form submitted', { email: data.email })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**`convex/contacts.ts`:**
```typescript
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('contacts', args)
  },
})

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('contacts')
      .withIndex('by_created_at')
      .order('desc')
      .collect()
  },
})

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contacts')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .order('desc')
      .collect()
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('contacts'),
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    })
  },
})
```

**`src/components/features/contact/contact-form.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      toast({
        title: 'Message sent!',
        description: "We'll get back to you as soon as possible.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="How can we help?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
```

### Testimonials Display

**`src/components/features/testimonials/testimonials-section.tsx`:**
```typescript
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFeaturedTestimonials } from '@/lib/convex/client'
import { Skeleton } from '@/components/ui/skeleton'

export function TestimonialsSection() {
  const testimonials = useFeaturedTestimonials()

  if (testimonials === undefined) {
    return <TestimonialsSkeleton />
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex mb-4" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSkeleton() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## Admin Dashboard

**`src/app/(admin)/admin/layout.tsx`:**
```typescript
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { requireAdmin } from '@/lib/convex/server'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch {
    redirect('/sign-in')
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="bookings" className="mb-8">
        <TabsList>
          <TabsTrigger value="bookings" asChild>
            <Link href="/admin/bookings">Bookings</Link>
          </TabsTrigger>
          <TabsTrigger value="testimonials" asChild>
            <Link href="/admin/testimonials">Testimonials</Link>
          </TabsTrigger>
          <TabsTrigger value="contacts" asChild>
            <Link href="/admin/contacts">Contacts</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
```

**`src/app/(admin)/admin/testimonials/page.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminTestimonialsPage() {
  const testimonials = useQuery(api.testimonials.getAll)
  const updateStatus = useMutation(api.testimonials.updateStatus)
  const toggleFeatured = useMutation(api.testimonials.toggleFeatured)
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleStatusChange(
    id: Id<'testimonials'>,
    status: 'approved' | 'rejected'
  ) {
    setLoading(id)
    try {
      await updateStatus({ id, status })
      toast({
        title: 'Status updated',
        description: `Testimonial ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  async function handleToggleFeatured(id: Id<'testimonials'>) {
    setLoading(id)
    try {
      await toggleFeatured({ id })
      toast({
        title: 'Featured status updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  if (testimonials === undefined) {
    return <TableSkeleton />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Testimonials</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial._id}>
              <TableCell>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{testimonial.rating}/5</TableCell>
              <TableCell className="max-w-md truncate">
                {testimonial.content}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    testimonial.status === 'approved'
                      ? 'default'
                      : testimonial.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {testimonial.status}
                </Badge>
              </TableCell>
              <TableCell>
                {testimonial.featured ? (
                  <Badge>Featured</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {testimonial.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(testimonial._id, 'approved')
                        }
                        disabled={loading === testimonial._id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusChange(testimonial._id, 'rejected')
                        }
                        disabled={loading === testimonial._id}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {testimonial.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(testimonial._id)}
                      disabled={loading === testimonial._id}
                    >
                      {testimonial.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
```

**`convex/testimonials.ts` (add query):**
```typescript
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('testimonials')
      .order('desc')
      .collect()
  },
})
```

---

## Logging & Monitoring

**`src/lib/logger.ts`:**
```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  browser: {
    asObject: true,
  },
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
})
```

**`sentry.client.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  environment: process.env.NODE_ENV,
})
```

**`sentry.server.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  environment: process.env.NODE_ENV,
})
```

---

## Testing Configuration

**`vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/convex/_generated/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**`tests/setup.ts`:**
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**`playwright.config.ts`:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**`tests/e2e/booking.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete booking flow', async ({ page }) => {
    // Navigate to booking
    await page.getByRole('link', { name: /book/i }).click()
    await expect(page).toHaveURL(/.*booking/)

    // Fill form
    await page.getByLabel(/service/i).selectOption('consultation')
    
    // Select date (next week)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    await page.getByRole('button', { name: nextWeek.getDate().toString() }).click()

    await page.getByLabel(/time/i).selectOption('10:00')
    await page.getByLabel(/notes/i).fill('Test booking notes')

    // Submit
    await page.getByRole('button', { name: /book appointment/i }).click()

    // Verify success
    await expect(page.getByText(/booking has been submitted/i)).toBeVisible()
  })

  test('should validate form fields', async ({ page }) => {
    await page.goto('/booking')

    // Try to submit empty form
    await page.getByRole('button', { name: /book appointment/i }).click()

    // Check for validation messages
    await expect(page.getByText(/please select a service/i)).toBeVisible()
  })

  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/booking')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

**`tests/e2e/accessibility.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = [
  '/',
  '/about',
  '/services',
  '/blog',
  '/contact',
]

test.describe('Accessibility', () => {
  for (const route of routes) {
    test(`${route} should meet WCAG 2.2 AA standards`, async ({ page }) => {
      await page.goto(route)

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test(`${route} should be keyboard navigable`, async ({ page }) => {
      await page.goto(route)

      // Tab through all interactive elements
      const interactiveElements = await page.locator('a, button, input, textarea, select').count()
      
      for (let i = 0; i < interactiveElements; i++) {
        await page.keyboard.press('Tab')
        const focused = await page.evaluate(() => document.activeElement?.tagName)
        expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focused)
      }
    })
  }

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    const focusedElement = await page.locator(':focus')
    
    // Check that focused element has visible outline
    const outlineWidth = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth
    )
    expect(outlineWidth).not.toBe('0px')
  })

  test('should support prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Verify animations are disabled
    const animationDuration = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body)
      return style.animationDuration
    })
    
    expect(animationDuration).toBe('0.01ms')
  })
})
```

---

## CI/CD Pipeline

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  BUN_VERSION: '1.0.0'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run ESLint
        run: bun run lint
      
      - name: Run TypeScript check
        run: bun run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run unit tests
        run: bun run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Install Playwright browsers
        run: bunx playwright install --with-deps
      
      - name: Run E2E tests
        run: bun run test:e2e
        env:
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL_TEST }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY_TEST }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY_TEST }}
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  content-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Validate content
        run: bun run test:content

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Build application
        run: bun run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.APP_URL_STAGING }}
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL_STAGING }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY_STAGING }}
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/about
            http://localhost:3000/services
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**`.github/workflows/preview.yml`:**
```yaml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

env:
  BUN_VERSION: '1.0.0'

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Build
        run: bun run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.PREVIEW_URL }}
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL_PREVIEW }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY_PREVIEW }}
      
      - name: Deploy to Coolify
        run: |
          # Add Coolify deployment script here
          echo "Deploying to preview environment"
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL_PREVIEW }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY_PREVIEW }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY_PREVIEW }}
```

**`.github/workflows/production.yml`:**
```yaml
name: Production Deployment

on:
  push:
    branches: [main]

env:
  BUN_VERSION: '1.0.0'

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ env.BUN_VERSION }}
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run tests
        run: bun run test
      
      - name: Build
        run: bun run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.PRODUCTION_URL }}
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL_PRODUCTION }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY_PRODUCTION }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY_PRODUCTION }}
          NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Deploy to Coolify
        run: |
          # Add Coolify deployment script here
          echo "Deploying to production environment"
        env:
          COOLIFY_API_TOKEN: ${{ secrets.COOLIFY_API_TOKEN }}
      
      - name: Deploy Convex
        run: bun run convex:deploy
        env:
          CONVEX_DEPLOYMENT: ${{ secrets.CONVEX_DEPLOYMENT_PRODUCTION }}
      
      - name: Notify deployment
        run: |
          # Add notification logic (Slack, Discord, etc.)
          echo "Production deployment completed"
```

---

## Development Workflow

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd drtimfoo-v3
   bun install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Next.js dev server
   bun run dev
   
   # Terminal 2: Convex dev server
   bun run convex:dev
   ```

4. **Start Storybook (Optional)**
   ```bash
   bun run storybook
   ```

### Git Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: Feature branches
   - `hotfix/*`: Critical fixes

2. **Commit Convention**
   ```bash
   # Format: <type>(<scope>): <description>
   feat: add booking form
   fix: resolve navigation issue
   docs: update API documentation
   test: add unit tests for components
   refactor: optimize database queries
   ```

3. **Pre-commit Hooks**
   ```bash
   # .husky/pre-commit
   bun run lint:fix
   bun run typecheck
   bun run test
   ```

### Code Quality Gates

1. **Before Merge**
   - All tests pass
   - 80%+ code coverage
   - No linting errors
   - TypeScript strict mode passes
   - Accessibility tests pass
   - Performance budgets met

2. **Before Production**
   - Full E2E test suite passes
   - Security audit passes
   - Performance audit (Lighthouse score > 90)
   - Manual QA approval

---

## Performance Optimization

### Core Web Vitals Monitoring

**`src/components/performance-monitor.tsx`:**
```typescript
'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function PerformanceMonitor() {
  useEffect(() => {
    function sendToAnalytics(metric: any) {
      // Send to your analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Vercel Analytics
        // analytics.track('web-vital', metric)
      }
    }

    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  }, [])

  return null
}
```

### Image Optimization Strategy

1. **Next.js Image Component Usage**
   - All images use `next/image`
   - Proper `srcset` generation
   - Lazy loading by default
   - WebP/AVIF format support

2. **Image Asset Pipeline**
   ```bash
   # Optimize images before adding to project
   bunx sharp input.jpg --output public/images/optimized.webp
   ```

### Bundle Optimization

**`next.config.js` (Additional optimizations):**
```javascript
const nextConfig = {
  // ... existing config
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }
    
    return config
  },
  
  // Compression
  compress: true,
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}
```

---

## Security Implementation

### Content Security Policy

**`src/lib/csp.ts`:**
```typescript
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      "https://cdn.jsdelivr.net",
      "https://js.stripe.com",
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: [
      "'self'",
      "https://*.convex.cloud",
      "https://*.clerk.accounts.dev",
      "https://api.stripe.com",
    ],
    frameSrc: ["'self'", "https://*.clerk.accounts.dev"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: [],
  },
}
```

### Input Validation & Sanitization

**`src/lib/validation.ts`:**
```typescript
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
  })
}

// Validate user input
export const userContentSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeHtml),
  message: z.string().min(1).max(1000).transform(sanitizeHtml),
})
```

### Rate Limiting Implementation

**`src/lib/rate-limit.ts`:**
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const rateLimiters = {
  // API rate limiting
  api: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1m'),
    analytics: true,
  }),
  
  // Contact form rate limiting
  contact: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '10m'),
    analytics: true,
  }),
  
  // Authentication rate limiting
  auth: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '15m'),
    analytics: true,
  }),
}
```

---

## Documentation Strategy

### API Documentation

**`docs/api.md`:**
```markdown
# API Documentation

## Authentication
All API endpoints require authentication via Clerk JWT tokens.

## Endpoints

### POST /api/contact
Submit contact form with rate limiting.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

### GET /api/booking/availability
Check booking availability for given date range.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:**
```json
{
  "availableSlots": [
    {
      "date": "2024-01-15",
      "times": ["09:00", "10:00", "11:00"]
    }
  ]
}
```

### Component Documentation

**`.storybook/main.ts` (Updated):**
```typescript
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../shared-modules/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  // ... rest of config
}
```

### Deployment Documentation

**`docs/deployment.md`:**
```markdown
# Deployment Guide

## Prerequisites
- Node.js 18+
- Bun package manager
- Convex account
- Clerk account
- Vercel/Coolify account

## Environment Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd drtimfoo-v3
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Fill in all required variables
   ```

## Production Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Coolify Deployment
1. Create new application in Coolify
2. Configure build settings
3. Set environment variables
4. Deploy using GitHub Actions

## Monitoring & Maintenance

### Performance Monitoring
- Vercel Analytics
- Sentry Error Tracking
- Core Web Vitals monitoring

### Backup Strategy
- Convex automatic backups
- Database exports weekly
- Environment variables secure storage

---

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Set up project structure
2. Configure development environment
3. Implement authentication system
4. Set up Convex backend
5. Create basic UI components

### Phase 2: Core Features (Week 3-4)
1. Implement booking system
2. Create contact forms
3. Build testimonial management
4. Set up admin dashboard
5. Add content management

### Phase 3: Enhancement (Week 5-6)
1. Optimize performance
2. Implement testing suite
3. Add monitoring
4. Security hardening
5. Documentation completion

### Phase 4: Launch (Week 7-8)
1. Final testing and QA
2. Production deployment
3. Performance monitoring
4. User feedback collection
5. Iteration and improvements

---

## Success Metrics

### Technical Metrics
- [ ] 95+ Lighthouse performance score
- [ ] 100% TypeScript coverage
- [ ] 80%+ test coverage
- [ ] Zero critical security vulnerabilities
- [ ] < 3s page load time

### User Experience Metrics
- [ ] WCAG 2.2 AA accessibility compliance
- [ ] Mobile-first responsive design
- [ ] < 100ms interaction response time
- [ ] 99.9% uptime
- [ ] Error rate < 0.1%

### Business Metrics
- [ ] 25% increase in conversion rate
- [ ] 50% reduction in support tickets
- [ ] Improved SEO rankings
- [ ] Positive user feedback
- [ ] Increased booking completion rate

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a production-ready Next.js application with modern tooling and best practices. The modular architecture, extensive testing strategy, and focus on performance and security ensure a maintainable and scalable solution.

Key strengths of this approach:
- **Type Safety**: TypeScript throughout the stack
- **Performance**: Optimized for Core Web Vitals
- **Accessibility**: WCAG compliant from the start
- **Security**: Multiple layers of protection
- **Maintainability**: Clean architecture and comprehensive testing
- **Scalability**: Designed for growth and evolution

The phased approach allows for iterative development and continuous feedback, ensuring the final product meets both technical requirements and user needs.