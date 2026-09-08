#!/bin/bash

# =================================================================
# Script de Deploy do Frontend Parafa para Ubuntu Server
# =================================================================

set -e  # Parar se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_NAME="parafa-frontend"
DEPLOY_USER="www-data"  # ou seu usuário
DEPLOY_DIR="/var/www/parafa-frontend"
PORT=3000
NODE_VERSION="20"  # Versão do Node.js recomendada

echo -e "${BLUE}🚀 Iniciando deploy do Parafa Frontend...${NC}"

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

# Verificar se está executando como root ou com sudo
check_permissions() {
    if [ "$EUID" -ne 0 ]; then
        error "Este script precisa ser executado como root ou com sudo"
    fi
}

# Instalar dependências do sistema
install_system_deps() {
    log "📦 Instalando dependências do sistema..."
    
    apt update
    apt install -y curl git nginx pm2 ufw certbot python3-certbot-nginx
    
    # Instalar Node.js via NodeSource
    if ! command -v node &> /dev/null || [ "$(node -v | cut -c2-3)" -lt "$NODE_VERSION" ]; then
        log "📥 Instalando Node.js ${NODE_VERSION}..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
        apt install -y nodejs
    fi
    
    log "✅ Node.js $(node -v) e npm $(npm -v) instalados"
}

# Preparar diretórios
setup_directories() {
    log "📁 Preparando diretórios..."
    
    mkdir -p $DEPLOY_DIR
    mkdir -p /var/log/parafa
    
    # Criar usuário se não existir
    if ! id "$DEPLOY_USER" &>/dev/null; then
        useradd -m -s /bin/bash $DEPLOY_USER
    fi
    
    chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
    chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/parafa
}

# Build da aplicação
build_application() {
    log "🔨 Fazendo build da aplicação..."
    
    # Instalar dependências
    npm ci --only=production
    
    # Build
    npm run build
    
    log "✅ Build concluído com sucesso"
}

# Deploy da aplicação
deploy_application() {
    log "🚀 Fazendo deploy da aplicação..."
    
    # Parar aplicação se estiver rodando
    sudo -u $DEPLOY_USER pm2 stop $PROJECT_NAME 2>/dev/null || true
    
    # Copiar arquivos
    cp -r .next/standalone/* $DEPLOY_DIR/
    cp -r .next/static $DEPLOY_DIR/.next/
    cp -r public $DEPLOY_DIR/
    
    # Copiar package.json e next.config.ts
    cp package.json $DEPLOY_DIR/
    cp next.config.ts $DEPLOY_DIR/
    
    # Ajustar permissões
    chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
    chmod +x $DEPLOY_DIR/server.js
}

# Configurar variáveis de ambiente para produção
setup_env() {
    log "⚙️  Configurando variáveis de ambiente..."
    
    cat > $DEPLOY_DIR/.env.local << EOF
# Configuração de produção
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.parafa.com.br/api
PORT=$PORT

# Desabilitar telemetria
NEXT_TELEMETRY_DISABLED=1

# Configurações de cache
NEXT_PUBLIC_CACHE_TTL=3600

# Analytics/Monitoring (opcional)
# NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID
EOF
    
    chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR/.env.local
}

# Configurar PM2
setup_pm2() {
    log "⚡ Configurando PM2..."
    
    # Configuração do PM2
    cat > $DEPLOY_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: './server.js',
    cwd: '$DEPLOY_DIR',
    user: '$DEPLOY_USER',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    log_file: '/var/log/parafa/app.log',
    out_file: '/var/log/parafa/app-out.log',
    error_file: '/var/log/parafa/app-error.log',
    time: true,
    max_memory_restart: '500M',
    restart_delay: 4000,
    watch: false,
    ignore_watch: ['node_modules', '.next'],
    instances: 2
  }]
}
EOF
    
    chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR/ecosystem.config.js
    
    # Iniciar com PM2
    sudo -u $DEPLOY_USER pm2 start $DEPLOY_DIR/ecosystem.config.js
    sudo -u $DEPLOY_USER pm2 save
    
    # Auto-start PM2 na inicialização
    pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER
    systemctl enable pm2-$DEPLOY_USER
}

# Configurar Nginx
setup_nginx() {
    log "🌐 Configurando Nginx..."
    
    cat > /etc/nginx/sites-available/$PROJECT_NAME << 'EOF'
server {
    listen 80;
    server_name parafa.com.br www.parafa.com.br;
    
    # Logs
    access_log /var/log/nginx/parafa-access.log;
    error_log /var/log/nginx/parafa-error.log;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    # Cache estático
    location /_next/static {
        alias /var/www/parafa-frontend/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /images {
        alias /var/www/parafa-frontend/public/images;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /favicon.ico {
        alias /var/www/parafa-frontend/public/favicon.ico;
        expires 1y;
    }
    
    # Proxy para Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
EOF
    
    # Ativar site
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    nginx -t || error "Configuração do Nginx inválida"
    
    systemctl restart nginx
    systemctl enable nginx
}

# Configurar firewall
setup_firewall() {
    log "🔥 Configurando firewall..."
    
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Portas necessárias
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    ufw --force enable
}

# Configurar SSL com Let's Encrypt
setup_ssl() {
    log "🔒 Configurando SSL..."
    
    # Aguardar nginx estar ativo
    sleep 5
    
    certbot --nginx -d parafa.com.br -d www.parafa.com.br --non-interactive --agree-tos --email admin@parafa.com.br --redirect
    
    # Auto-renovação
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
}

# Monitoramento
setup_monitoring() {
    log "📊 Configurando monitoramento..."
    
    # Script de health check
    cat > /usr/local/bin/parafa-health-check.sh << 'EOF'
#!/bin/bash
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "$(date): Frontend não está respondendo, reiniciando..." >> /var/log/parafa/health-check.log
    sudo -u www-data pm2 restart parafa-frontend
fi
EOF
    
    chmod +x /usr/local/bin/parafa-health-check.sh
    
    # Adicionar ao cron para executar a cada 5 minutos
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/parafa-health-check.sh") | crontab -
}

# Status da aplicação
show_status() {
    log "📋 Status da aplicação:"
    
    echo "🌐 Site: https://parafa.com.br"
    echo "📁 Diretório: $DEPLOY_DIR"
    echo "👤 Usuário: $DEPLOY_USER"
    echo "🔌 Porta: $PORT"
    echo ""
    echo "📊 PM2 Status:"
    sudo -u $DEPLOY_USER pm2 status
    echo ""
    echo "🔧 Nginx Status:"
    systemctl status nginx --no-pager -l
    echo ""
    echo "📝 Comandos úteis:"
    echo "  Ver logs PM2:    sudo -u $DEPLOY_USER pm2 logs $PROJECT_NAME"
    echo "  Reiniciar app:   sudo -u $DEPLOY_USER pm2 restart $PROJECT_NAME"
    echo "  Reload Nginx:    sudo systemctl reload nginx"
    echo "  Ver logs Nginx:  tail -f /var/log/nginx/parafa-*.log"
}

# Menu principal
main() {
    case ${1:-"all"} in
        "deps")
            check_permissions
            install_system_deps
            ;;
        "build")
            build_application
            ;;
        "deploy")
            check_permissions
            setup_directories
            build_application
            deploy_application
            setup_env
            setup_pm2
            ;;
        "nginx")
            check_permissions
            setup_nginx
            setup_firewall
            ;;
        "ssl")
            check_permissions
            setup_ssl
            ;;
        "status")
            show_status
            ;;
        "all")
            check_permissions
            install_system_deps
            setup_directories
            build_application
            deploy_application
            setup_env
            setup_pm2
            setup_nginx
            setup_firewall
            setup_ssl
            setup_monitoring
            show_status
            log "🎉 Deploy concluído com sucesso!"
            ;;
        *)
            echo "Uso: $0 [deps|build|deploy|nginx|ssl|status|all]"
            echo ""
            echo "Opções:"
            echo "  deps    - Instalar dependências do sistema"
            echo "  build   - Build da aplicação"
            echo "  deploy  - Deploy da aplicação (sem nginx/ssl)"
            echo "  nginx   - Configurar Nginx e firewall"
            echo "  ssl     - Configurar SSL/HTTPS"
            echo "  status  - Mostrar status"
            echo "  all     - Deploy completo (padrão)"
            exit 1
            ;;
    esac
}

main $1