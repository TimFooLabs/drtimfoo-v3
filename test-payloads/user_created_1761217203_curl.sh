#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761217203" \
  -H "svix-timestamp: 1761217203" \
  -H "svix-signature: v1,EjcxbSCj3ZVT+LSSYManMNL1zSZlP9bDcZpCXEYspDQ=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761217203.json
