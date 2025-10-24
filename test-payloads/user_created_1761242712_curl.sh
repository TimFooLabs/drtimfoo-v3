#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761242712" \
  -H "svix-timestamp: 1761242712" \
  -H "svix-signature: v1,4yb5GrOPdUalzP2zJD+PIQioFYhvgH5SPxL3YZfokUs=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761242712.json
