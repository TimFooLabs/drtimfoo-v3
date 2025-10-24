#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761235849" \
  -H "svix-timestamp: 1761235849" \
  -H "svix-signature: v1,qVQmV6F2W3qVAnXtek6lfDSR1pGKgmih8oFovqa2n1w=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761235849.json
