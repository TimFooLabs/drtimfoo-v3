#!/bin/bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_1761218357" \
  -H "svix-timestamp: 1761218357" \
  -H "svix-signature: v1,VMDc/G+aP8DTN+MuB4TgempiHtW5WgLjob/RjNprH/k=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761218357.json
