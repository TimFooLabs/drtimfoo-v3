#!/bin/bash

# For debugging purposes. The -v flag shows request and response details.

curl -v -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "svix-id: msg_1761254231" \
  -H "svix-timestamp: 1761254231" \
  -H "svix-signature: v1,8ix4UdL326UKV1s2zc99aOsF+SMD4sGAHa2pDY+o8w0=" \
  -H "Content-Type: application/json" \
  -d @test-payloads/user_created_1761253468_simple.json
