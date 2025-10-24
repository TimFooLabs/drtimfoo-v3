#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761225973" \
  -H "svix-timestamp: 1761225973" \
  -H "svix-signature: v1,eVdof+DHSjmSc5IDNZ5u/XjexFgvfH4E1RUXkCrIa9c=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761225973.json
