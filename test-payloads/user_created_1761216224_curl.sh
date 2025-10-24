#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761216613" \
  -H "svix-timestamp: 1761216613" \
  -H "svix-signature: v1,e+uW43Ek8PRzeyjXlK6quLbhIoowd6qB/GtGr63dkb4=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761216224.json
