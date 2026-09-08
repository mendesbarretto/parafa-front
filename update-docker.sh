#!/bin/bash

set -e

echo "🔄 Update Parafa"

# Git pull
echo "📥 Atualizando código..."
git pull

# Verificar se mudou package.json
if git diff HEAD~1 HEAD --name-only | grep -q "package"; then
    echo "📦 Dependencies mudaram - rebuild completo"
    REBUILD="--no-cache"
else
    REBUILD=""
fi

# Deploy
echo "🚀 Redesployando..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build $REBUILD

echo "⏳ Aguardando..."
sleep 10

if docker ps | grep -q "parafa-frontend"; then
    echo "✅ Update OK!"
else
    echo "❌ Erro no update"
    docker logs parafa-frontend --tail 10
    exit 1
fi