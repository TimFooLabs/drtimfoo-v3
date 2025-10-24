#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761250711" \
  -H "svix-timestamp: 1761250711" \
  -H "svix-signature: v1,iWcywQ6s7VH1bMn8aD3s5EFPQu3MpjveuehyITjRNAU=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761244499_simple.json
