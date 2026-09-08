#!/bin/bash

set -e

echo "🐳 Deploy Parafa (Low Memory Mode)"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Limpar cache do Docker para liberar espaço
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# Parar containers
echo "⏸️  Parando aplicação..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build com configurações de baixa memória
echo "🚀 Build otimizado para baixa memória..."

# Criar Dockerfile temporário com ainda menos memória
cat > Dockerfile.low-memory << 'EOF'
FROM node:20-alpine AS builder

WORKDIR /app

# Configurar limites ainda menores
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar e instalar dependências mínimas primeiro
COPY package*.json ./
RUN npm ci --production=false --no-audit --no-fund

# Copiar código
COPY . .

# Build com configurações mínimas
ENV NODE_ENV=production
RUN npm run build

# Imagem final
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF

# Build com Dockerfile especial
docker build -f Dockerfile.low-memory -t parafa-frontend .

# Remover Dockerfile temporário
rm Dockerfile.low-memory

# Subir aplicação
echo "🚀 Iniciando aplicação..."
docker run -d \
  --name parafa-frontend \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://api.parafa.com.br/api \
  parafa-frontend

echo "⏳ Aguardando..."
sleep 15

# Verificar
if docker ps | grep -q "parafa-frontend"; then
    echo "✅ Deploy OK!"
    echo "🌐 http://localhost:3000"
else
    echo "❌ Erro no deploy"
    docker logs parafa-frontend --tail 10
    exit 1
fi