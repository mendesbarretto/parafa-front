#!/bin/bash

set -e

echo "🏗️  Deploy com Build Pré-compilado"

# Git pull
echo "📥 Atualizando código..."
if [ -d ".git" ]; then
    git pull
fi

# Verificar se já existe build local
if [ ! -d ".next" ]; then
    echo "❌ Sem build local encontrado!"
    echo "💡 Execute localmente antes:"
    echo "   npm install"
    echo "   npm run build"
    echo "   rsync -av . servidor:/path/to/project/"
    exit 1
fi

# Parar containers
echo "⏸️  Parando aplicação..."
docker-compose -f docker-compose.micro.yml down 2>/dev/null || true

# Criar .dockerignore específico para prebuild
cat > .dockerignore.prebuild << 'EOF'
node_modules
.git
.env.local
.env.production.local
.env.development.local
.env.test.local
.DS_Store
*.log
.next/cache
.next/trace
EOF

# Dockerfile que só copia arquivos (sem build)
cat > Dockerfile.prebuild << 'EOF'
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos já buildados
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF

# Build da imagem usando dockerignore específico
echo "📦 Criando imagem..."
cp .dockerignore.prebuild .dockerignore.temp
mv .dockerignore .dockerignore.original
mv .dockerignore.temp .dockerignore

docker build -f Dockerfile.prebuild -t parafa-frontend-prebuild .

# Restaurar dockerignore original e limpar
mv .dockerignore.original .dockerignore
rm Dockerfile.prebuild .dockerignore.prebuild

# Subir com docker-compose otimizado
echo "🚀 Iniciando aplicação..."
docker-compose -f docker-compose.micro.yml up -d

echo "⏳ Aguardando..."
sleep 10

# Verificar
if docker ps | grep -q "parafa-frontend"; then
    echo "✅ Deploy OK!"
    echo "🌐 http://localhost:3000"
    echo "💾 Usando ~768MB RAM máximo"
else
    echo "❌ Erro no deploy"
    docker logs parafa-frontend --tail 10
    exit 1
fi