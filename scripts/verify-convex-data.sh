#!/bin/bash

# Verify Convex Data Script
# This script verifies data in Convex after webhook processing

set -e

# Source environment variables
if [ -f .env.local ]; then
    source .env.local
elif [ -f .env ]; then
    source .env
else
    echo "Error: .env.local or .env file not found"
    exit 1
fi

# Check required environment variables
if [ -z "$NEXT_PUBLIC_CONVEX_URL" ]; then
    echo "Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set"
    exit 1
fi

# Create test data directory if it doesn't exist
mkdir -p test-data
mkdir -p test-logs

# Function to query Convex via CLI
query_convex_cli() {
    local query_name=$1
    local args=$2
    
    echo "Querying Convex: $query_name $args"
    
    if [ -n "$args" ]; then
        response=$(npx convex query "$query_name" --json "$args" 2>/dev/null)
    else
        response=$(npx convex query "$query_name" --json 2>/dev/null)
    fi
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to query Convex. Make sure Convex dev server is running."
        return 1
    fi
    
    echo "$response"
    return 0
}

# Function to query Convex via HTTP API
query_convex_http() {
    local query_name=$1
    local args=$2
    
    echo "Querying Convex via HTTP: $query_name $args"
    
    # Get auth token (this might need to be configured based on your setup)
    # For development, you might not need auth
    local auth_header=""
    if [ -n "$CONVEX_ADMIN_KEY" ]; then
        auth_header="-H \"Authorization: Bearer $CONVEX_ADMIN_KEY\""
    fi
    
    local query_data="{\"path\": \"$query_name\""
    if [ -n "$args" ]; then
        query_data="$query_data, \"args\": $args"
    fi
    query_data="$query_data}"
    
    response=$(curl -s -X POST "$NEXT_PUBLIC_CONVEX_URL/query" \
        -H "Content-Type: application/json" \
        $auth_header \
        -d "$query_data")
    
    if echo "$response" | grep -q "error"; then
        echo "Error: Failed to query Convex via HTTP"
        echo "Response: $response"
        return 1
    fi
    
    echo "$response"
    return 0
}

# Function to get user by Clerk ID
get_user_by_clerk_id() {
    local clerk_id=$1
    
    echo "Getting user by Clerk ID: $clerk_id"
    
    # Try CLI first
    local response=$(query_convex_cli "users.getByClerkId" "{\"clerkId\": \"$clerk_id\"}" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    # Fallback to HTTP
    response=$(query_convex_http "users.getByClerkId" "{\"clerkId\": \"$clerk_id\"}")
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    echo "User not found with Clerk ID: $clerk_id"
    return 1
}

# Function to get user by ID
get_user_by_id() {
    local user_id=$1
    
    echo "Getting user by ID: $user_id"
    
    # Try CLI first
    local response=$(query_convex_cli "users.get" "{\"id\": \"$user_id\"}" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    # Fallback to HTTP
    response=$(query_convex_http "users.get" "{\"id\": \"$user_id\"}")
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    echo "User not found with ID: $user_id"
    return 1
}

# Function to list all users
list_all_users() {
    echo "Listing all users in Convex..."
    
    # Try CLI first
    local response=$(query_convex_cli "users.list" "{}" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    # Fallback to HTTP
    response=$(query_convex_http "users.list" "{}")
    
    if [ $? -eq 0 ] && [ -n "$response" ] && [ "$response" != "null" ]; then
        echo "$response"
        return 0
    fi
    
    echo "Failed to list users"
    return 1
}

# Function to verify user was created from webhook
verify_webhook_user_creation() {
    local clerk_id=$1
    local expected_email=$2
    local expected_name=$3
    
    echo "Verifying user creation from webhook..."
    echo "Clerk ID: $clerk_id"
    echo "Expected Email: $expected_email"
    echo "Expected Name: $expected_name"
    
    local user_data=$(get_user_by_clerk_id "$clerk_id")
    
    if [ $? -eq 0 ]; then
        echo "✅ User found in Convex"
        
        # Extract user details
        local email=$(echo "$user_data" | jq -r '.email // "null"')
        local name=$(echo "$user_data" | jq -r '.name // "null"')
        local created_at=$(echo "$user_data" | jq -r '_creationTime // "null"')
        
        echo "User Details:"
        echo "  Email: $email"
        echo "  Name: $name"
        echo "  Created At: $created_at"
        
        # Verify expected values
        local verification_passed=true
        
        if [ "$expected_email" != "null" ] && [ "$email" != "$expected_email" ]; then
            echo "❌ Email mismatch: expected $expected_email, got $email"
            verification_passed=false
        fi
        
        if [ "$expected_name" != "null" ] && [ "$name" != "$expected_name" ]; then
            echo "❌ Name mismatch: expected $expected_name, got $name"
            verification_passed=false
        fi
        
        if [ "$verification_passed" = true ]; then
            echo "✅ User data verification passed"
            
            # Log successful verification
            log_entry="{
                \"timestamp\": $(date +%s),
                \"clerk_id\": \"$clerk_id\",
                \"verification\": \"passed\",
                \"user_data\": $user_data
            }"
            echo "$log_entry" >> test-logs/convex-verification.jsonl
            
            return 0
        else
            echo "❌ User data verification failed"
            
            # Log failed verification
            log_entry="{
                \"timestamp\": $(date +%s),
                \"clerk_id\": \"$clerk_id\",
                \"verification\": \"failed\",
                \"user_data\": $user_data
            }"
            echo "$log_entry" >> test-logs/convex-verification.jsonl
            
            return 1
        fi
    else
        echo "❌ User not found in Convex"
        
        # Log failed verification
        log_entry="{
            \"timestamp\": $(date +%s),
            \"clerk_id\": \"$clerk_id\",
            \"verification\": \"not_found\"
        }"
        echo "$log_entry" >> test-logs/convex-verification.jsonl
        
        return 1
    fi
}

# Function to verify last created user
verify_last_created_user() {
    if [ -f test-data/last_created_user_id.txt ]; then
        local clerk_id=$(cat test-data/last_created_user_id.txt)
        echo "Found last created user ID: $clerk_id"
        
        # Try to get expected values from the user data file
        local user_data_file="test-data/user_${clerk_id}.json"
        local expected_email="null"
        local expected_name="null"
        
        if [ -f "$user_data_file" ]; then
            expected_email=$(jq -r '.email_addresses[0].email_address' "$user_data_file")
            expected_name=$(jq -r '.first_name + " " + .last_name' "$user_data_file")
        fi
        
        verify_webhook_user_creation "$clerk_id" "$expected_email" "$expected_name"
    else
        echo "No last created user found. Please create a user first using test-user-creation.sh"
        return 1
    fi
}

# Function to show verification logs
show_verification_logs() {
    local count=${1:-10}
    
    echo "Recent $count verification logs:"
    tail -n "$count" test-logs/convex-verification.jsonl | while IFS= read -r line; do
        timestamp=$(echo "$line" | jq -r '.timestamp')
        clerk_id=$(echo "$line" | jq -r '.clerk_id')
        verification=$(echo "$line" | jq -r '.verification')
        echo "  $(date -d "@$timestamp" 2>/dev/null || date -r "$timestamp" 2>/dev/null || echo "$timestamp"): $clerk_id ($verification)"
    done
}

# Function to open Convex dashboard
open_dashboard() {
    echo "Opening Convex dashboard..."
    npx convex dashboard
}

# Main script logic
case "${1:-verify}" in
    "verify")
        if [ -n "$2" ]; then
            clerk_id=$2
            expected_email=$3
            expected_name=$4
            verify_webhook_user_creation "$clerk_id" "$expected_email" "$expected_name"
        else
            verify_last_created_user
        fi
        ;;
    "get")
        if [ -n "$2" ]; then
            if [ "$2" = "--clerk-id" ] && [ -n "$3" ]; then
                get_user_by_clerk_id "$3"
            elif [ "$2" = "--id" ] && [ -n "$3" ]; then
                get_user_by_id "$3"
            else
                echo "Usage: $0 get --clerk-id <clerk_id> | --id <user_id>"
                exit 1
            fi
        else
            echo "Usage: $0 get --clerk-id <clerk_id> | --id <user_id>"
            exit 1
        fi
        ;;
    "list")
        list_all_users
        ;;
    "logs")
        show_verification_logs "$2"
        ;;
    "dashboard")
        open_dashboard
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  verify [clerk_id] [email] [name]     Verify user was created from webhook"
        echo "  get --clerk-id <clerk_id>           Get user by Clerk ID"
        echo "  get --id <user_id>                  Get user by Convex ID"
        echo "  list                                List all users"
        echo "  logs [count]                        Show verification logs"
        echo "  dashboard                           Open Convex dashboard"
        echo "  help                                Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 verify                           # Verify last created user"
        echo "  $0 verify user_123abc test@example.com \"Test User\""
        echo "  $0 get --clerk-id user_123abc"
        echo "  $0 get --id abc123def"
        echo "  $0 list"
        echo "  $0 logs 5"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac