#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761235888" \
  -H "svix-timestamp: 1761235888" \
  -H "svix-signature: v1,+95MVydXf6gEUevfFSOkI7yTT2AqdcodEnhxn6yHgOg=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user.created.json
