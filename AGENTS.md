# Parafa Next.js Project - Deployment & Security Guide

## Project Overview
This is the Next.js frontend for parafa.4.0, migrated from TanStack Start (Lovable) to Next.js with App Router.

## Build & Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose build
docker-compose up -d
```

## Security Features Implemented

### 1. Rate Limiting & Bot Detection
- **Rate Limiting**: 60 requests per minute per IP
- **Bot Detection**: Blocks malicious bots while allowing Googlebot/Bingbot
- **Implementation**: Custom middleware in `src/middleware.ts`

### 2. Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Configured in `next.config.ts`

### 3. Health Check
- Endpoint: `/api/health`
- Docker health check configured in `docker-compose.yml`

## SEO Configuration

### Meta Tags
- All pages have proper title, description, and Open Graph tags
- Twitter card support
- Dynamic metadata for category and state pages

### Performance
- Static generation for static pages
- Server-side rendering for dynamic pages
- Image optimization configured

## Cloudflare Recommended Configurations

### 1. Bot Fight Mode
**Purpose**: Automatically blocks sophisticated bots that bypass traditional bot detection.

**Configuration**:
- Enable Bot Fight Mode in Cloudflare Dashboard → Security → Bots
- This complements our server-side bot detection
- Will challenge suspicious bot traffic

### 2. Rate Limiting Rules
**Purpose**: Add an additional layer of rate limiting at the CDN level.

**Configuration**:
```
Rate Limiting Rule:
- Path: *
- Rate limit: 100 requests per 10 minutes per IP
- Action: Challenge
- Description: "API abuse protection"
```

### 3. Page Rules (Cache Rules)
**Purpose**: Optimize caching for static assets and pages.

**Configuration**:
```
Rule 1: Cache Static Assets
- URL pattern: *parafa.com.br/_next/static/*
- Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 year

Rule 2: Cache Images
- URL pattern: *parafa.com.br/images/*
- Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 month

Rule 3: Cache Static Pages
- URL pattern: *parafa.com.br/*
- Settings: Cache Level: Standard, Edge Cache TTL: 2 hours
- Bypass Cache on Cookie: Disabled
- Browser Cache TTL: 4 hours
```

### 4. Security Settings
**Purpose**: Additional security hardening.

**Configuration**:
- **SSL/TLS**: Full (strict) mode
- **Always Use HTTPS**: Enabled
- **Automatic HTTPS Rewrites**: Enabled
- **Brotli Compression**: Enabled
- **HSTS**: Enabled with max-age of 6 months

### 5. Firewall Rules
**Purpose**: Block known malicious patterns.

**Configuration**:
```
Rule 1: Block SQL Injection Attempts
- Expression: (http.request.uri.path contains "union" or http.request.uri.path contains "select" or http.request.uri.path contains "drop")
- Action: Block

Rule 2: Block XSS Attempts
- Expression: (http.request.uri.path contains "<script" or http.request.uri.path contains "javascript:")
- Action: Block
```

## Docker Configuration

### Resource Limits
- CPU Limit: 2 cores
- Memory Limit: 2GB
- CPU Reservation: 1 core
- Memory Reservation: 1GB

### Build Optimization
- Multi-stage build with Alpine Linux
- Standalone output for minimal production image
- Separate dependencies and build stages

## Monitoring & Maintenance

### Health Checks
- Docker health check runs every 30 seconds
- Health endpoint: `http://localhost:3000/api/health`
- Returns status, timestamp, and uptime

### Logs
- Docker logs: `docker-compose logs`
- Application logs available via container logs

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm ci`
- Check TypeScript errors: `npm run build`
- Verify middleware configuration

### Docker Issues
- Check if port 3000 is available
- Verify Docker daemon is running
- Review docker-compose logs for errors

### Performance Issues
- Check Cloudflare cache hit rate
- Review server resources via Docker stats
- Monitor rate limiting logs
