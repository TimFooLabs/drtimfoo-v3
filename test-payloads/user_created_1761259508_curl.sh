#!/bin/bash

# For debugging purposes. The -v flag shows request and response details.

curl -v -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "svix-id: msg_1761259508" \
  -H "svix-timestamp: 1761259508" \
  -H "svix-signature: v1,xcYxu2XO63U1wwnViNLE3tRPfipB4xm+LMDAc3BEudg=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761259508.json
