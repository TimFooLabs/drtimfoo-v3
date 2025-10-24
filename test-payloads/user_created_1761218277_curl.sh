#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761218277" \
  -H "svix-timestamp: 1761218277" \
  -H "svix-signature: v1,avKk19om7aFhYteOY0QpAz2fODsYW3eBwd36vb4VoTY=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761218277.json
