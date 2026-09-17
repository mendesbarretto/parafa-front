#!/bin/bash

set -e

echo "🐳 Atualizando Parafa Frontend"

: "${FRONTEND_IMAGE:?Defina FRONTEND_IMAGE com o nome da imagem pronta}"

echo "📦 Baixando imagem..."
docker pull "$FRONTEND_IMAGE"
docker tag "$FRONTEND_IMAGE" parafa-frontend:latest

docker rm -f parafa-frontend 2>/dev/null || true

echo "▶️  Iniciando frontend..."
docker-compose up -d --no-build frontend

curl --fail --retry 10 --retry-delay 2 http://localhost:3000/api/health
echo "✅ Deploy OK: http://localhost:3000"