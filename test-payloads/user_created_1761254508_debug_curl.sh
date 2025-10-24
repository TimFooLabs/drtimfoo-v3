#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761254508" \
  -H "svix-timestamp: 1761254508" \
  -H "svix-signature: v1,rCkNo+L2rYzt5whyCYQJvMGy+SCqjrGA0JRbvm2fnrk=" \
  -d @"test-payloads/user_created_1761254508_simple.json"
