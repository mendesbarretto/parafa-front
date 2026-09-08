#!/bin/bash

# =================================================================
# Script de Setup para Desenvolvimento Local
# =================================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

echo -e "${BLUE}🛠️  Setup do ambiente de desenvolvimento Parafa Frontend${NC}"

# Verificar Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado"
        echo "📥 Instale o Node.js 20+ em: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -c2-3)
    if [ "$NODE_VERSION" -lt "18" ]; then
        warning "Node.js $NODE_VERSION pode não ser compatível. Recomendado: Node.js 20+"
    fi
    
    log "✅ Node.js $(node -v) encontrado"
}

# Verificar se está no diretório correto
check_directory() {
    if [ ! -f "package.json" ]; then
        echo "❌ Execute este script no diretório do projeto (parafa-nextjs)"
        exit 1
    fi
    
    log "✅ Diretório do projeto confirmado"
}

# Instalar dependências
install_dependencies() {
    log "📦 Instalando dependências..."
    npm install
    log "✅ Dependências instaladas"
}

# Configurar ambiente de desenvolvimento
setup_env() {
    log "⚙️  Configurando ambiente..."
    
    if [ ! -f ".env.local" ]; then
        log "📝 Criando .env.local para desenvolvimento..."
        cat > .env.local << 'EOF'
# Ambiente de desenvolvimento
NODE_ENV=development

# URL da API (ajuste conforme necessário)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Debug (opcional)
# DEBUG=true
EOF
    else
        log "✅ .env.local já existe"
    fi
}

# Verificar conexão com API
test_api() {
    log "🔌 Testando conexão com API..."
    
    API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d '=' -f2)
    
    if curl -f "${API_URL}/empresas" > /dev/null 2>&1; then
        log "✅ API respondendo em ${API_URL}"
    else
        warning "⚠️  API não está respondendo em ${API_URL}"
        echo "   Verifique se o backend está rodando"
        echo "   Backend: cd ../parafa.4.0-backend && php artisan serve"
    fi
}

# Informações úteis
show_info() {
    echo ""
    echo -e "${BLUE}🎯 Próximos passos:${NC}"
    echo ""
    echo "1. 🚀 Iniciar desenvolvimento:"
    echo "   npm run dev"
    echo ""
    echo "2. 🌐 Acessar aplicação:"
    echo "   http://localhost:3000"
    echo ""
    echo "3. 🔨 Build para produção:"
    echo "   npm run build"
    echo ""
    echo "4. ▶️  Iniciar produção local:"
    echo "   npm start"
    echo ""
    echo "5. 🚀 Deploy no servidor:"
    echo "   ./deploy.sh"
    echo ""
    echo -e "${BLUE}📁 Estrutura importante:${NC}"
    echo "   src/app/          - Páginas do App Router"
    echo "   src/components/   - Componentes reutilizáveis"
    echo "   src/lib/api.ts    - Funções da API"
    echo "   .env.local        - Variáveis de ambiente"
    echo ""
    echo -e "${BLUE}🛠️  Scripts úteis:${NC}"
    echo "   npm run dev       - Desenvolvimento"
    echo "   npm run build     - Build de produção"
    echo "   npm run start     - Iniciar produção"
    echo "   npm run lint      - Verificar código"
}

# Menu principal
main() {
    case ${1:-"all"} in
        "deps")
            check_node
            check_directory
            install_dependencies
            ;;
        "env")
            setup_env
            ;;
        "test")
            test_api
            ;;
        "info")
            show_info
            ;;
        "all"|*)
            check_node
            check_directory
            install_dependencies
            setup_env
            test_api
            show_info
            log "🎉 Setup concluído!"
            ;;
    esac
}

main $1