# =================================================================
# Dockerfile otimizado para baixa memória do Parafa Frontend
# =================================================================

# Usar alpine mais leve
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar e instalar dependências
COPY package.json package-lock.json* ./
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm ci --only=production --silent --prefer-offline --no-audit --no-fund

# Copiar código
COPY . .

# Build com limites de memória
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build --silent

# Imagem final minimalista
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas o necessário
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=192"

CMD ["node", "server.js"]