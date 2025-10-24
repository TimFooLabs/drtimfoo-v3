#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761253246" \
  -H "svix-timestamp: 1761253246" \
  -H "svix-signature: v1,[dotenv@17.2.2] injecting env (0) from .env.local -- tip: ⚙️  write to custom object with { processEnv: myObject }
x4I8QkHxC0eGqe+opQmrcnV+mfBaQc3LNlCF4yqgZRY=" \
  -d @"test-payloads/user_created_1761253246_simple.json"
