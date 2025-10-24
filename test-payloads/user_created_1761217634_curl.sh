#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761217634" \
  -H "svix-timestamp: 1761217634" \
  -H "svix-signature: v1,l3aywdzuhvqBtoUvRWExANjGracO4h4hrvY1/7Isd/E=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761217634.json
