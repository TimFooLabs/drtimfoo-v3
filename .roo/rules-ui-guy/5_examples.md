# Complete, End-to-End Examples

This document contains complete, end-to-end examples of common MVP development workflows. Each example demonstrates the full process from initial request to production deployment, following the UI Guy mode's MVP-first principles.

## Task Management MVP

### Overview
**Title**: Complete Task Management MVP  
**Description**: Building a simple task management feature from scratch following MVP principles

### Context

**User Request**: "I need a simple task management system where users can add, view, and complete tasks"

**Scope Analysis**:
- **Core Problem**: Users need to track their tasks
- **MVP Scope**: Add tasks, view task list, mark tasks as complete
- **Time Estimate**: 30 minutes implementation
- **Complexity**: Low - uses existing patterns and components

### Workflow Steps

#### Step 1: Research Existing Patterns
- **Tool**: `codebase_search` - Search for "task management components"
- **Tool**: `codebase_search` - Search for "form submission patterns"
- **Tool**: `read_file` - Examine existing Convex schema
- **Outcome**: Found existing task patterns, can reuse and extend

#### Step 2: Query Component Documentation
- **Tool**: `use_mcp_tool` - Get shadcn Button component documentation
- **Tool**: `use_mcp_tool` - Get shadcn Input component documentation
- **Tool**: `use_mcp_tool` - Get shadcn Card component documentation
- **Outcome**: Identified required components and their APIs

#### Step 3: Install Required Components
- **Tool**: `execute_command` - `npx shadcn@latest add button`
- **Tool**: `execute_command` - `npx shadcn@latest add input`
- **Tool**: `execute_command` - `npx shadcn@latest add card`
- **Tool**: `execute_command` - `npx shadcn@latest add form`
- **Outcome**: All required components installed

#### Step 4: Implement Convex Functions

Create `convex/tasks.ts` with schema and functions:

```tsx
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("tasks", {
      title: args.title.trim(),
      userId: identity.subject,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const toggle = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== identity.subject) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.taskId, {
      completed: !task.completed,
    });
  },
});
```

#### Step 5: Create UI Components

Create `components/TaskForm.tsx`:

```tsx
'use client';

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({ title: title.trim() });
      setTitle("");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
            className="flex-1"
          />
          <Button type="submit">Add Task</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

Create `components/TaskList.tsx`:

```tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TaskList() {
  const tasks = useQuery(api.tasks.list);
  const toggleTask = useMutation(api.tasks.toggle);

  if (tasks === undefined) {
    return <div>Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No tasks yet. Add your first task above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task._id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.title}
              </span>
              <Button
                variant={task.completed ? "outline" : "default"}
                size="sm"
                onClick={() => toggleTask({ taskId: task._id })}
              >
                {task.completed ? "Undo" : "Complete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### Step 6: Create Page Component

Create `app/tasks/page.tsx`:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>

      <div className="space-y-6">
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
}
```

#### Step 7: Test Implementation
- **Tool**: `execute_command` - `npm run dev`
- **Tool**: `execute_command` - `npx convex dev`

**Validation**:
- Can add new tasks
- Can view task list
- Can mark tasks as complete
- Data persists across page refreshes
- Authentication works correctly

#### Step 8: Deploy to Production
- **Tool**: `execute_command` - `npx convex deploy`
- **Tool**: `execute_command` - `vercel --prod`
- **Outcome**: Feature deployed to production, ready for user testing

### MVP Validation

**Completion Criteria**:
- ✅ User can authenticate with OAuth
- ✅ User can add tasks (core action)
- ✅ User can view task list
- ✅ User can complete tasks
- ✅ Data persists across sessions
- ✅ No console errors on happy path
- ✅ Uses shadcn/ui defaults
- ✅ Deployed to production

**Time to Complete**: 25 minutes (under 30-minute target)

**Next Steps**:
1. Share with 5-10 users for feedback
2. Collect feedback on task management workflow
3. Prioritize post-MVP enhancements based on feedback

## User Profile Page MVP

### Overview
**Title**: User Profile Page MVP  
**Description**: Creating a simple user profile page that displays user information

### Context

**User Request**: "I need a profile page where users can see their account information"

**Scope Analysis**:
- **Core Problem**: Users need to view their account details
- **MVP Scope**: Display user name, email, and account creation date
- **Time Estimate**: 15 minutes implementation
- **Complexity**: Very Low - read-only data display

### Workflow Steps

#### Step 1: Research Existing Patterns
- **Tool**: `codebase_search` - Search for "user profile components"
- **Tool**: `codebase_search` - Search for "Clerk user data display"
- **Outcome**: Found Clerk user data patterns, can implement quickly

#### Step 2: Create Profile Component

Create `components/UserProfile.tsx`:

```tsx
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: string | null;
    createdAt?: number;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <UserButton />
            {fullName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Email</h3>
              <p>{user.emailAddress || "No email provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Member Since</h3>
              <p>{createdDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Step 3: Create Profile Page

Create `app/profile/page.tsx`:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/UserProfile";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user data from Clerk
  const user = await auth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <UserProfile user={user} />
    </div>
  );
}
```

#### Step 4: Test and Deploy
- **Tool**: `execute_command` - `npm run dev`
- **Tool**: `execute_command` - `npx convex deploy`
- **Tool**: `execute_command` - `vercel --prod`

**Validation**:
- Profile page displays user information
- Authentication redirect works
- UserButton allows account management

### MVP Validation

**Completion Criteria**:
- ✅ Displays user name and email
- ✅ Shows account creation date
- ✅ Authentication required
- ✅ Uses Clerk components
- ✅ Deployed to production

**Time to Complete**: 12 minutes (under 15-minute target)

## Feedback Form MVP

### Overview
**Title**: Simple Feedback Form MVP  
**Description**: Adding a feedback mechanism for MVP user feedback collection

### Context

**User Request**: "I need a way for users to send feedback about the application"

**Scope Analysis**:
- **Core Problem**: Need to collect user feedback for iteration
- **MVP Scope**: Simple form that sends feedback via email
- **Time Estimate**: 10 minutes implementation
- **Complexity**: Very Low - static form with mailto link

### Workflow Steps

#### Step 1: Create Feedback Component

Create `components/FeedbackButton.tsx`:

```tsx
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  const emailSubject = encodeURIComponent("MVP Feedback");
  const emailBody = encodeURIComponent(`
I'm using your MVP and have some feedback:

1. What I like:
2. What could be better:
3. Features I'd like to see:

Thanks!
`);

  return (
    <Button variant="outline" asChild>
      <a
        href={`mailto:feedback@yourapp.com?subject=${emailSubject}&body=${emailBody}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Send Feedback
      </a>
    </Button>
  );
}
```

#### Step 2: Add to Layout
- **Tool**: `read_file` - Read app/layout.tsx
- **Tool**: `apply_diff` - Add feedback button to main layout

```tsx
// Add import
import { FeedbackButton } from "@/components/FeedbackButton";

// Add to layout (in appropriate location)
<div className="fixed bottom-4 right-4 z-50">
  <FeedbackButton />
</div>
```

#### Step 3: Test Implementation
- **Tool**: `execute_command` - `npm run dev`

**Validation**:
- Feedback button appears on all pages
- Clicking opens email client with template
- Email template includes helpful prompts

### MVP Validation

**Completion Criteria**:
- ✅ Feedback mechanism exists
- ✅ Easy for users to access
- ✅ Provides structured feedback format
- ✅ Minimal implementation (MVP approach)

**Time to Complete**: 8 minutes (under 10-minute target)

## Common MVP Development Pitfalls to Avoid

### Over-Engineering a Simple Feature
**Scenario**: Building a contact form

**Wrong Approach**:
- Building custom form validation, animations, and complex state management
- Time estimate: 2-3 days
- Complexity: High - unnecessary complexity

**Correct Approach**:
- Use shadcn/ui form components with basic HTML validation
- Time estimate: 15 minutes
- Complexity: Low - simple and effective

**Lesson**: Always choose the simplest solution that meets the core requirement

### Adding Non-Essential Features
**Scenario**: Task management system

**Wrong Approach**:
- Adding categories, due dates, priorities, search, filtering in MVP
- Time estimate: 1-2 weeks
- Scope: Multiple problems solved poorly

**Correct Approach**:
- Just add, view, and complete tasks
- Time estimate: 30 minutes
- Scope: One problem solved well

**Lesson**: Focus on the ONE core problem for MVP

### Optimizing Before Validation
**Scenario**: Data fetching performance

**Wrong Approach**:
- Implementing complex caching, pagination, and optimization strategies
- Time estimate: Days of work
- Validation: No users to benefit from optimizations

**Correct Approach**:
- Use simple queries, optimize after user feedback shows performance issues
- Time estimate: Minutes of work
- Validation: Ship quickly, optimize based on real usage

**Lesson**: Optimize after validating the feature is valuable to users

## MVP Success Patterns

### Quick Validation Pattern
How to quickly validate an MVP idea with minimal implementation

**Steps**:
1. Identify the core user action (the ONE thing users must do)
2. Implement just that action using existing components
3. Add basic authentication and data persistence
4. Deploy to production immediately
5. Share with 5-10 users and observe their behavior
6. Collect feedback and decide on next iterations

**Timeframe**: 7 days maximum from idea to user feedback

**Success Metrics**:
- Users complete the core action without assistance
- Users provide feedback without prompting
- Data persists correctly across sessions

### Iterative Improvement Pattern
How to systematically improve an MVP based on user feedback

**Phases**:

#### Week 1: Ship and Monitor
**Focus**: Fix critical bugs only, observe usage patterns

#### Weeks 2-4: Feedback Collection
**Focus**: Actively solicit feedback, categorize requests

#### Month 2+: Prioritized Improvements
**Focus**: Build the most requested features first

**Decision Framework**:
- **Question**: Are multiple users requesting the same feature?
  - **Yes**: Prioritize for next iteration
  - **No**: Add to backlog for consideration
