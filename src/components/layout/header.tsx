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