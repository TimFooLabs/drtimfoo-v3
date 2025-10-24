#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761253356" \
  -H "svix-timestamp: 1761253356" \
  -H "svix-signature: v1," \
  -d @"test-payloads/user_created_1761253356_simple.json"
