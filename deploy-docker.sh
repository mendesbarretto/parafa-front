#!/bin/bash

# =================================================================
# Deploy Docker do Parafa Frontend
# =================================================================

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo -e "${BLUE}🐳 Deploy Docker - Parafa Frontend${NC}"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute no diretório do projeto (parafa-nextjs)"
fi

# Instalar Docker se necessário
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "📦 Instalando Docker..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER
        log "✅ Docker instalado. Faça logout/login para usar sem sudo"
    fi

    if ! command -v docker-compose &> /dev/null; then
        log "📦 Instalando Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
}

# Parar containers antigos
stop_old_containers() {
    log "⏹️  Parando containers antigos..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Remover container se existir
    if docker ps -a | grep -q "parafa-frontend"; then
        docker stop parafa-frontend 2>/dev/null || true
        docker rm parafa-frontend 2>/dev/null || true
    fi
}

# Build e deploy
deploy_app() {
    log "🔨 Building imagem Docker..."
    
    # Limpar imagens antigas
    docker system prune -f
    
    # Build da nova imagem
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    log "🚀 Iniciando aplicação..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Aguardar inicialização
    sleep 10
    
    # Verificar se está rodando
    if docker ps | grep -q "parafa-frontend"; then
        log "✅ Aplicação rodando com sucesso!"
    else
        error "❌ Falha ao iniciar aplicação"
    fi
}

# Configurar Nginx
setup_nginx() {
    log "🌐 Configurando Nginx..."
    
    if ! command -v nginx &> /dev/null; then
        sudo apt update
        sudo apt install -y nginx certbot python3-certbot-nginx
    fi
    
    # Criar configuração do Nginx
    sudo tee /etc/nginx/sites-available/parafa-frontend << 'EOF'
server {
    listen 80;
    server_name parafa.com.br www.parafa.com.br;
    
    # Logs
    access_log /var/log/nginx/parafa-access.log;
    error_log /var/log/nginx/parafa-error.log;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy para container Docker
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
    sudo ln -sf /etc/nginx/sites-available/parafa-frontend /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar e reiniciar
    sudo nginx -t && sudo systemctl restart nginx
    sudo systemctl enable nginx
}

# Configurar SSL
setup_ssl() {
    log "🔒 Configurando SSL..."
    
    sudo certbot --nginx -d parafa.com.br -d www.parafa.com.br --non-interactive --agree-tos --email admin@parafa.com.br --redirect
    
    # Auto-renovação
    (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
}

# Criar systemd service para auto-start
setup_systemd() {
    log "⚙️  Configurando auto-start..."
    
    sudo tee /etc/systemd/system/parafa-frontend.service << 'EOF'
[Unit]
Description=Parafa Frontend Docker
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/parafa-front
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable parafa-frontend.service
}

# Configurar firewall
setup_firewall() {
    log "🔥 Configurando firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 22/tcp
        sudo ufw --force enable
    fi
}

# Status da aplicação
show_status() {
    log "📊 Status da aplicação:"
    
    echo ""
    echo "🐳 Docker Status:"
    docker ps | grep parafa || echo "Nenhum container parafa rodando"
    
    echo ""
    echo "📊 Container Logs (últimas 10 linhas):"
    docker logs parafa-frontend --tail 10 2>/dev/null || echo "Container não encontrado"
    
    echo ""
    echo "🌐 Site: https://parafa.com.br"
    echo "🔍 Teste: curl -I https://parafa.com.br"
    
    echo ""
    echo "📝 Comandos úteis:"
    echo "  Ver logs:           docker logs parafa-frontend -f"
    echo "  Reiniciar:          docker-compose -f docker-compose.prod.yml restart"
    echo "  Parar:              docker-compose -f docker-compose.prod.yml down"
    echo "  Rebuild:            docker-compose -f docker-compose.prod.yml up -d --build"
}

# Menu principal
case ${1:-"all"} in
    "docker")
        install_docker
        ;;
    "deploy")
        stop_old_containers
        deploy_app
        ;;
    "nginx")
        setup_nginx
        setup_firewall
        ;;
    "ssl")
        setup_ssl
        ;;
    "status")
        show_status
        ;;
    "all")
        install_docker
        stop_old_containers
        deploy_app
        setup_nginx
        setup_firewall
        setup_ssl
        setup_systemd
        show_status
        log "🎉 Deploy Docker concluído!"
        ;;
    *)
        echo "Uso: $0 [docker|deploy|nginx|ssl|status|all]"
        ;;
esac