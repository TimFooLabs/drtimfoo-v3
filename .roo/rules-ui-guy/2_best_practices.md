# Best Practices Guide

## General Principles

### MVP-First Development (High Priority)
**Description**: Always prioritize shipping speed over perfection. An MVP is a learning tool, not a finished product.

**Rationale**: User feedback is more valuable than assumptions made during development. Shipping quickly allows for real-world validation.

**Example**:
- **Scenario**: Building a contact form
- **Good**: Use shadcn/ui form components with basic validation, deploy immediately
- **Bad**: Build custom form with advanced validation, animations, and error handling before shipping

### Server Components by Default (High Priority)
**Description**: Always start with Server Components. Only use 'use client' when absolutely necessary.

**Rationale**: Server Components provide better performance, security, and smaller bundle sizes.

**Example**:
- **Scenario**: Displaying user data
- **Good**:
  ```tsx
  // Server Component - default choice
  export default function UserProfile() {
    const user = await fetchUser();
    return <div>{user.name}</div>;
  }
  ```
- **Bad**:
  ```tsx
  // Client Component - avoid unless necessary
  'use client';
  export default function UserProfile() {
    const [user, setUser] = useState(null);
    // ... unnecessary client-side complexity
  }
  ```

### Library Defaults Over Custom Solutions (High Priority)
**Description**: Use shadcn/ui, Tailwind, and Convex defaults unless customization is core to your value proposition.

**Rationale**: Defaults are tested, accessible, and maintainable. Custom solutions increase complexity and development time.

**Example**:
- **Scenario**: Styling a button
- **Good**: Use shadcn/ui Button component with default variants
- **Bad**: Create custom button with unique styling that doesn't differentiate your product

## Technology-Specific Practices

### Next.js Practices

#### Component Architecture
**Guidelines**:
- Default to Server Components for data fetching and static content
- Use Client Components only for interactivity (onClick, useState, useEffect)
- Keep Client Components small and focused
- Extract client-side logic into separate hooks when possible

**Good Client Component Pattern**:
```tsx
// components/AddButton.tsx - Small, focused client component
'use client';
import { Button } from '@/components/ui/button';

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddButton({ onClick, disabled }: AddButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      Add Item
    </Button>
  );
}
```

#### File-Based Routing
**Guidelines**:
- Use kebab-case for folder names (/user-settings, /booking-page)
- Use PascalCase for file names (TaskList.tsx, UserProfile.tsx)
- Group related routes in parentheses for layout organization
- Use route groups (auth), (dashboard) to separate concerns

#### Data Fetching Strategy
**Guidelines**:
- Server Components: Use await fetchQuery() for Convex data
- Client Components: Use useQuery() hooks for real-time data
- Prefer Server Actions for form mutations
- Implement loading states for all async operations

### Convex Practices

#### Authentication in All Functions
**Guidelines**:
- Every authenticated function must verify user identity
- Use ctx.auth.getUserIdentity() to get user information
- Throw descriptive errors for unauthenticated access
- Implement user-based data filtering for security

**Secure Mutation Pattern**:
```tsx
export const createTask = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: Please sign in to create tasks");
    }

    const task = await ctx.db.insert("tasks", {
      title: args.title,
      userId: identity.subject,
      completed: false,
    });

    return task;
  },
});
```

#### Query Optimization
**Guidelines**:
- Never use .collect() without pagination or limits
- Use indexes for frequently queried fields
- Filter data at the database level, not in application code
- Use .take() for limiting result sets

**Efficient Query Pattern**:
```tsx
// ❌ Bad: Unbounded query
const allTasks = await ctx.db.query("tasks").collect();

// ✅ Good: Indexed and paginated query
const userTasks = await ctx.db
  .query("tasks")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .order("desc")
  .take(50);
```

### Clerk Practices

#### OAuth-First Strategy
**Guidelines**:
- Enable only OAuth providers for MVP (Google, GitHub, etc.)
- No email/password authentication for v1
- Use Clerk middleware for route protection
- Implement proper redirect flows for authentication

#### Clerk Components
**Guidelines**:
- Use prebuilt Clerk components (UserButton, SignIn, SignUp)
- Wrap app with ClerkProvider in root layout
- Use SignedIn/SignedOut components for conditional rendering
- Implement server-side auth checks in Server Components

### shadcn/ui Practices

#### Component Installation and Usage
**Guidelines**:
- Always install components via CLI: npx shadcn@latest add [component]
- Query MCP server for component documentation before use
- Compose existing components rather than building custom ones
- Use cn() utility for conditional styling

**Component Composition Pattern**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onEdit, onDelete }) {
  return (
    <Card className={cn(task.completed && "opacity-60")}>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Tailwind CSS Practices

#### MVP Styling Approach
**Guidelines**:
- Use Tailwind defaults for spacing, colors, and typography
- Stick to the default scale (multiples of 4px)
- Use responsive prefixes (md:, lg:) for mobile-first design
- Avoid custom CSS for MVP - use utility classes

**Responsive Layout Pattern**:
```tsx
<div className="container mx-auto px-4 py-8 max-w-6xl">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map(item => (
      <Card key={item.id} className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </Card>
    ))}
  </div>
</div>
```

## Code Conventions

### TypeScript Standards
**Guidelines**:
- Strict mode enabled - no exceptions
- No 'any' types - use 'unknown' if necessary
- Define interfaces for all data structures
- Use proper typing for function parameters and return values

### Naming Conventions
**Guidelines**:
- Components: PascalCase (TaskList, UserProfile)
- Functions: camelCase (createTask, getUserData)
- Files: Match export name (TaskList.tsx exports TaskList)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)

### Organization
**Guidelines**:
- Use @/ alias for all internal imports
- Group related files in feature folders
- Keep components flat - avoid deep nesting
- Separate UI components from business logic

**Import Pattern**:
```tsx
// ✅ Good: Using @/ alias
import { Button } from "@/components/ui/button";
import { createTask } from "@/app/actions";
import { api } from "@/convex/_generated/api";

// ❌ Bad: Relative imports
import { Button } from "../../../components/ui/button";
import { createTask } from "../../actions";
```

## Common Pitfalls

### "Use client" everywhere
- **Problem**: Increases bundle size, reduces performance, and adds unnecessary complexity
- **Solution**: Start with Server Components, add 'use client' only when you get hook-related errors

### Fetching data in useEffect
- **Problem**: Causes waterfalls, loading states, and poor user experience
- **Solution**: Use Server Components for data fetching, or useQuery hooks in Client Components

### Over-abstracting too early
- **Problem**: MVP should prioritize speed over reusable architecture
- **Solution**: Copy-paste code for MVP, abstract after 3rd duplication or post-MVP

### Ignoring TypeScript errors
- **Problem**: TypeScript errors indicate real issues that will cause runtime problems
- **Solution**: Zero tolerance for TypeScript errors - fix all before committing

## Modern Web Design Principles

These principles guide decision-making for professional web design and development, ensuring consistency, performance, accessibility, and maintainability. While MVP prioritizes speed, these standards should be followed when they don't significantly impact development time.

### Typography Principles

#### Use a Type Scale System (High Priority)
**Description**: Establish systematic font sizes using mathematical ratios for harmonious hierarchy

**Guidelines**:
- Base font size of 16px for body text
- Use "Major Third" ratio (1.25) to calculate heading sizes
- Use tools like typescale.net to generate values
- MVP: Use Tailwind's default scale (text-sm, text-base, text-lg, etc.)

**MVP Note**: For MVP, use Tailwind defaults. Post-MVP, implement custom type scale with clamp()

#### Use Relative Units for Spacing (High Priority)
**Description**: Ensure proportional spacing with unitless line-height and em units

**Guidelines**:
- Always use unitless line-height (e.g., 1.6)
- Use em units for letter-spacing
- Tighter line-height (1.2) for headings, looser (1.6) for body text

#### Implement Fluid Typography (Medium Priority)
**Description**: Use clamp() for smooth scaling across screen sizes

**Guidelines**:
- Use font-size: clamp(MIN, PREFERRED, MAX) syntax
- Add comments indicating tool used for generation
- Example: --h1-size: clamp(1.66rem, calc(1.43rem + 1.14vw), 2.28rem);

**MVP Note**: Post-MVP enhancement. Use Tailwind responsive classes for MVP.

#### Adjust Letter Spacing for Headings (Medium Priority)
**Description**: Slightly reduce letter spacing (tracking) on large headings to improve visual balance and readability, making them appear more cohesive.

**Guidelines**:
- Apply negative letter spacing to larger headings (e.g., h1, h2).
- The larger the font size, the more negative tracking can be applied.
- Avoid applying negative tracking to body text, as it can harm legibility.

**Tailwind Implementation**:
```tsx
// Example of tighter tracking on a large heading
<h1 className="text-4xl font-bold tracking-tighter">
  Stand Out & Get Noticed
</h1>

// Body text should use default tracking
<p className="text-base tracking-normal">
  This ensures maximum readability for paragraphs.
</p>
```

#### Select Unique, High-Quality Fonts (Low Priority)
**Description**: Avoid common fonts to create distinctive design

**Guidelines**:
- Source from Fontshare.com and Uncut.wtf
- Avoid overused fonts like Roboto, Open Sans

**MVP Note**: MVP: Use shadcn/ui defaults (Geist/Inter). Post-MVP: consider custom fonts.

### Layout & Spacing Principles

#### Use a Grid System Foundation (High Priority)
**Description**: Employ responsive column-based grid for structured layout

**Guidelines**:
- 12 columns for desktop, 8 for tablet, 4 for mobile
- Use CSS Grid or Tailwind's grid utilities
- Ensure consistent alignment and spacing

**Tailwind Implementation**:
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

#### Use 8-Point Grid System (High Priority)
**Description**: All spacing must be multiples of 8px for visual consistency

**Guidelines**:
- Use multiples of 8 for margins, padding, gaps
- Tailwind defaults follow this (p-2=8px, p-4=16px, etc.)
- Creates consistent visual rhythm

#### Establish Clear Visual Hierarchy (High Priority)
**Description**: Guide users through proximity, size, contrast, and alignment

**Guidelines**:
- Group related elements together (proximity)
- Make important elements larger (size)
- Use contrast for key elements (contrast)
- Create clean, deliberate lines (alignment)

#### Prevent Layout Shifts (Medium Priority)
**Description**: Reserve space for scrollbars and optimize rendering

**Guidelines**:
- Use scrollbar-gutter: stable for scrollbar space
- Use scrollbar-width: thin for less obtrusive scrollbars
- Apply content-visibility: auto to large off-screen sections
- Pair with contain-intrinsic-size to prevent layout shifts

**MVP Note**: Post-MVP optimization. Focus on core functionality for MVP.

### Color Principles

#### Limit Palette with 60-30-10 Rule (High Priority)
**Description**: Use balanced color distribution for professional design

**Guidelines**:
- 60% neutral for backgrounds and most text
- 30% secondary for cards and headers
- 10% accent for CTAs and highlights

**MVP Implementation**:
```
Use shadcn/ui defaults: --background, --card, --primary
```

#### Prioritize Color Contrast (High Priority)
**Description**: Ensure WCAG accessibility compliance

**Guidelines**:
- Minimum 4.5:1 contrast for normal text
- Minimum 3:1 contrast for large text
- Test contrast ratios during development

#### Use Opacity for Color Variations (Medium Priority)
**Description**: Create tints and shades with opacity instead of new colors

**Guidelines**:
- Adjust opacity of existing colors
- Maintains color harmony
- Reduces palette complexity

#### Implement Light/Dark Modes Efficiently (Medium Priority)
**Description**: Use modern CSS for theme switching

**Guidelines**:
- Use light-dark() CSS function for theme colors
- Set color-scheme: light dark on parent element
- Use relative color syntax with oklch()

**MVP Note**: Post-MVP enhancement. Use shadcn/ui theming for MVP.

### Component Interaction Principles

#### Use Native Browser Features (Medium Priority)
**Description**: Leverage modern HTML APIs for better performance and accessibility

**Guidelines**:
- Use Popover API for overlays (popover, popovertarget attributes)
- Build accordions with details elements and same name attribute
- Use contenteditable for simple in-place editing
- Apply backdrop-filter for visual effects

**MVP Note**: Use when available and doesn't complicate MVP timeline

#### Advanced CSS Techniques (Low Priority)
**Description**: Use modern CSS features for enhanced functionality

**Guidelines**:
- Define typed custom properties with @property
- Enable smooth animations for previously non-animatable properties
- Master basics before advanced techniques

**MVP Note**: Post-MVP enhancements for advanced interactions

### Conversion UX Principles

#### One Clear Goal Per Page (High Priority)
**Description**: Design each page to drive users toward a single primary action

**Guidelines**:
- Identify the primary conversion goal
- Remove competing objectives
- Guide users toward the desired action

#### Design for Trust, Clarity, and Emotion (High Priority)
**Description**: Build emotional connection and trust through design

**Guidelines**:
- Communicate value clearly
- Build trust through social proof
- Speak to user motivations
- Create emotional connection

### MVP Design Decision Framework

#### When to Apply Design Principles

**Question**: Does this principle significantly impact development time?

- **Yes**:
  - Action: Defer to post-MVP unless critical for core functionality
  - Examples: Custom type scales with clamp() - defer, Advanced CSS animations - defer, Custom font integration - defer
- **No**:
  - Action: Implement immediately as it doesn't delay MVP
  - Examples: 8-point grid system - implement (Tailwind defaults), Color contrast accessibility - implement, Visual hierarchy - implement

**Question**: Is this principle available in shadcn/ui/Tailwind defaults?

- **Yes**:
  - Action: Use defaults for MVP, customize post-MVP
  - Rationale: Leverages existing patterns while maintaining quality
- **No**:
  - Action: Implement basic version or defer based on complexity
  - Rationale: Balances quality with MVP speed requirements

## Quality Checklist

### Before Starting
- Understand the core user problem being solved
- Confirm this is MVP-critical (P0) vs post-MVP (P1)
- Check if existing components can be reused
- Verify library solutions exist before building custom

### During Implementation
- Starting with Server Components by default
- Using shadcn/ui components via CLI installation
- Implementing proper authentication checks in Convex
- Adding loading states for all async operations
- Following established naming and file conventions

### Before Completion
- Testing the feature in development environment
- Verifying no console errors on happy path
- Checking responsive design on different screen sizes
- Ensuring data persists across sessions
- Confirming authentication flows work correctly
