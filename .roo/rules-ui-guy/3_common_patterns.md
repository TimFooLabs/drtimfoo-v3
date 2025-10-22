# Common Patterns

This document contains reusable code patterns and templates for common UI development tasks in MVP-first Next.js applications. These patterns follow the established best practices and can be quickly adapted for specific use cases.

## Component Patterns

### Server Component with Data Fetching
Pattern for Server Components that fetch and display data from Convex

**When to use**: Displaying data that doesn't require user interaction

```tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

interface TaskListProps {
  userId: string;
}

export default async function TaskList({ userId }: TaskListProps) {
  const tasks = await fetchQuery(api.tasks.listByUser, { userId });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">
            {task.completed ? "Completed" : "Pending"}
          </p>
        </div>
      ))}
    </div>
  );
}
```

**Notes**:
- Always use fetchQuery for Server Components
- Include loading states and empty states
- Handle edge cases (no data, errors)

### Client Component with User Interaction
Pattern for Client Components that handle user interactions

**When to use**: Components that need useState, useEffect, or event handlers

```tsx
'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskManager() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({ title: newTaskTitle.trim() });
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New task..."
              className="flex-1"
            />
            <Button type="submit">Add Task</Button>
          </form>

          <div className="space-y-2">
            {tasks?.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-3 border rounded">
                <span>{task.title}</span>
                <span className={`text-sm ${task.completed ? "text-green-600" : "text-yellow-600"}`}>
                  {task.completed ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Notes**:
- Keep Client Components small and focused
- Use proper error handling for mutations
- Include loading states for queries

### Form with Server Action
Pattern for forms that use Server Actions for submission

**When to use**: Form submissions that don't require client-side state management

```tsx
// app/actions.ts
'use server';

import { api } from "@/convex/_generated/api";
import { fetchAction } from "convex/nextjs";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title?.trim()) {
    return { error: "Task title is required" };
  }

  try {
    const result = await fetchAction(api.tasks.create, { title: title.trim() });
    return { success: true, data: result };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}

// components/TaskForm.tsx
'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Task"}
    </Button>
  );
}

export function TaskForm() {
  const [state, formAction] = useFormState(createTask, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Task Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Enter task title..."
          required
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
```

**Notes**:
- Server Actions are preferred for form submissions
- Use useFormState for handling form results
- Include proper validation and error handling

### Authenticated Page
Pattern for pages that require user authentication

**When to use**: Any page that should only be accessible to authenticated users

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TaskManager from "@/components/TaskManager";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <TaskManager />
    </div>
  );
}
```

**Notes**:
- Always check authentication at the page level
- Use redirect for unauthenticated users
- Server Components can access auth directly

### Layout with Navigation
Pattern for layouts that include navigation and user authentication

**When to use**: Authenticated app sections that need consistent navigation

```tsx
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <nav className="flex space-x-8">
              <Link href="/dashboard" className="font-semibold">
                Dashboard
              </Link>
              <Link href="/dashboard/tasks" className="text-gray-600 hover:text-gray-900">
                Tasks
              </Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/feedback">Send Feedback</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
```

**Notes**:
- Include UserButton for authentication
- Add feedback mechanism for MVP
- Use consistent navigation patterns

## Convex Patterns

### Secure Mutation with Authentication
Pattern for Convex mutations that require authentication

```tsx
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: Please sign in to create tasks");
    }

    // Validate input
    if (!args.title.trim()) {
      throw new Error("Task title cannot be empty");
    }

    // Create the task
    const taskId = await ctx.db.insert("tasks", {
      title: args.title.trim(),
      description: args.description?.trim(),
      userId: identity.subject,
      completed: false,
      createdAt: Date.now(),
    });

    return taskId;
  },
});
```

**Notes**:
- Always authenticate in mutations
- Validate inputs before database operations
- Include timestamps for tracking

### Optimized Query with Indexes
Pattern for efficient Convex queries using indexes

```tsx
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, limit = 50 } = args;

    // Use index for efficient querying
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return tasks;
  },
});

// Schema must include the index:
// export default defineSchema({
//   tasks: defineTable({
//     title: v.string(),
//     userId: v.string(),
//     completed: v.boolean(),
//   }).index("by_user", ["userId"]),
// });
```

**Notes**:
- Always use indexes for filtered queries
- Include pagination limits
- Define indexes in schema.ts

## UI Patterns

### Responsive Grid Layout
Pattern for responsive grid layouts using Tailwind

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <Card key={item.id} className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <Button className="w-full">View Details</Button>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

**Notes**:
- Use mobile-first responsive design
- Consistent spacing with gap classes
- Cards should have equal height with h-full

### Loading Skeleton Pattern
Pattern for loading states using skeleton components

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Usage in component:
const tasks = useQuery(api.tasks.list);
if (tasks === undefined) {
  return <TaskListSkeleton />;
}
```

**Notes**:
- Always show loading states for async operations
- Match skeleton layout to actual content structure
- Use appropriate number of skeleton items

### Error Boundary Pattern
Pattern for handling errors gracefully in UI components

```tsx
'use client';

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Component error:", error);
  }, [error]);

  return (
    <div className="container mx-auto p-4">
      <Alert variant="destructive">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred. Please try again."}
        </AlertDescription>
        <Button onClick={reset} className="mt-4">
          Try Again
        </Button>
      </Alert>
    </div>
  );
}
```

**Notes**:
- Log errors for debugging
- Provide clear error messages to users
- Include recovery options when possible

## Integration Patterns

### Complete CRUD Feature
End-to-end pattern for a complete CRUD feature

**Template Structure**:
- `convex/tasks.ts` - Convex schema and functions for task management
- `components/TaskList.tsx` - Server Component for displaying tasks
- `components/TaskForm.tsx` - Form component with Server Action
- `app/actions.ts` - Server Actions for form submissions
- `app/dashboard/tasks/page.tsx` - Page component that ties everything together

**Implementation Notes**:
- Start with the data layer (Convex schema and functions)
- Build Server Components for displaying data
- Add Client Components only for interactivity
- Use Server Actions for form submissions
- Test each layer independently

## MVP Patterns

### MVP Feature Template
Template for implementing MVP features quickly

**Checklist**:
- Identify the single core user action
- Use existing shadcn/ui components
- Implement basic authentication check
- Add simple data persistence
- Include basic error handling
- Test the happy path only
- Deploy and get user feedback

**Time Guidance**:
- **Planning**: 5 minutes - define scope and approach
- **Implementation**: 20 minutes - build the core feature
- **Testing**: 5 minutes - test happy path
- **Deployment**: 5 minutes - deploy to production
