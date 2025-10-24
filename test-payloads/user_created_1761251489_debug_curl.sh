#!/bin/bash
curl -X POST "http://localhost:3000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_1761251489" \
  -H "svix-timestamp: 1761251489" \
  -H "svix-signature: v1,[dotenv@17.2.2] injecting env (0) from .env.local -- tip: 📡 version env with Radar: https://dotenvx.com/radar
GcGOYm9IidpIEHejIZ9MFx+e4V4jeup7KpKH7lhcdsI=" \
  -d @"test-payloads/user_created_1761251489_simple.json"
