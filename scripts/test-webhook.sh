#!/bin/bash

# Test Webhook Script for Clerk
# Sends signed webhook payloads to the local webhook endpoint for verification testing.

set -euo pipefail

WEBHOOK_ENDPOINT_DEFAULT="http://localhost:3000/api/webhooks/clerk"
PAYLOAD_DIR="test-payloads"
LOG_DIR="test-logs"

# Source environment variables from .env.local or .env so the secret is available
if [[ -f ".env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env.local"
  set +a
elif [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
else
  echo "[test-webhook] No .env.local or .env found. Exiting." >&2
  exit 1
fi

if [[ -z "${CLERK_WEBHOOK_SIGNING_SECRET:-}" ]]; then
  echo "[test-webhook] CLERK_WEBHOOK_SIGNING_SECRET is not set." >&2
  exit 1
fi

mkdir -p "$PAYLOAD_DIR" "$LOG_DIR"

print_usage() {
  cat <<'EOF'
Usage: ./scripts/test-webhook.sh <command> [options]

Commands:
  test [event]          Send a test webhook for an event (default: user.created)
  send <payload.json>   Send a webhook using an existing JSON payload
  help                  Show this help message

Examples:
  ./scripts/test-webhook.sh test
  ./scripts/test-webhook.sh test user.updated
  ./scripts/test-webhook.sh send test-payloads/user.created.json
EOF
}

generate_payload() {
  local event_type=$1
  local timestamp
  timestamp=$(date +%s)

  case "$event_type" in
    user.created)
      cat <<EOF
{
  "data": {
    "id": "user_test_${timestamp}",
    "email_addresses": [
      {
        "email_address": "test-${timestamp}@example.com",
        "id": "idn_${timestamp}",
        "object": "email_address",
        "verification": { "status": "verified", "strategy": "ticket" }
      }
    ],
    "first_name": "Webhook",
    "last_name": "Test",
    "created_at": ${timestamp}000,
    "updated_at": ${timestamp}000,
    "object": "user"
  },
  "object": "event",
  "type": "user.created"
}
EOF
      ;;
    user.updated)
      cat <<EOF
{
  "data": {
    "id": "user_test_${timestamp}",
    "email_addresses": [
      {
        "email_address": "test-updated-${timestamp}@example.com",
        "id": "idn_${timestamp}",
        "object": "email_address",
        "verification": { "status": "verified", "strategy": "ticket" }
      }
    ],
    "first_name": "Webhook",
    "last_name": "Updated",
    "created_at": ${timestamp}000,
    "updated_at": ${timestamp}000,
    "object": "user"
  },
  "object": "event",
  "type": "user.updated"
}
EOF
      ;;
    *)
      echo "[test-webhook] Unsupported event type: $event_type" >&2
      return 1
      ;;
  esac
}

write_payload_to_file() {
  local event_type=$1
  local file_path=$2
  generate_payload "$event_type" >"$file_path"
  echo "[test-webhook] Generated payload: $file_path"
}

generate_signature_with_script() {
  local payload_file=$1
  local timestamp=$2
  local msg_id=$3

  if command -v bun >/dev/null 2>&1; then
    bun scripts/generate-svix-signature.js "$payload_file" "$timestamp" "$msg_id"
  elif command -v node >/dev/null 2>&1; then
    node scripts/generate-svix-signature.js "$payload_file" "$timestamp" "$msg_id"
  else
    echo "[test-webhook] Neither bun nor node is available to sign the payload." >&2
    exit 1
  fi
}

send_webhook() {
  local payload_file=$1
  local endpoint_url=${2:-$WEBHOOK_ENDPOINT_DEFAULT}

  local timestamp msg_id
  timestamp=$(date +%s)
  msg_id="msg_${timestamp}"

  echo ""
  echo "--- Sending Webhook ---"
  # stderr from the script will show here, but won't be captured by the `signature` variable
  local signature
  signature=$(generate_signature_with_script "$payload_file" "$timestamp" "$msg_id")

  if [[ -z "$signature" ]]; then
    echo "[test-webhook] ❌ Failed to generate signature. The script returned an empty string." >&2
    exit 1
  fi

  echo "  Endpoint : $endpoint_url"
  echo "  Payload  : $payload_file"
  echo "  Signature: ${signature:0:10}..." # Preview signature for brevity
  echo "-----------------------"

  local response
  response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST "$endpoint_url" \
    -H "svix-id: $msg_id" \
    -H "svix-timestamp: $timestamp" \
    -H "svix-signature: $signature" \
    -H "Content-Type: application/json" \
    --data-binary @"$payload_file" 2>&1)

  local http_status body_text
  http_status=$(echo "$response" | awk -F'HTTP_STATUS:' 'NF>1{print $2}')
  body_text=$(echo "$response" | sed -e 's/HTTP_STATUS:.*//g')

  # --- LOGGING RESTORED ---
  # Safely format the body for JSONL: compact if JSON, otherwise wrap in escaped quotes.
  local body_json
  body_json=$(echo "$body_text" | jq -c . 2>/dev/null || echo "\"$(echo "$body_text" | sed 's/"/\\"/g')\"")
  
  # Append the result to the log file
  {
    printf '{\n'
    printf '  "timestamp": %s,\n' "$timestamp"
    printf '  "event_type": "%s",\n' "$(jq -r '.type' "$payload_file")"
    printf '  "url": "%s",\n' "$endpoint_url"
    printf '  "msg_id": "%s",\n' "$msg_id"
    printf '  "http_status": %s,\n' "${http_status:-0}"
    printf '  "signature": "%s",\n' "$signature"
    printf '  "payload_file": "%s",\n' "$payload_file"
    printf '  "response_body": %s\n' "${body_json:-null}"
    printf '}\n'
  } >>"$LOG_DIR/webhook-sends.jsonl"
  # --- END OF RESTORED LOGIC ---

  echo "  HTTP status: $http_status"

  if [[ "$http_status" != "200" ]]; then
    echo "[test-webhook] ❌ Webhook call failed."
    echo "  Response body:"
    # Pretty print the body if it's JSON, otherwise just echo it
    echo "$body_text" | jq . 2>/dev/null || echo "$body_text"
    exit 1
  fi

  echo "[test-webhook] ✅ Webhook sent successfully."
}

main() {
  local command=${1:-help}
  shift || true
  case "$command" in
    test)
      local event_type=${1:-user.created}
      local payload_path="$PAYLOAD_DIR/${event_type//./_}_$(date +%s).json"
      write_payload_to_file "$event_type" "$payload_path"
      send_webhook "$payload_path"
      ;;
    send)
      local payload_file=${1:-}
      if [[ -z "$payload_file" || ! -f "$payload_file" ]]; then
        echo "[test-webhook] Payload file not provided or does not exist." >&2
        exit 1
      fi
      send_webhook "$payload_file"
      ;;
    help|--help|-h)
      print_usage
      ;;
    *)
      echo "[test-webhook] Unknown command: $command" >&2
      print_usage
      exit 1
      ;;
  esac
}

main "$@"