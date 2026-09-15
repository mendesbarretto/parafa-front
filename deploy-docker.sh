#!/bin/bash

set -e

echo "🐳 Deploy Parafa Frontend"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Parar container atual
echo "⏸️  Parando container atual..."
docker-compose down 2>/dev/null || true

# Build e subir novo container
echo "🚀 Build e deploy..."
docker-compose up -d --build

# Aguardar início
echo "⏳ Aguardando aplicação iniciar..."
sleep 15

# Verificar health
echo "🔍 Verificando saúde da aplicação..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Deploy OK!"
    echo "🌐 http://localhost:3000"
else
    echo "❌ Erro no deploy - health check falhou"
    docker-compose logs frontend --tail 20
    exit 1
fi