# =================================================================
# Dockerfile ultra-simplificado para baixa memória do Parafa Frontend
# =================================================================

FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar tudo de uma vez para reduzir layers
COPY package.json package-lock.json* ./

# Instalar dependências (incluindo dev para tailwindcss)
ENV NODE_OPTIONS="--max-old-space-size=384"
RUN npm ci --silent --prefer-offline --no-audit --no-fund

# Copiar código
COPY . .

# Build com otimizações
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=384"
RUN npm run build --silent

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Permissões
RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=128"

CMD ["node", "server.js"]