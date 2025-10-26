import { z } from "zod";

// For development, use more permissive validation and provide defaults
const envValues = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || "",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
  CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in",
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up",
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/",
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/",
};

// Conditional schema for development vs production
const getSchema = (isDev: boolean) =>
  z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_APP_URL: z.string().url({
      message: "NEXT_PUBLIC_APP_URL must be a valid URL",
    }),
    NEXT_PUBLIC_CONVEX_URL: isDev
      ? z.string()
      : z.string().url({
          message: "NEXT_PUBLIC_CONVEX_URL must be a valid Convex URL",
        }),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: isDev
      ? z.string()
      : z.string().min(1, {
          message: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required (get from Clerk Dashboard)",
        }),
    CLERK_SECRET_KEY: isDev
      ? z.string()
      : z.string().min(1, {
          message: "CLERK_SECRET_KEY is required (get from Clerk Dashboard)",
        }),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: isDev
      ? z.string()
      : z.string().min(1, {
          message: "NEXT_PUBLIC_CLERK_SIGN_IN_URL must be a valid route path",
        }),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: isDev
      ? z.string()
      : z.string().min(1, {
          message: "NEXT_PUBLIC_CLERK_SIGN_UP_URL must be a valid route path",
        }),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: isDev
      ? z.string()
      : z.string().min(1, {
          message: "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL must be a valid route path",
        }),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: isDev
      ? z.string()
      : z.string().min(1, {
          message: "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL must be a valid route path",
        }),
  });

const isDev = envValues.NODE_ENV === "development";
const currentSchema = getSchema(isDev);

let validatedEnv: z.infer<typeof currentSchema>;

try {
  validatedEnv = currentSchema.parse(envValues);
  console.log(`✅ Environment validation passed (Mode: ${envValues.NODE_ENV})`);
} catch (error) {
  console.error("❌ Environment validation failed in", envValues.NODE_ENV, "mode:");
  if (error instanceof z.ZodError) {
    error.issues.forEach((err: z.ZodIssue) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }
  console.error("\n💡 Set environment variables in .env.local file.\n");
  // Don't throw error in development to allow app to start
  if (!isDev) {
    throw new Error("Environment validation failed - check console for details");
  }
  console.log("⚠️ Running with partial environment configuration (development mode)");
  // Use empty object as fallback for development
  validatedEnv = {} as z.infer<typeof currentSchema>;
}

export const env = validatedEnv;
