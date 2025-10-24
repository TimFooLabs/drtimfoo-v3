#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761252840" \
  -H "svix-timestamp: 1761252840" \
  -H "svix-signature: v1,[dotenv@17.2.2] injecting env (0) from .env.local -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
OlEhKp/DxnIWG98ISU94SqHftwBZZ8baZOfLAiihGF0=" \
  -d @"test-payloads/user_created_1761252840_simple.json"
