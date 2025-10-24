#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761225830" \
  -H "svix-timestamp: 1761225830" \
  -H "svix-signature: v1,obeDmbw32aYiH/hoJM8u9pYPgwTacLbGCKqayBqouqc=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761225830.json
