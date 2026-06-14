#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-device}"

if [ "$TARGET" = "emulator" ]; then
  API_URL="http://10.0.2.2:5000"
else
  LAPTOP_IP="$(ip route get 1.1.1.1 | awk '{for (i=1; i<=NF; i++) if ($i=="src") {print $(i+1); exit}}')"
  API_URL="http://${LAPTOP_IP}:5000"
fi

echo "Starting backend..."
docker compose up -d --build backend

echo "Backend URL for app: ${API_URL}"

cd frontend/TeamMakerApp

EXPO_PUBLIC_API_URL="${API_URL}" \
EXPO_NO_DEV_TOOLS=1 \
BROWSER=none \
npx expo run:android
