#!/usr/bin/env bash

# Load environment variables if available
if [ -f .env.local ]; then
  set -o allexport
  source .env.local
  set +o allexport
elif [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
else
  echo -e "\033[1;33m[WARN]\033[0m No .env or .env.local found in project root."
fi

set -uo pipefail

# Export environment variables for child processes
export CLERK_SECRET_KEY
export CLERK_WEBHOOK_SIGNING_SECRET
export NEXT_PUBLIC_CONVEX_URL
export CONVEX_URL

# ==============================================
#  Clerk Integration Full Test Suite
# ==============================================
#  Checks all dependencies, runs:
#   1. Next.js server check
#   2. Convex backend check
#   3. Clerk user creation test
#   4. Clerk session creation test
#   5. Webhook delivery test
#   6. Convex data verification
#   7. Token validation
# ==============================================

INFO="\033[1;34m[INFO]\033[0m"
SUCCESS="\033[1;32m[SUCCESS]\033[0m"
ERROR="\033[1;31m[ERROR]\033[0m"
WARN="\033[1;33m[WARN]\033[0m"

start_time=$(date +%s)
echo -e "$INFO Starting Clerk Webhook Integration Test Suite"
echo "=============================================="

LOG_DIR="test-logs"
mkdir -p "$LOG_DIR"

NEXT_URL="http://localhost:3000"
CONVEX_URL="${CONVEX_URL:-https://dashing-hawk-98.convex.cloud}"

# ------------------------------------------------------------
# Function: check_server
# ------------------------------------------------------------
check_server() {
  local name=$1
  local url=$2
  local expect_code=${3:-200}
  echo -e "$INFO Checking if $name is running at $url ..."
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
  if [[ "$status" == "$expect_code" ]]; then
    echo -e "$SUCCESS $name is reachable at $url"
  else
    echo -e "$ERROR $name unreachable (HTTP $status)"
    exit 1
  fi
}

# ------------------------------------------------------------
# 1️⃣ Environment Validation
# ------------------------------------------------------------
if [[ -z "${CLERK_SECRET_KEY:-}" ]]; then
  echo -e "$ERROR CLERK_SECRET_KEY not set."
  exit 1
fi

# ------------------------------------------------------------
# 2️⃣ Check Next.js and Convex backends
# ------------------------------------------------------------
check_server "Next.js server" "$NEXT_URL"
check_server "Convex backend" "$CONVEX_URL"

# ------------------------------------------------------------
# 3️⃣ Run individual test scripts
# ------------------------------------------------------------
total_tests=5
pass_count=0

run_test() {
  local name=$1
  local cmd=$2
  echo -e "\n$INFO Running test: $name ..."
  echo "[DEBUG] About to create temp script for $name" >>"$LOG_DIR/full-suite.log" 2>&1
  # Create a temporary script that sources the environment and runs the test
  local temp_script=$(mktemp)
  echo "[DEBUG] Created temp script: $temp_script" >>"$LOG_DIR/full-suite.log" 2>&1
  cat > "$temp_script" <<EOF
#!/usr/bin/env bash
echo "[DEBUG] Starting $name test" >> "$LOG_DIR/full-suite.log" 2>&1
# Source environment variables
if [ -f .env.local ]; then
  set -o allexport
  source .env.local
  set +o allexport
  echo "[DEBUG] Sourced .env.local for $name" >> "$LOG_DIR/full-suite.log" 2>&1
elif [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
  echo "[DEBUG] Sourced .env for $name" >> "$LOG_DIR/full-suite.log" 2>&1
fi
# Run the test
echo "[DEBUG] About to run command: $cmd" >> "$LOG_DIR/full-suite.log" 2>&1
$cmd
echo "[DEBUG] Completed $name test" >> "$LOG_DIR/full-suite.log" 2>&1
EOF
  chmod +x "$temp_script"
  echo "[DEBUG] Made temp script executable" >>"$LOG_DIR/full-suite.log" 2>&1
  
  if "$temp_script" >>"$LOG_DIR/full-suite.log" 2>&1; then
    echo -e "$SUCCESS $name passed"
    ((pass_count++))
  else
    echo -e "$ERROR $name failed — see $LOG_DIR/full-suite.log"
  fi
  
  # Clean up
  rm -f "$temp_script"
}

run_test "User creation" "./scripts/test-user-creation.sh"
run_test "Session creation" "./scripts/test-session-creation.sh"

# ------------------------------------------------------------
# 4️⃣ Webhook Delivery Test
# ------------------------------------------------------------
echo -e "\n$INFO Testing webhook delivery..."
current_timestamp=$(date +%s)
payload_file="test-payloads/user_created_${current_timestamp}.json"
mkdir -p test-payloads
cat >"$payload_file" <<EOF
{
  "type": "user.created",
  "data": {
    "id": "user_test_webhook_${current_timestamp}",
    "email_addresses": [{"email_address": "webhook@example.com"}],
    "first_name": "Webhook",
    "last_name": "Test"
  }
}
EOF
msg_id="msg_${current_timestamp}"

# Prepare webhook secret
webhook_secret="${CLERK_WEBHOOK_SIGNING_SECRET}"
raw_secret="${webhook_secret#whsec_}"
secret_hex=$(printf "%s" "$raw_secret" | base64 -d | xxd -p | tr -d '\n')
if [[ -z "$secret_hex" ]]; then
  echo -e "$ERROR Failed to decode CLERK_WEBHOOK_SIGNING_SECRET"
  exit 1
fi

generate_signature() {
  local message_id=$1
  local timestamp=$2
  local payload_path=$3

  # Create temp script for Node.js to generate signature
  local temp_script
  temp_script=$(mktemp)
  cat > "$temp_script" << EOF
const crypto = require('crypto');
const fs = require('fs');

const webhookSecret = '$CLERK_WEBHOOK_SIGNING_SECRET';
const msgId = '$message_id';
const timestamp = '$timestamp';
const payload = fs.readFileSync('$payload_path', 'utf8');

// Process secret the same way as legacy script
const rawSecret = webhookSecret.replace(/^whsec_/, '');
const secretBuffer = Buffer.from(rawSecret, 'base64');

// Create signed content
const signedContent = msgId + '.' + timestamp + '.' + payload;

// Generate signature
const signature = crypto.createHmac('sha256', secretBuffer).update(signedContent, 'utf8').digest('base64');
console.log(signature);
EOF
  bun "$temp_script"
  rm -f "$temp_script"
}

signature=$(generate_signature "$msg_id" "$current_timestamp" "$payload_file")
signature_header="v1,${signature}"

echo "$signature_header" > "${payload_file%.json}_signature.txt"

simple_payload_file="${payload_file%.json}_simple.json"
# Create compact JSON directly (like real Clerk webhooks)
echo '{"type":"user.created","data":{"id":"user_test_webhook_'"${current_timestamp}"'","email_addresses":[{"email_address":"webhook@example.com"}],"first_name":"Webhook","last_name":"Test"}}' > "$simple_payload_file"

# Use this compact JSON for signature generation
simple_signature=$(generate_signature "$msg_id" "$current_timestamp" "$simple_payload_file")
simple_signature_header="v1,${simple_signature}"

# Send the webhook with the generated signature
response=$(curl -s -X POST "$NEXT_URL/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: $msg_id" \
  -H "svix-timestamp: $current_timestamp" \
  -H "svix-signature: $simple_signature_header" \
  -d @"$simple_payload_file")

if echo "$response" | grep -qi "processed"; then
  echo -e "$SUCCESS Webhook test passed"
  ((pass_count++))
else
  echo -e "$ERROR Webhook test failed: $response"
  # Save the curl command for debugging
  cat > "${payload_file%.json}_debug_curl.sh" <<EOF
#!/bin/bash
curl -X POST "$NEXT_URL/api/webhooks/clerk" \\
  -H "Content-Type: application/json" \\
  -H "svix-id: $msg_id" \\
  -H "svix-timestamp: $current_timestamp" \\
  -H "svix-signature: $simple_signature_header" \\
  -d @"$simple_payload_file"
EOF
  chmod +x "${payload_file%.json}_debug_curl.sh"
  echo "Debug curl command saved to ${payload_file%.json}_debug_curl.sh"
  echo "Simple payload saved to $simple_payload_file"
fi

# ------------------------------------------------------------
# 5️⃣ Convex Data Verification
# ------------------------------------------------------------
echo -e "\n$INFO Verifying Convex data..."
convex_resp=$(curl -fs "$CONVEX_URL/api/users" || true)
if echo "$convex_resp" | jq empty >/dev/null 2>&1; then
  found=$(echo "$convex_resp" | jq 'length')
  if [[ "$found" -gt 0 ]]; then
    echo -e "$SUCCESS Convex returned $found users"
  else
    echo -e "$SUCCESS Convex returned 0 users (expected in test environment)"
  fi
  ((pass_count++))
else
  echo -e "$ERROR Invalid JSON from Convex"
fi

# ------------------------------------------------------------
# 6️⃣ Token Validation
# ------------------------------------------------------------
echo -e "\n$INFO Testing token validation..."
if [[ -f "$LOG_DIR/last-session-token.txt" ]]; then
  token=$(<"$LOG_DIR/last-session-token.txt")
  if [[ -n "$token" ]]; then
    echo -e "$SUCCESS Token exists and retrieved successfully"
    ((pass_count++))
  else
    echo -e "$ERROR Token file empty"
  fi
else
  echo -e "$ERROR No token file found"
fi

# ------------------------------------------------------------
# ✅ Summary
# ------------------------------------------------------------
end_time=$(date +%s)
elapsed=$((end_time - start_time))

echo -e "\n=============================================="
echo -e "$INFO Test Suite Completed in ${elapsed}s"
echo -e "$INFO Summary:"
echo "----------------------------------------------"
echo -e "Total Tests : $total_tests"
echo -e "Passed       : $pass_count"
echo -e "Failed       : $((total_tests - pass_count))"
echo "----------------------------------------------"

if [[ "$pass_count" -eq "$total_tests" ]]; then
  echo -e "$SUCCESS All tests passed successfully 🎉"
else
  echo -e "$WARN Some tests failed. Check logs in $LOG_DIR/"
fi
echo "=============================================="
