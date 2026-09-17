#!/bin/bash

set -e

echo "🐳 Deploy Parafa Frontend"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Construir a imagem mantendo o container atual disponível
echo "🚀 Construindo nova imagem..."
docker-compose build frontend

# Subir o novo container somente após o build concluir
echo "▶️  Subindo nova versão..."
docker-compose up -d --no-build frontend

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