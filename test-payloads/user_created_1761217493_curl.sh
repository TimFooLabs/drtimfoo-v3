#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761217493" \
  -H "svix-timestamp: 1761217493" \
  -H "svix-signature: v1,/mJZPO0Y7MKtN7tG+EL8z/BzFxz68Bv+aaK6xiwjL8E=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761217493.json
