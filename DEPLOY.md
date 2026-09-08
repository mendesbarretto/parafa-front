# 🚀 Guia de Deploy - Parafa Frontend

## Overview

Este guia mostra como fazer deploy do frontend Next.js do Parafa em um servidor Ubuntu.

## 📋 Pré-requisitos

- Servidor Ubuntu 20.04+ 
- Acesso root ou sudo
- Domínio configurado (parafa.com.br)
- Backend da API rodando

## 🛠️ Preparação do Código

### 1. Ambiente de Desenvolvimento
```bash
# No seu computador
cd parafa-nextjs/
chmod +x *.sh
./dev-setup.sh
```

### 2. Teste Local
```bash
npm run dev
# Acesse: http://localhost:3000
```

### 3. Build de Teste
```bash
npm run build
npm start
# Teste se funciona em modo produção
```

## 🚀 Deploy no Servidor

### Método 1: Deploy Automático (Recomendado)

```bash
# Copiar projeto para o servidor
scp -r parafa-nextjs/ user@seu-servidor.com:/tmp/

# Conectar no servidor
ssh user@seu-servidor.com

# Ir para o diretório
cd /tmp/parafa-nextjs

# Executar deploy completo
sudo ./deploy.sh

# Ou por etapas:
sudo ./deploy.sh deps    # Instalar dependências
sudo ./deploy.sh deploy  # Deploy da aplicação
sudo ./deploy.sh nginx   # Configurar Nginx
sudo ./deploy.sh ssl     # Configurar HTTPS
```

### Método 2: Deploy Manual

```bash
# 1. Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Instalar dependências do sistema
sudo apt install -y nginx pm2 certbot python3-certbot-nginx

# 3. Criar diretórios
sudo mkdir -p /var/www/parafa-frontend
sudo mkdir -p /var/log/parafa

# 4. Build e deploy
npm ci --only=production
npm run build
sudo cp -r .next/standalone/* /var/www/parafa-frontend/
sudo cp -r .next/static /var/www/parafa-frontend/.next/
sudo cp -r public /var/www/parafa-frontend/

# 5. Configurar PM2
sudo pm2 start /var/www/parafa-frontend/server.js --name parafa-frontend
sudo pm2 save
sudo pm2 startup

# 6. Configurar Nginx (ver arquivo de configuração)
sudo nano /etc/nginx/sites-available/parafa
sudo ln -s /etc/nginx/sites-available/parafa /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 7. Configurar SSL
sudo certbot --nginx -d parafa.com.br -d www.parafa.com.br
```

## ⚙️ Configurações Importantes

### 1. Variáveis de Ambiente (.env.local)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.parafa.com.br
PORT=3000
```

### 2. Configuração do PM2 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'parafa-frontend',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 3. Configuração do Nginx
```nginx
server {
    listen 80;
    server_name parafa.com.br www.parafa.com.br;
    
    # Cache estático
    location /_next/static {
        alias /var/www/parafa-frontend/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy para Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 Atualizações

Para atualizações rápidas do código:

```bash
# No servidor, diretório do projeto
./update.sh
```

Ou manualmente:
```bash
git pull origin main
npm run build
sudo cp -r .next/standalone/* /var/www/parafa-frontend/
sudo cp -r .next/static /var/www/parafa-frontend/.next/
sudo pm2 restart parafa-frontend
```

## 📊 Monitoramento

### Verificar Status
```bash
# Status da aplicação
sudo -u www-data pm2 status

# Logs da aplicação
sudo -u www-data pm2 logs parafa-frontend

# Status do Nginx
sudo systemctl status nginx

# Logs do Nginx
tail -f /var/log/nginx/parafa-*.log

# Teste de conectividade
curl -I https://parafa.com.br
```

### Health Check
```bash
# Verificar se está respondendo
curl -f http://localhost:3000

# Verificar SSL
curl -I https://parafa.com.br
```

## 🐳 Deploy com Docker (Alternativo)

```bash
# Build da imagem
docker build -f Dockerfile.prod -t parafa-frontend .

# Executar
docker run -d --name parafa-frontend -p 3000:3000 parafa-frontend

# Com Docker Compose
docker-compose up -d
```

## 🔧 Solução de Problemas

### Aplicação não inicia
```bash
# Verificar logs
sudo -u www-data pm2 logs parafa-frontend

# Verificar se a porta está livre
sudo lsof -i :3000

# Reiniciar
sudo -u www-data pm2 restart parafa-frontend
```

### Nginx não funciona
```bash
# Testar configuração
sudo nginx -t

# Verificar status
sudo systemctl status nginx

# Reiniciar
sudo systemctl restart nginx
```

### SSL não funciona
```bash
# Renovar certificado
sudo certbot renew

# Verificar certificados
sudo certbot certificates

# Reconfigurar
sudo certbot --nginx -d parafa.com.br
```

### Performance baixa
```bash
# Aumentar instâncias do PM2
sudo -u www-data pm2 scale parafa-frontend +2

# Verificar recursos
htop
free -h
df -h
```

## 📝 Comandos Úteis

```bash
# Ver status completo
./deploy.sh status

# Backup antes de atualizar
sudo tar -czf /tmp/parafa-backup-$(date +%Y%m%d).tar.gz /var/www/parafa-frontend

# Logs em tempo real
sudo -u www-data pm2 logs parafa-frontend --lines 100

# Reiniciar tudo
sudo -u www-data pm2 restart parafa-frontend
sudo systemctl restart nginx

# Limpar cache do PM2
sudo -u www-data pm2 flush

# Verificar conectividade com API
curl -f https://api.parafa.com.br/api/empresas
```

## 🎯 Checklist de Deploy

- [ ] Código commitado e testado localmente
- [ ] Build funciona sem erros (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] DNS apontado para o servidor
- [ ] Servidor com dependências instaladas
- [ ] Deploy executado com sucesso
- [ ] PM2 rodando a aplicação
- [ ] Nginx configurado e funcionando
- [ ] SSL configurado e válido
- [ ] Firewall configurado
- [ ] Monitoramento funcionando
- [ ] Backup configurado

## 🆘 Suporte

Em caso de problemas:

1. Verificar logs: `sudo -u www-data pm2 logs`
2. Testar conectividade: `curl -I https://parafa.com.br`
3. Verificar recursos: `htop`, `free -h`
4. Restart da aplicação: `./update.sh`

## 📚 Links Úteis

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)