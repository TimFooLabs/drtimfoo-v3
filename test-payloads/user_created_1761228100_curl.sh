#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761228100" \
  -H "svix-timestamp: 1761228100" \
  -H "svix-signature: v1,Tzdqe/Zy4Uc3w0qtWfoT324R3GRI60ikqnjyDZwYGao=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761228100.json
