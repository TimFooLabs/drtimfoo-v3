// TODO: Implement navigation component
// This is a placeholder component that will be implemented in a future task

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <div className="flex space-x-6">
        <a href="/" className="text-sm font-medium hover:text-primary">
          Home
        </a>
        <a href="/about" className="text-sm font-medium hover:text-primary">
          About
        </a>
        <a href="/services" className="text-sm font-medium hover:text-primary">
          Services
        </a>
        <a href="/blog" className="text-sm font-medium hover:text-primary">
          Blog
        </a>
        <a href="/contact" className="text-sm font-medium hover:text-primary">
          Contact
        </a>
      </div>
    </nav>
  );
}
