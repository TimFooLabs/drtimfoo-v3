#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761236130" \
  -H "svix-timestamp: 1761236130" \
  -H "svix-signature: v1,bstVzRZl53YANwnAjHE+xg9Vy1rhEAndqHZWLJbUn+M=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761236130.json
