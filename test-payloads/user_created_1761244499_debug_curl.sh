#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761244499" \
  -H "svix-timestamp: 1761244499" \
  -H "svix-signature: v1,O1351BfFM3yz1EpI0/ktQQ9f/js605hpkEg11dOTnCQ=" \
  -d @"test-payloads/user_created_1761244499_simple.json"
