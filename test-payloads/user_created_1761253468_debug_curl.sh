#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761253468" \
  -H "svix-timestamp: 1761253468" \
  -H "svix-signature: v1,CcMak8jNoi9axRugvEkdZ5CC97k9FZpsZzT19cXsoy4=" \
  -d @"test-payloads/user_created_1761253468_simple.json"
