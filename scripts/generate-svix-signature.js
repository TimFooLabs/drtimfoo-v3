#!/usr/bin/env node

/**
 * Svix Signature Generation Script (Final Version)
 * 
 * This script generates Svix-compatible signatures for webhook testing.
 * It is designed for both manual and programmatic use.
 * 
 * - All informational logs and errors are sent to stderr.
 * - The final, clean signature string is sent to stdout for programmatic capture.
 */

const crypto = require('crypto');
const fs = require('fs');

// --- Main logic wrapped in a function for clarity ---
function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('Usage: node generate-svix-signature.js <payload_file> [timestamp] [msg_id]');
        console.error('');
        console.error('Arguments:');
        console.error('  payload_file  Path to JSON payload file');
        console.error('  timestamp     Unix timestamp (optional, defaults to current time)');
        console.error('  msg_id        Message ID (optional, defaults to "msg_<timestamp>")');
        process.exit(1);
    }

    const payloadFile = args[0];
    const timestamp = args[1] || Math.floor(Date.now() / 1000);
    const msgId = args[2] || `msg_${timestamp}`;

    loadEnvFile();

    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!webhookSecret) {
        console.error('[ERROR] CLERK_WEBHOOK_SIGNING_SECRET environment variable is not set.');
        console.error('[INFO] Make sure this variable is set in your .env.local or .env file.');
        process.exit(1);
    }

    if (!fs.existsSync(payloadFile)) {
        console.error(`[ERROR] Payload file not found: ${payloadFile}`);
        process.exit(1);
    }

    try {
        const payloadString = fs.readFileSync(payloadFile, 'utf8');
        
        console.error(`[INFO] Generating signature for payload: ${payloadFile}`);
        console.error(`[INFO] Message ID: ${msgId}, Timestamp: ${timestamp}`);
        
        // The signed content string must be in the format: msgId.timestamp.payload
        const signedContent = `${msgId}.${timestamp}.${payloadString}`;

        // Svix secrets are base64-encoded and prefixed with "whsec_".
        // We must strip the prefix to get the key for HMAC signing.
        const rawSecret = webhookSecret.replace(/^whsec_/, '');
        const secretBuffer = Buffer.from(rawSecret, 'base64');

        if (secretBuffer.length === 0) {
            throw new Error('CLERK_WEBHOOK_SIGNING_SECRET is not a valid base64 string after stripping prefix.');
        }

        const signature = crypto
            .createHmac('sha256', secretBuffer)
            .update(signedContent, 'utf8')
            .digest('base64');
        
        const signatureHeader = `v1,${signature}`;
        
        // --- THE FIX ---
        // Print ONLY the final signature to stdout.
        // This is what the calling shell script will capture.
        process.stdout.write(signatureHeader);
        
        // Log all helpful extras to stderr for manual debugging.
        console.error(`\n\n[DEBUG] Generated signature: ${signatureHeader}`);
        const curlFile = generateCurlScript(payloadFile, msgId, timestamp, signatureHeader);
        console.error(`[DEBUG] Debug curl command saved to: ${curlFile}`);

    } catch (error) {
        console.error(`\n[ERROR] Failed to generate signature: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Loads environment variables from .env.local or .env.
 * Note: This is a simplified implementation. For complex cases, a library like `dotenv` is recommended.
 */
function loadEnvFile() {
    const envFiles = ['.env.local', '.env'];
    for (const envFile of envFiles) {
        if (fs.existsSync(envFile)) {
            const envContent = fs.readFileSync(envFile, 'utf8');
            const lines = envContent.split('\n');
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, ...valueParts] = trimmedLine.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                        if (!process.env[key]) { // Do not override existing env vars
                            process.env[key] = value;
                        }
                    }
                }
            }
            return;
        }
    }
}

/**
 * Generates and saves a verbose curl command script for debugging.
 * @returns {string} The path to the generated script.
 */
function generateCurlScript(payloadFile, msgId, timestamp, signatureHeader) {
    // --- ENHANCEMENT: Added -v (verbose) flag for better debugging ---
    const curlCommand = `curl -v -X POST "http://localhost:3000/api/webhooks/clerk" \\
  -H "svix-id: ${msgId}" \\
  -H "svix-timestamp: ${timestamp}" \\
  -H "svix-signature: ${signatureHeader}" \\
  -H "Content-Type: application/json" \\
  -d @${payloadFile}`;
    
    const curlFile = payloadFile.replace('.json', '_curl.sh');
    fs.writeFileSync(curlFile, `#!/bin/bash\n\n# For debugging purposes. The -v flag shows request and response details.\n\n${curlCommand}\n`);
    fs.chmodSync(curlFile, '755');
    return curlFile;
}

// --- Run the main function ---
main();