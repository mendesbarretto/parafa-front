#!/bin/bash

# =================================================================
# Script para verificar saúde da aplicação
# =================================================================

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_local() {
    echo -e "${BLUE}🔍 Verificando aplicação local...${NC}"
    
    # Verificar se Next.js está rodando
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend local respondendo${NC}"
    else
        echo -e "${RED}❌ Frontend local não está rodando${NC}"
        echo "   Execute: npm run dev"
    fi
    
    # Verificar API
    API_URL="http://localhost:8000/api"
    if curl -f "$API_URL/empresas" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API local respondendo${NC}"
    else
        echo -e "${RED}❌ API local não está rodando${NC}"
        echo "   Execute: cd ../parafa.4.0-backend && php artisan serve"
    fi
}

check_production() {
    echo -e "${BLUE}🔍 Verificando aplicação em produção...${NC}"
    
    # Verificar site principal
    if curl -f https://parafa.com.br > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Site principal respondendo${NC}"
    else
        echo -e "${RED}❌ Site principal não está respondendo${NC}"
    fi
    
    # Verificar HTTPS
    if curl -I https://parafa.com.br 2>/dev/null | grep -q "200 OK"; then
        echo -e "${GREEN}✅ HTTPS funcionando${NC}"
    else
        echo -e "${YELLOW}⚠️  Problema com HTTPS${NC}"
    fi
    
    # Verificar API de produção
    if curl -f https://api.parafa.com.br/api/empresas > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API de produção respondendo${NC}"
    else
        echo -e "${RED}❌ API de produção não está respondendo${NC}"
        echo "   Testando sem SSL..."
        if curl -f http://api.parafa.com.br/api/empresas > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  API funciona em HTTP, problema no HTTPS/SSL${NC}"
        else
            echo -e "${RED}❌ API não responde nem em HTTP${NC}"
        fi
    fi
}

check_server() {
    echo -e "${BLUE}🔍 Verificando serviços no servidor...${NC}"
    
    # PM2
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "parafa-frontend.*online"; then
            echo -e "${GREEN}✅ PM2 com parafa-frontend online${NC}"
        else
            echo -e "${RED}❌ PM2 parafa-frontend não está online${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  PM2 não encontrado (execute no servidor)${NC}"
    fi
    
    # Nginx
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo -e "${GREEN}✅ Nginx ativo${NC}"
    else
        echo -e "${RED}❌ Nginx não está ativo${NC}"
    fi
    
    # Portas
    if ss -tuln | grep -q ":3000 "; then
        echo -e "${GREEN}✅ Porta 3000 em uso (Next.js)${NC}"
    else
        echo -e "${RED}❌ Porta 3000 não está em uso${NC}"
    fi
    
    if ss -tuln | grep -q ":80 "; then
        echo -e "${GREEN}✅ Porta 80 em uso (HTTP)${NC}"
    else
        echo -e "${RED}❌ Porta 80 não está em uso${NC}"
    fi
    
    if ss -tuln | grep -q ":443 "; then
        echo -e "${GREEN}✅ Porta 443 em uso (HTTPS)${NC}"
    else
        echo -e "${YELLOW}⚠️  Porta 443 não está em uso (HTTPS)${NC}"
    fi
}

show_logs() {
    echo -e "${BLUE}📝 Últimas linhas dos logs...${NC}"
    
    if [ -f "/var/log/parafa/app-error.log" ]; then
        echo -e "${YELLOW}Erros da aplicação:${NC}"
        tail -5 /var/log/parafa/app-error.log 2>/dev/null || echo "Sem logs de erro"
    fi
    
    if [ -f "/var/log/nginx/parafa-error.log" ]; then
        echo -e "${YELLOW}Erros do Nginx:${NC}"
        tail -5 /var/log/nginx/parafa-error.log 2>/dev/null || echo "Sem logs de erro do Nginx"
    fi
}

case ${1:-"all"} in
    "local")
        check_local
        ;;
    "prod"|"production")
        check_production
        ;;
    "server")
        check_server
        show_logs
        ;;
    "all"|*)
        check_local
        echo ""
        check_production
        echo ""
        check_server
        echo ""
        show_logs
        ;;
esac