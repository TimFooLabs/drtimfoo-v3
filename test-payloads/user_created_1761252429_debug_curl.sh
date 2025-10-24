#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761252429" \
  -H "svix-timestamp: 1761252429" \
  -H "svix-signature: v1,[dotenv@17.2.2] injecting env (0) from .env.local -- tip: ⚙️  write to custom object with { processEnv: myObject }
7WaAFqH33V92cqECnbCDzlkhw9VaVdte07fx8K1wRvk=" \
  -d @"test-payloads/user_created_1761252429_simple.json"
