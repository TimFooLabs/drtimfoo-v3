#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761257146" \
  -H "svix-timestamp: 1761257146" \
  -H "svix-signature: v1," \
  -d @"test-payloads/user_created_1761257146_simple.json"
