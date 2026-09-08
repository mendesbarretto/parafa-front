#!/bin/bash

set -e

echo "🐳 Deploy Parafa Frontend"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Parar containers
echo "⏸️  Parando aplicação..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build e subir
echo "🚀 Build e deploy..."
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar
echo "⏳ Aguardando..."
sleep 10

# Verificar
if docker ps | grep -q "parafa-frontend"; then
    echo "✅ Deploy OK!"
    echo "🌐 http://localhost:3000"
else
    echo "❌ Erro no deploy"
    docker logs parafa-frontend --tail 10
    exit 1
fi