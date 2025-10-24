#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761247851" \
  -H "svix-timestamp: 1761247851" \
  -H "svix-signature: v1,D3nvb3W3JINtrSBURQ1RN9K7K3eJLppelmezHb20pxU=" \
  -d @"test-payloads/user_created_1761247851_simple.json"
