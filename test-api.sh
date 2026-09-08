#!/bin/bash

# =================================================================
# Script para testar conectividade com a API
# =================================================================

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_DOMAIN="api.parafa.com.br"
API_ENDPOINTS=(
    "empresas"
    "categorias"
    "cidades"
    "estados"
)

echo -e "${BLUE}🔍 Testando API: $API_DOMAIN${NC}"
echo ""

# Testar DNS
echo -e "${BLUE}📡 Testando DNS...${NC}"
if nslookup $API_DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✅ DNS resolvido${NC}"
    IP=$(nslookup $API_DOMAIN | grep "Address:" | tail -1 | awk '{print $2}')
    echo "   IP: $IP"
else
    echo -e "${RED}❌ Problema no DNS${NC}"
    exit 1
fi

echo ""

# Testar conectividade básica
echo -e "${BLUE}🌐 Testando conectividade básica...${NC}"

# Teste HTTPS
if curl -I https://$API_DOMAIN --connect-timeout 5 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS conecta${NC}"
    SSL_STATUS="OK"
else
    echo -e "${RED}❌ HTTPS não conecta${NC}"
    SSL_STATUS="FAILED"
fi

# Teste HTTP
if curl -I http://$API_DOMAIN --connect-timeout 5 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTP conecta${NC}"
    HTTP_STATUS="OK"
else
    echo -e "${RED}❌ HTTP não conecta${NC}"
    HTTP_STATUS="FAILED"
fi

echo ""

# Testar endpoints da API
echo -e "${BLUE}🔌 Testando endpoints da API...${NC}"

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo -n "   /$endpoint: "
    
    # Tentar HTTPS primeiro
    if curl -f https://$API_DOMAIN/api/$endpoint -H "Accept: application/json" --connect-timeout 5 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTPS OK${NC}"
    elif curl -f http://$API_DOMAIN/api/$endpoint -H "Accept: application/json" --connect-timeout 5 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  HTTP OK (HTTPS falhou)${NC}"
    else
        echo -e "${RED}❌ FALHOU${NC}"
        
        # Diagnóstico detalhado
        echo "      Diagnóstico:"
        
        # Testar redirecionamento
        REDIRECT=$(curl -I https://$API_DOMAIN/api/$endpoint 2>/dev/null | grep -i "location:" | head -1)
        if [ ! -z "$REDIRECT" ]; then
            echo "      - Redirecionamento detectado: $REDIRECT"
        fi
        
        # Testar se retorna HTML em vez de JSON
        CONTENT_TYPE=$(curl -I https://$API_DOMAIN/api/$endpoint 2>/dev/null | grep -i "content-type:" | head -1)
        if [ ! -z "$CONTENT_TYPE" ]; then
            echo "      - Content-Type: $CONTENT_TYPE"
        fi
    fi
done

echo ""

# Testar com API Key
echo -e "${BLUE}🔐 Testando com API Key...${NC}"
API_KEY="parafa_api_2024_secure_key_xyz789"

if curl -f https://$API_DOMAIN/api/empresas \
   -H "Accept: application/json" \
   -H "X-API-Key: $API_KEY" \
   --connect-timeout 5 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Key funciona${NC}"
else
    echo -e "${RED}❌ API Key não funciona${NC}"
fi

echo ""

# Resumo
echo -e "${BLUE}📊 Resumo:${NC}"
echo "   DNS: ✅"
echo "   HTTP: $HTTP_STATUS"
echo "   HTTPS: $SSL_STATUS"
echo ""

# Recomendações
echo -e "${BLUE}💡 Próximos passos:${NC}"

if [ "$SSL_STATUS" = "FAILED" ]; then
    echo "   1. Configurar SSL/HTTPS no servidor da API"
    echo "   2. Verificar se o certificado está válido"
fi

if [ "$HTTP_STATUS" = "FAILED" ] && [ "$SSL_STATUS" = "FAILED" ]; then
    echo "   1. Verificar se o servidor da API está rodando"
    echo "   2. Verificar configuração do Apache/Nginx"
    echo "   3. Verificar firewall no servidor"
fi

echo "   - Verificar logs do servidor: /var/log/apache2/ ou /var/log/nginx/"
echo "   - Testar diretamente no servidor: curl http://localhost/api/empresas"

# Teste final do frontend
echo ""
echo -e "${BLUE}🎯 Testando integração com frontend...${NC}"

if [ "$SSL_STATUS" = "OK" ]; then
    API_URL="https://$API_DOMAIN/api"
else
    API_URL="http://$API_DOMAIN/api"
    echo -e "${YELLOW}⚠️  Usando HTTP pois HTTPS não está funcionando${NC}"
fi

echo "   Frontend deve usar: $API_URL"

# Simular requisição do frontend
echo "   Simulando requisição do Next.js..."
FRONTEND_TEST=$(curl -s "$API_URL/empresas" \
    -H "Accept: application/json" \
    -H "Origin: https://parafa.com.br" \
    -H "User-Agent: Mozilla/5.0 Next.js" 2>/dev/null)

if echo "$FRONTEND_TEST" | grep -q '"data"'; then
    echo -e "${GREEN}✅ Frontend integration OK${NC}"
elif echo "$FRONTEND_TEST" | grep -q "error"; then
    echo -e "${RED}❌ API retornou erro${NC}"
    echo "   Resposta: $(echo $FRONTEND_TEST | head -c 100)..."
else
    echo -e "${YELLOW}⚠️  Resposta inesperada da API${NC}"
    echo "   Resposta: $(echo $FRONTEND_TEST | head -c 100)..."
fi