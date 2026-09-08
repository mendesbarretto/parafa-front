# 🚀 Deploy Rápido - Parafa Frontend

## TL;DR - Comandos Essenciais

### 🛠️ Setup Inicial (Uma vez)
```bash
# No servidor Ubuntu
cd /caminho/para/parafa-nextjs/
sudo ./deploy.sh
```

### 🔄 Atualizações (Sempre que mudar código)
```bash
# No servidor
./update.sh
```

### 🩺 Verificar se está tudo funcionando
```bash
./check-health.sh
```

---

## 📋 Checklist Rápido

### Antes do Deploy
- [ ] Código testado localmente (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] API backend funcionando
- [ ] Domínio apontado para o servidor

### Deploy
- [ ] Executar `sudo ./deploy.sh`
- [ ] Verificar se site abre: `https://parafa.com.br`
- [ ] Verificar logs: `sudo -u www-data pm2 logs`

### Manutenção
- [ ] Monitorar logs regularmente
- [ ] Fazer backup antes de grandes mudanças
- [ ] Renovar SSL a cada 3 meses (automático)

---

## 🆘 Problemas Comuns

### Site não abre
```bash
# Verificar PM2
sudo -u www-data pm2 status
sudo -u www-data pm2 restart parafa-frontend

# Verificar Nginx
sudo systemctl status nginx
sudo nginx -t && sudo systemctl restart nginx
```

### SSL não funciona
```bash
sudo certbot renew
sudo systemctl restart nginx
```

### Performance baixa
```bash
# Aumentar instâncias
sudo -u www-data pm2 scale parafa-frontend 4

# Verificar recursos
htop
```

---

## 📞 Comandos de Emergência

```bash
# Parar tudo
sudo -u www-data pm2 stop all
sudo systemctl stop nginx

# Iniciar tudo
sudo systemctl start nginx
sudo -u www-data pm2 start parafa-frontend

# Reset completo
sudo -u www-data pm2 kill
sudo ./deploy.sh deploy

# Backup de emergência
sudo tar -czf /tmp/backup-$(date +%Y%m%d).tar.gz /var/www/parafa-frontend
```

---

## 📊 Monitoramento

- **Site:** https://parafa.com.br
- **Logs:** `sudo -u www-data pm2 logs parafa-frontend`
- **Status:** `sudo -u www-data pm2 monit`
- **Recursos:** `htop`

---

**💡 Dica:** Sempre teste localmente antes de fazer deploy!