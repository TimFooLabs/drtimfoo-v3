#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761244320" \
  -H "svix-timestamp: 1761244320" \
  -H "svix-signature: v1,RoTgs0yq75Hq+XNRlrzkmT0yahes+1nJ4lzPPd+rM8Y=" \
  -d @"test-payloads/user_created_1761244320.json"
