#!/bin/bash

set -e

echo "🚀 Build Local + Deploy Remoto"

# Configurações (ajuste conforme necessário)
SERVIDOR="usuario@servidor.com"
PASTA_REMOTA="/home/parafa-frontend"

# Build local
echo "🏗️  Fazendo build local..."
npm install
npm run build

echo "✅ Build concluído!"

# Verificar se standalone foi criado
if [ ! -f ".next/standalone/server.js" ]; then
    echo "❌ Erro: standalone build não foi criado"
    echo "💡 Verifique se next.config.ts tem: output: 'standalone'"
    exit 1
fi

# Sincronizar com servidor
echo "📤 Sincronizando com servidor..."
rsync -av --progress \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    . $SERVIDOR:$PASTA_REMOTA/

# Deploy no servidor
echo "🐳 Executando deploy no servidor..."
ssh $SERVIDOR "cd $PASTA_REMOTA && ./deploy-prebuild.sh"

echo "🎉 Deploy completo!"
echo "🌐 Verifique: http://seu-servidor.com"