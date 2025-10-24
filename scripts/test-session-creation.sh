#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo "[INFO] Clerk Session Token Test Script"
echo "=============================================="

if [[ -z "${CLERK_SECRET_KEY:-}" ]]; then
  echo "[ERROR] CLERK_SECRET_KEY not set in environment."
  exit 1
fi

API_BASE="https://api.clerk.dev/v1"
LOG_DIR="test-logs"
mkdir -p "$LOG_DIR"

get_last_created_user() {
  echo "[INFO] Fetching last created user..."
  response=$(curl -s -X GET "$API_BASE/users?limit=1" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY")

  if ! echo "$response" | jq empty >/dev/null 2>&1; then
    echo "[ERROR] Invalid JSON from Clerk API:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  user_id=$(echo "$response" | jq -r '.[0].id // empty')
  if [[ -z "$user_id" ]]; then
    echo "[ERROR] No users found."
    exit 1
  fi
  echo "[SUCCESS] Last user: $user_id"
}

create_session() {
  local user_id=$1
  echo "[INFO] Creating session for $user_id"

  response=$(curl -s -X POST "$API_BASE/sessions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY" \
    -d "{\"user_id\": \"$user_id\"}")

  if ! echo "$response" | jq empty >/dev/null 2>&1; then
    echo "[ERROR] Invalid JSON from Clerk API:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  session_id=$(echo "$response" | jq -r '.id // empty')
  if [[ -z "$session_id" ]]; then
    echo "[ERROR] Failed to create session:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  echo "[SUCCESS] Created session: $session_id"
}

get_session_token() {
  local session_id=$1
  echo "[INFO] Fetching session token for $session_id"

  response=$(curl -s -X GET "$API_BASE/sessions/$session_id" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY")

  if ! echo "$response" | jq empty >/dev/null 2>&1; then
    echo "[ERROR] Invalid JSON from Clerk API:"
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  # Try to get the token from different possible locations
  token=$(echo "$response" | jq -r '.last_active_token?.jwt_token // empty')
  
  if [[ -z "$token" ]]; then
    # Try alternative location
    token=$(echo "$response" | jq -r '.token?.jwt // empty')
  fi
  
  if [[ -z "$token" ]]; then
    echo "[WARN] No active token found — creating a new session token..."
    # Create a new token for this session using the correct endpoint
    token_response=$(curl -s -X POST "$API_BASE/sessions/$session_id/tokens" \
      -H "Authorization: Bearer $CLERK_SECRET_KEY" \
      -H "Content-Type: application/json")
    
    if echo "$token_response" | jq empty >/dev/null 2>&1; then
      token=$(echo "$token_response" | jq -r '.jwt // empty')
    fi
    
    # If still no token, try the alternative approach
    if [[ -z "$token" ]]; then
      echo "[WARN] Token creation failed, trying alternative approach..."
      # Try to create a client token for the session
      client_response=$(curl -s -X GET "$API_BASE/sessions/$session_id/client" \
        -H "Authorization: Bearer $CLERK_SECRET_KEY")
      
      if echo "$client_response" | jq empty >/dev/null 2>&1; then
        client_id=$(echo "$client_response" | jq -r '.id // empty')
        if [[ -n "$client_id" ]]; then
          # Create a token for the client
          token_response=$(curl -s -X POST "$API_BASE/clients/$client_id/tokens" \
            -H "Authorization: Bearer $CLERK_SECRET_KEY" \
            -H "Content-Type: application/json")
          
          if echo "$token_response" | jq empty >/dev/null 2>&1; then
            token=$(echo "$token_response" | jq -r '.jwt // empty')
          fi
        fi
      fi
    fi
  fi

  if [[ -z "$token" ]]; then
    echo "[ERROR] Session token still not available."
    echo "$response" | tee -a "$LOG_DIR/error.log"
    return 1
  fi

  echo "[SUCCESS] Retrieved token: ${token:0:20}..."
  echo "$token" > "$LOG_DIR/last-session-token.txt"
}

# Execute test steps
get_last_created_user
create_session "$user_id"
get_session_token "$session_id"

echo "[INFO] Session creation and token retrieval successful."
