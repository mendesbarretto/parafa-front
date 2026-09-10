#!/bin/bash

set -e

echo "🐳 Deploy Simples - Build no Docker"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Parar containers
echo "⏸️  Parando aplicação..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Build e subir
echo "🚀 Build e deploy..."
docker-compose -f docker-compose.simple.yml up -d --build

# Aguardar
echo "⏳ Aguardando..."
sleep 15

# Verificar
if docker ps | grep -q "parafa-frontend"; then
    echo "✅ Deploy OK!"
    echo "🌐 http://localhost:3000"
    docker stats parafa-frontend --no-stream --format "💾 RAM: {{.MemUsage}} / {{.MemLimit}} ({{.MemPerc}})"
else
    echo "❌ Erro no deploy"
    docker logs parafa-frontend --tail 20
    exit 1
fi