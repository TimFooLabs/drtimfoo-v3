#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761228776" \
  -H "svix-timestamp: 1761228776" \
  -H "svix-signature: v1,v0hvCJnGEiT5f2kUnNjBbfOHFxTRILViScCWpLHXtm8=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761228776.json
