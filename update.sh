#!/bin/bash

# =================================================================
# Script de Atualização Rápida do Frontend Parafa
# =================================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_NAME="parafa-frontend"
DEPLOY_USER="www-data"
DEPLOY_DIR="/var/www/parafa-frontend"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

echo -e "${BLUE}🔄 Atualizando Parafa Frontend...${NC}"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script no diretório do projeto (parafa-nextjs)"
    exit 1
fi

# Backup da versão atual
log "💾 Fazendo backup da versão atual..."
sudo mkdir -p /var/backups/parafa
sudo tar -czf "/var/backups/parafa/frontend-$(date +%Y%m%d-%H%M%S).tar.gz" -C $DEPLOY_DIR . 2>/dev/null || true

# Pull das mudanças (se for git)
if [ -d ".git" ]; then
    log "📥 Atualizando código do repositório..."
    git pull origin main || git pull origin master || warning "Não foi possível fazer pull do git"
fi

# Instalar/atualizar dependências se package.json mudou
if [ $DEPLOY_DIR/package.json -ot package.json ] 2>/dev/null; then
    log "📦 Atualizando dependências..."
    npm ci --only=production
fi

# Build da aplicação
log "🔨 Building aplicação..."
npm run build

# Parar aplicação
log "⏸️  Parando aplicação..."
sudo -u $DEPLOY_USER pm2 stop $PROJECT_NAME 2>/dev/null || true

# Atualizar arquivos
log "📤 Atualizando arquivos..."
sudo rm -rf $DEPLOY_DIR/.next 2>/dev/null || true
sudo cp -r .next/standalone/* $DEPLOY_DIR/
sudo cp -r .next/static $DEPLOY_DIR/.next/
sudo cp -r public $DEPLOY_DIR/
sudo cp package.json $DEPLOY_DIR/
sudo cp next.config.ts $DEPLOY_DIR/

# Ajustar permissões
sudo chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
sudo chmod +x $DEPLOY_DIR/server.js

# Reiniciar aplicação
log "▶️  Reiniciando aplicação..."
sudo -u $DEPLOY_USER pm2 start $PROJECT_NAME

# Aguardar inicialização
sleep 3

# Verificar se está funcionando
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Aplicação atualizada e funcionando!"
    echo ""
    echo "🌐 Site: https://parafa.com.br"
    echo "📊 Status: sudo -u $DEPLOY_USER pm2 status"
    echo "📝 Logs: sudo -u $DEPLOY_USER pm2 logs $PROJECT_NAME"
else
    echo "❌ Erro: Aplicação não está respondendo"
    echo "📝 Verifique os logs: sudo -u $DEPLOY_USER pm2 logs $PROJECT_NAME"
    exit 1
fi