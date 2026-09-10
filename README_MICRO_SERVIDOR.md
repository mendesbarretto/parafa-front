# 🐳 Deploy para Servidor Pequeno (2GB RAM)

## 🎯 **Problema:**
- Servidor com apenas 2GB RAM
- Postgres já usa 512MB 
- Build do Next.js precisa de +1.5GB
- Out of Memory durante o build

## ✅ **Solução: Build Local + Deploy Pré-compilado**

### 📋 **Fluxo de trabalho:**

#### 1️⃣ **No seu computador local:**
```bash
# Build completo automatizado
./build-and-deploy.sh
```

**OU manualmente:**
```bash
# Build local
npm install
npm run build

# Enviar para servidor
rsync -av --exclude=node_modules . usuario@servidor:/path/
```

#### 2️⃣ **No servidor (só copia arquivos, sem build):**
```bash
# Deploy otimizado para 768MB RAM
./deploy-prebuild.sh
```

## 🔧 **Configuração do Servidor:**

### Limites de recursos:
```yaml
# docker-compose.micro.yml
resources:
  limits:
    cpus: "0.5"     # Metade de 1 core
    memory: 768M    # Bem abaixo dos 2GB
  reservations:
    memory: 256M    # Mínimo garantido
```

### Uso típico:
- **Postgres:** 512MB
- **Frontend:** 768MB
- **Sistema:** 756MB
- **Total:** ~2GB ✅

## 🚀 **Scripts Disponíveis:**

| Script | Uso | Onde executar |
|--------|-----|---------------|
| `build-and-deploy.sh` | Build + Deploy completo | Local |
| `deploy-prebuild.sh` | Deploy só arquivos | Servidor |
| `deploy-docker.sh` | Deploy normal (precisa +2GB) | Servidor |

## 💡 **Vantagens desta abordagem:**
- ✅ Build roda na sua máquina (sem limite de RAM)
- ✅ Servidor só roda a aplicação (baixo consumo)
- ✅ Deploy rápido (só copia arquivos)
- ✅ Sem risco de Out of Memory no servidor

## 🔍 **Monitoramento:**
```bash
# Ver uso de memória
docker stats parafa-frontend

# Logs da aplicação
docker logs parafa-frontend -f

# Status geral do sistema
free -h
docker ps
```

## ⚠️ **Importantes:**
1. **Sempre buildar localmente** antes de enviar
2. **Verificar** se `.next/standalone/server.js` existe
3. **rsync** é mais eficiente que git clone
4. **Testar** localmente antes de deployar