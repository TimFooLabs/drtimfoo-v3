#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo "[INFO] Clerk User Creation Test Script"
echo "=============================================="

if [[ -z "${CLERK_SECRET_KEY:-}" ]]; then
  echo "[ERROR] CLERK_SECRET_KEY not set in environment."
  exit 1
fi

API_BASE="https://api.clerk.dev/v1"
LOG_DIR="test-logs"
mkdir -p "$LOG_DIR"

create_test_user() {
  local email=$1
  local first_name=$2
  local last_name=$3
  local password=$4

  if [[ -z "$password" ]]; then
    password="Auto$(date +%s%N | sha1sum | cut -c1-10)!A"
  fi

  echo "[INFO] Creating test user: $email"

  # Delete existing user (cleanup)
  existing=$(curl -s -X GET "$API_BASE/users?email_address=$email" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY" | jq -r '.[0].id // empty')

  if [[ -n "$existing" ]]; then
    echo "[WARN] Existing user found ($existing), deleting..."
    curl -s -X DELETE "$API_BASE/users/$existing" \
      -H "Authorization: Bearer $CLERK_SECRET_KEY" >/dev/null
    sleep 1
  fi

  response=$(curl -s -X POST "$API_BASE/users" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY" \
    -d "{
      \"email_address\": [\"$email\"],
      \"first_name\": \"$first_name\",
      \"last_name\": \"$last_name\",
      \"username\": \"${email%@*}\",
      \"password\": \"$password\"
    }")

  # Validate JSON
  if ! echo "$response" | jq empty >/dev/null 2>&1; then
    echo "[ERROR] Invalid JSON from Clerk API:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  # Check for errors
  local error_msg
  error_msg=$(echo "$response" | jq -r '.errors[0].message // empty')
  if [[ -n "$error_msg" ]]; then
    echo "[ERROR] Clerk API error: $error_msg"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  local user_id
  user_id=$(echo "$response" | jq -r '.id // empty')
  if [[ -z "$user_id" ]]; then
    echo "[ERROR] Failed to extract user_id from response:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  echo "[SUCCESS] Created user $email (ID: $user_id)"
}

# Test users
users=(
  "test1@example.com:Test:User1:"
  "test2@example.com:Test:User2:"
  "test3@example.com:Test:User3:"
  "webhook@example.com:Webhook:Test:"
  "automation@example.com:Automation:Test:"
)

for u in "${users[@]}"; do
  IFS=":" read -r email fname lname pwd <<<"$u"
  create_test_user "$email" "$fname" "$lname" "$pwd"
done

echo "[INFO] All user creation tests completed."
