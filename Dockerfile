# Dockerfile para produção do Parafa Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Configurar limites de memória do Node
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção E desenvolvimento (precisa para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação com configurações otimizadas
ENV NODE_ENV=production
RUN npm run build

# Imagem final
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configurar usuário
USER nextjs

# Expor porta
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Comando de inicialização
CMD ["node", "server.js"]