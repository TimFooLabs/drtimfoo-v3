# MVP-First Error Handling Guide

MVP-first error handling focuses on providing a good user experience while minimizing development time. The principle is to handle common errors gracefully while avoiding over-engineering edge case handling.

## MVP Error Philosophy

### Core Principles

#### Prevent Errors, Don't Just Handle Them (High Priority)
**Description**: Design the UI to prevent common user errors rather than just catching them

**Example**: Use HTML5 validation attributes on forms instead of complex client-side validation

#### Graceful Degradation (High Priority)
**Description**: When errors occur, provide fallbacks that maintain core functionality

**Example**: If a feature fails, show a basic alternative or retry option

#### Generic User Messages (Medium Priority)
**Description**: Use simple, generic error messages for users while logging technical details

**Example**: "Something went wrong. Please try again." instead of detailed error codes

#### Log Everything, Fix Later (Medium Priority)
**Description**: Log all errors for debugging but prioritize shipping over comprehensive error handling

**Example**: Console.log errors for MVP, implement proper error tracking post-MVP

## Common Error Scenarios

### Authentication Errors
Errors related to user authentication and authorization

#### Unauthenticated Access
- **Symptoms**: User tries to access protected page without signing in
- **MVP Solution**: Use Clerk middleware to automatically redirect to sign-in

```tsx
// middleware.ts - Automatically handles auth redirects
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});
```

#### Expired Session
- **Symptoms**: User session expires during usage
- **MVP Solution**: Let Clerk handle session refresh automatically

```tsx
// In Server Components - check auth on each request
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  // ... rest of component
}
```

### Convex Backend Errors
Errors from Convex mutations and queries

#### Mutation Failure
- **Symptoms**: Database operation fails (network, validation, etc.)
- **MVP Solution**: Show generic error message and log details to console

```tsx
// Client Component with error handling
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
      console.error("Task creation failed:", error);
      // MVP: Simple toast or alert
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

#### Query Timeout
- **Symptoms**: Data loading takes too long or fails
- **MVP Solution**: Show loading state with timeout fallback

```tsx
// Loading state with timeout
export function TaskList() {
  const tasks = useQuery(api.tasks.list);

  if (tasks === undefined) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading tasks...</p>
        <p className="text-sm text-gray-400">If this takes too long, please refresh the page.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  return (
    <div>
      {tasks.map(task => <div key={task._id}>{task.title}</div>)}
    </div>
  );
}
```

### Form Submission Errors
Errors during form validation and submission

#### Validation Failure
- **Symptoms**: User submits invalid data
- **MVP Solution**: Use HTML5 validation attributes for basic validation

```tsx
// MVP: Use native HTML validation
<form onSubmit={handleSubmit}>
  <input
    type="text"
    name="title"
    required
    minLength={3}
    placeholder="Task title (min 3 characters)"
  />
  <input
    type="email"
    name="email"
    required
    placeholder="Email address"
  />
  <button type="submit">Submit</button>
</form>

// Server Action with basic validation
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title || title.length < 3) {
    return { error: "Title must be at least 3 characters" };
  }

  try {
    await fetchAction(api.tasks.create, { title });
    return { success: true };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}
```

#### Network Error
- **Symptoms**: Form submission fails due to network issues
- **MVP Solution**: Show retry button and clear error message

```tsx
'use client';

import { useFormState, useFormStatus } from "react-dom";
import { createTask } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Task"}
    </button>
  );
}

export function TaskForm() {
  const [state, formAction] = useFormState(createTask, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {state.error}
          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      <input name="title" required minLength={3} />
      <SubmitButton />
    </form>
  );
}
```

### UI Component Errors
Errors in component rendering and interaction

#### Component Crash
- **Symptoms**: Component fails to render due to missing data or props
- **MVP Solution**: Add error boundaries and provide fallbacks

```tsx
// Simple error boundary for MVP
'use client';

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>We couldn't load this part of the app.</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}

// Usage with optional chaining for safety
export function UserProfile({ user }) {
  return (
    <div>
      <h1>{user?.firstName || 'Welcome'}!</h1>
      <p>{user?.emailAddress || 'No email set'}</p>
    </div>
  );
}
```

#### Missing Data
- **Symptoms**: Component expects data that isn't available
- **MVP Solution**: Provide sensible defaults and loading states

```tsx
// Safe data handling with defaults
export function TaskCard({ task }) {
  if (!task) {
    return (
      <div className="border rounded p-4">
        <p className="text-gray-500">Task information unavailable</p>
      </div>
    );
  }

  return (
    <div className="border rounded p-4">
      <h3>{task.title || 'Untitled Task'}</h3>
      <p>{task.description || 'No description'}</p>
      <span className={`text-sm ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>
    </div>
  );
}
```

## Error Handling Patterns

### Basic Try-Catch Wrapper
Standard pattern for handling async operations

```tsx
async function handleAsyncOperation() {
  try {
    const result = await someAsyncOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error("Operation failed:", error);
    return { success: false, error: "Something went wrong" };
  }
}

// Usage in component
const [result, setResult] = useState(null);

const handleClick = async () => {
  setResult(null);
  const operationResult = await handleAsyncOperation();
  setResult(operationResult);

  if (!operationResult.success) {
    // Show user-friendly message
    alert(operationResult.error);
  }
};
```

### Loading with Timeout Fallback
Handle cases where loading takes too long

```tsx
import { useState, useEffect } from "react";

export function useLoadingWithTimeout(data, timeoutMs = 10000) {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data === undefined) {
        setShowTimeoutMessage(true);
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [data, timeoutMs]);

  return { showTimeoutMessage };
}

// Usage
export function DataLoader() {
  const data = useQuery(api.some.query);
  const { showTimeoutMessage } = useLoadingWithTimeout(data);

  if (data === undefined && !showTimeoutMessage) {
    return <div>Loading...</div>;
  }

  if (showTimeoutMessage) {
    return (
      <div>
        <p>Taking longer than expected...</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return <div>{/* render data */}</div>;
}
```

### Form Validation Feedback
Provide clear feedback for form validation errors

```tsx
'use client';

import { useFormState } from "react-dom";

export function FormWithValidation() {
  const [state, formAction] = useFormState(submitForm, null);

  return (
    <form action={formAction}>
      {/* Form fields */}
      <input name="email" type="email" required />

      {/* Error display */}
      {state?.error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          {state.error}
        </div>
      )}

      {/* Success message */}
      {state?.success && (
        <div style={{ color: 'green', marginTop: '0.5rem' }}>
          Form submitted successfully!
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

async function submitForm(prevState: any, formData: FormData) {
  // Basic validation
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  try {
    // Submit form data
    await someApiCall(formData);
    return { success: true };
  } catch (error) {
    console.error("Form submission failed:", error);
    return { error: "Submission failed. Please try again." };
  }
}
```

## MVP Error Checklist

### Before Deployment
- Forms have basic validation (required, minLength, etc.)
- Auth redirects work for protected pages
- Loading states show for async operations
- Network errors show retry options
- Console errors are logged for debugging

### User Experience
- Error messages are simple and actionable
- Users can retry failed operations
- App doesn't crash on errors
- Core functionality remains available during errors
- Page refresh resolves most issues

### Development
- Console logs help identify issues
- Error boundaries prevent app crashes
- Optional chaining prevents null errors
- Default values handle missing data
- Try-catch blocks handle async failures

## Post-MVP Error Handling Enhancements

These improvements should be added after MVP validation and user feedback

### Error Tracking Service (Medium Priority)
**Description**: Integrate services like Sentry or LogRocket for comprehensive error tracking

**Implementation**: Add error tracking SDK, configure error reporting, set up alerts

### Advanced Form Validation (Medium Priority)
**Description**: Implement client-side validation with libraries like Zod or Yup

**Implementation**: Add validation schemas, real-time validation feedback, custom error messages

### Retry Logic (Low Priority)
**Description**: Implement automatic retry for failed network requests

**Implementation**: Add exponential backoff, retry limits, user notification of retries

### Offline Support (Low Priority)
**Description**: Add offline detection and queue actions for when connection is restored

**Implementation**: Service workers, local storage queue, sync on reconnection

## Common MVP Issues and Solutions

### White Screen of Death
- **Symptoms**: Page shows blank white screen
- **Common Causes**:
  - JavaScript error in component
  - Missing import or incorrect file path
  - Server component throwing unhandled error
- **Quick Fixes**:
  - Check browser console for JavaScript errors
  - Verify all imports are correct
  - Add error boundaries to catch component errors
  - Check server logs for server-side errors

### Authentication Loop
- **Symptoms**: Endless redirect between sign-in and protected page
- **Common Causes**:
  - Clerk middleware configuration issue
  - Auth check in Server Component not working
  - Missing Clerk environment variables
- **Quick Fixes**:
  - Verify Clerk environment variables are set
  - Check middleware.ts configuration
  - Ensure ClerkProvider wraps the app
  - Test Clerk authentication flow manually

### Convex Connection Failed
- **Symptoms**: Data not loading from Convex backend
- **Common Causes**:
  - Convex dev server not running
  - Wrong Convex deployment URL
  - Authentication not working in Convex functions
- **Quick Fixes**:
  - Start Convex dev server: `npx convex dev`
  - Check Convex environment variables
  - Verify Convex functions have auth checks
  - Check Convex dashboard for function logs

### Styling Not Applied
- **Symptoms**: Tailwind CSS classes not working
- **Common Causes**:
  - Tailwind not properly configured
  - Missing CSS imports
  - Incorrect class names
- **Quick Fixes**:
  - Verify Tailwind CSS is imported in globals.css
  - Check tailwind.config.js configuration
  - Ensure PostCSS is configured correctly
  - Restart development server
