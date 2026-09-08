#!/bin/bash

# =================================================================
# Script para configurar Apache para API Parafa
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

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script precisa ser executado como root ou com sudo"
fi

echo -e "${BLUE}🔧 Configurando Apache para API Parafa${NC}"

# Verificar se o Apache está instalado
if ! command -v apache2 &> /dev/null; then
    log "📦 Instalando Apache..."
    apt update
    apt install -y apache2
fi

# Habilitar módulos necessários
log "🔌 Habilitando módulos do Apache..."
a2enmod rewrite
a2enmod ssl
a2enmod headers
a2enmod expires

# Backup da configuração atual
log "💾 Fazendo backup da configuração atual..."
if [ -f "/etc/apache2/sites-available/api.parafa.com.br.conf" ]; then
    cp "/etc/apache2/sites-available/api.parafa.com.br.conf" "/etc/apache2/sites-available/api.parafa.com.br.conf.backup.$(date +%Y%m%d-%H%M%S)"
fi

# Remover configuração antiga se existir
if [ -f "/etc/apache2/sites-enabled/api.parafa.com.br.conf" ]; then
    log "🗑️  Removendo configuração antiga..."
    a2dissite api.parafa.com.br.conf
fi

# Criar nova configuração HTTP (porta 80)
log "📝 Criando configuração HTTP..."
cat > /etc/apache2/sites-available/api-parafa-http.conf << 'EOF'
# VirtualHost HTTP - Redireciona para HTTPS
<VirtualHost *:80>
    ServerName api.parafa.com.br
    ServerAdmin webmaster@parafa.com.br
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/error_api_parafa.log
    CustomLog ${APACHE_LOG_DIR}/access_api_parafa.log combined
    
    # Redirecionamento para HTTPS
    RewriteEngine on
    RewriteCond %{SERVER_NAME} =api.parafa.com.br
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
EOF

# Criar configuração HTTPS (porta 443)
log "📝 Criando configuração HTTPS..."
cat > /etc/apache2/sites-available/api-parafa-https.conf << 'EOF'
# VirtualHost HTTPS - Serve a API Laravel
<VirtualHost *:443>
    ServerName api.parafa.com.br
    ServerAdmin webmaster@parafa.com.br
    
    # Diretório da aplicação Laravel
    DocumentRoot /home/parafa-api/public
    
    # Configurações do diretório
    <Directory /home/parafa-api/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Laravel URL Rewrite
        <IfModule mod_rewrite.c>
            RewriteEngine On
            
            # Handle Angular and Laravel routes
            RewriteCond %{REQUEST_FILENAME} -d [OR]
            RewriteCond %{REQUEST_FILENAME} -f
            RewriteRule ^ ^$1 [N]
            
            RewriteCond %{REQUEST_URI} (\.\w+$) [NC]
            RewriteRule ^(.*)$ public/$1 
            
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteRule ^ index.php [L]
        </IfModule>
    </Directory>
    
    # Configurações de segurança
    <Directory /home/parafa-api>
        Require all denied
    </Directory>
    
    <Directory /home/parafa-api/public>
        Require all granted
    </Directory>
    
    # Headers de segurança
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # CORS Headers para API
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, X-API-Key"
    Header always set Access-Control-Max-Age "3600"
    
    # Configurações PHP
    <IfModule mod_php7.c>
        php_value upload_max_filesize 32M
        php_value post_max_size 32M
        php_value memory_limit 256M
        php_value max_execution_time 300
        php_value max_input_vars 3000
    </IfModule>
    
    # Configurações SSL
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/api.parafa.com.br/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/api.parafa.com.br/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/error_api_parafa_ssl.log
    CustomLog ${APACHE_LOG_DIR}/access_api_parafa_ssl.log combined
    
    # Cache para arquivos estáticos
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public, immutable"
    </LocationMatch>
    
    # Não fazer cache da API
    <LocationMatch "^/api/">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </LocationMatch>
    
</VirtualHost>
EOF

# Verificar se o diretório da aplicação existe
if [ ! -d "/home/parafa-api/public" ]; then
    warning "Diretório /home/parafa-api/public não encontrado"
    echo "   Certifique-se de que a aplicação Laravel está no local correto"
    echo "   Ou ajuste o DocumentRoot na configuração"
fi

# Habilitar sites
log "✅ Habilitando sites..."
a2ensite api-parafa-http.conf
a2ensite api-parafa-https.conf

# Desabilitar site padrão se estiver ativo
if [ -f "/etc/apache2/sites-enabled/000-default.conf" ]; then
    log "🗑️  Desabilitando site padrão..."
    a2dissite 000-default.conf
fi

# Testar configuração
log "🧪 Testando configuração do Apache..."
if apache2ctl configtest; then
    log "✅ Configuração do Apache válida"
else
    error "❌ Erro na configuração do Apache"
fi

# Configurar certificado SSL
setup_ssl() {
    log "🔒 Configurando SSL com Let's Encrypt..."
    
    if ! command -v certbot &> /dev/null; then
        log "📦 Instalando Certbot..."
        apt install -y certbot python3-certbot-apache
    fi
    
    # Gerar certificado
    certbot --apache -d api.parafa.com.br --non-interactive --agree-tos --email webmaster@parafa.com.br
    
    if [ $? -eq 0 ]; then
        log "✅ SSL configurado com sucesso"
        
        # Configurar renovação automática
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        log "✅ Renovação automática configurada"
    else
        warning "⚠️  Não foi possível configurar SSL automaticamente"
        echo "   Configure manualmente com: certbot --apache -d api.parafa.com.br"
    fi
}

# Reiniciar Apache
log "🔄 Reiniciando Apache..."
systemctl restart apache2

if systemctl is-active --quiet apache2; then
    log "✅ Apache reiniciado com sucesso"
else
    error "❌ Falha ao reiniciar Apache"
fi

# Verificar se deve configurar SSL
if [ "${1:-ssl}" == "ssl" ]; then
    setup_ssl
fi

# Status final
log "📊 Status da configuração:"
echo ""
echo "🌐 Site: http://api.parafa.com.br (redirecionará para HTTPS)"
echo "🔒 SSL: https://api.parafa.com.br"
echo "📁 DocumentRoot: /home/parafa-api/public"
echo "📝 Logs de erro: /var/log/apache2/error_api_parafa*.log"
echo "📝 Logs de acesso: /var/log/apache2/access_api_parafa*.log"
echo ""
echo "🧪 Testes:"
echo "   curl -I http://api.parafa.com.br"
echo "   curl -I https://api.parafa.com.br"
echo "   curl https://api.parafa.com.br/api/empresas"
echo ""
echo "📋 Sites habilitados:"
apache2ctl -S | grep "api.parafa.com.br"

log "🎉 Configuração do Apache concluída!"

echo ""
echo -e "${YELLOW}⚠️  Próximos passos:${NC}"
echo "1. Verificar se a aplicação Laravel está em /home/parafa-api/"
echo "2. Verificar permissões: sudo chown -R www-data:www-data /home/parafa-api/"
echo "3. Testar a API: curl https://api.parafa.com.br/api/empresas"
echo "4. Verificar logs em caso de erro: tail -f /var/log/apache2/error_api_parafa*.log"