import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';

// Setup testing library globals
expect.extend(matchers);

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Convex hooks
vi.mock('@/lib/convex/client', () => ({
  useCurrentUser: () => ({
    user: { _id: 'test-user', email: 'test@example.com' },
    isLoading: false,
  }),
  useUserBookings: () => ({
    bookings: [],
    isLoading: false,
  }),
  useCreateBooking: () => ({
    createBooking: vi.fn(),
    isLoading: false,
  }),
  useUpcomingBookings: () => ({
    bookings: [],
    isLoading: false,
  }),
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
