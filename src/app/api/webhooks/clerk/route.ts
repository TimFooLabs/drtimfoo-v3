import type { WebhookEvent } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { env } from "@/lib/env";
import { api } from "../../../../../convex/_generated/api";

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[ClerkWebhook] Missing CLERK_WEBHOOK_SIGNING_SECRET env variable");
    // Use a 500 error as this is a server configuration issue.
    return new Response("Internal Server Error: Missing webhook secret", { status: 500 });
  }

  console.log("[ClerkWebhook] Received webhook request");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp_str = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp_str || !svix_signature) {
    console.error("[ClerkWebhook] Missing Svix headers", {
      svix_id: !!svix_id,
      svix_timestamp: !!svix_timestamp_str,
      svix_signature: !!svix_signature,
    });
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // Validate timestamp tolerance (5 minutes)
  const svix_timestamp_num = parseInt(svix_timestamp_str, 10);
  if (isNaN(svix_timestamp_num)) {
    console.error("[ClerkWebhook] Invalid timestamp format", {
      svix_timestamp_str,
    });
    return new Response("Error: Invalid timestamp format", { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const timestampTolerance = 5 * 60; // 5 minutes in seconds
  if (Math.abs(now - svix_timestamp_num) > timestampTolerance) {
    console.error("[ClerkWebhook] Timestamp outside tolerance", {
      svix_timestamp_str,
      now,
      tolerance: timestampTolerance,
      difference: Math.abs(now - svix_timestamp_num),
    });
    return new Response("Error: Timestamp outside tolerance", { status: 400 });
  }

  // For webhook verification, we need the raw body exactly as sent (including trailing whitespace)
  // Next.js strips trailing newlines when processing JSON, so we need to add it back
  const bodyArrayBuffer = await req.arrayBuffer();
  let body = Buffer.from(bodyArrayBuffer).toString("utf8");

  // Svix signatures are sensitive to exact whitespace, including trailing newlines
  // If the body doesn't end with a newline, add one (as curl does with -d @file)
  if (!body.endsWith("\n")) {
    body += "\n";
  }

  console.log("[ClerkWebhook] Attempting verification", {
    svix_id,
    svix_timestamp: svix_timestamp_str,
    signaturePrefix: svix_signature?.slice(0, 8),
    payloadLength: body.length,
    secretLength: WEBHOOK_SECRET.length,
  });

  // Use string timestamp as Svix library accepts both string and number
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp_str,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[ClerkWebhook] Error verifying webhook", {
      message: (err as Error)?.message,
      svix_id,
    });
    return new Response("Error: Verification failed", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`[ClerkWebhook] Verified event of type: ${eventType}`);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = evt.data;
        // Basic validation to prevent runtime errors
        if (!id || !email_addresses || email_addresses.length === 0) {
          console.error(
            "[ClerkWebhook] Invalid payload for user event: missing id or email",
            evt.data,
          );
          return new Response("Error: Invalid user payload", { status: 400 });
        }
        await client.mutation(api.users.createOrUpdate, {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
        });
        console.log(`[ClerkWebhook] Processed user mutation for ${id}`);
        break;
      }
      case "user.deleted": {
        // Example of handling another event
        const { id } = evt.data;
        if (id) {
          // await client.mutation(api.users.delete, { clerkId: id });
          console.log(`[ClerkWebhook] Received user.deleted event for ${id}`);
        }
        break;
      }
      default: {
        console.log(`[ClerkWebhook] Received unhandled event type: ${eventType}`);
        break;
      }
    }
  } catch (dbError) {
    console.error("[ClerkWebhook] Database operation failed", {
      eventType,
      message: (dbError as Error)?.message,
      stack: (dbError as Error)?.stack,
    });
    return new Response("Internal Server Error: Failed to process webhook data", { status: 500 });
  }

  return new Response("Webhook processed", { status: 200 });
}

// Note: In Next.js 16 App Router, the bodyParser config is deprecated
// and no longer needed - body parsing is automatically disabled for webhooks
