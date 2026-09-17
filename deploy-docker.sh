#!/bin/bash

set -e

echo "🐳 Deploy do Parafa Frontend"

SERVER_USER="${SERVER_USER:-root}"
SERVER_IP="${SERVER_IP:-147.182.248.223}"
SERVER_PATH="${SERVER_PATH:-/home/parafa-front}"
IMAGE_NAME="${IMAGE_NAME:-parafa-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
ARCHIVE="${IMAGE_NAME}.tar.gz"

cleanup() {
	rm -f "$ARCHIVE"
}
trap cleanup EXIT

echo "📦 Buildando imagem localmente: $IMAGE"
docker build -t "$IMAGE" .

echo "💾 Exportando imagem..."
docker save "$IMAGE" | gzip > "$ARCHIVE"

echo "📤 Enviando imagem e compose para ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}..."
ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p '${SERVER_PATH}'"
scp "$ARCHIVE" docker-compose.yml "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

echo "🔄 Atualizando container no servidor..."
ssh "${SERVER_USER}@${SERVER_IP}" "SERVER_PATH='${SERVER_PATH}' ARCHIVE='${ARCHIVE}' IMAGE_NAME='${IMAGE_NAME}' IMAGE_TAG='${IMAGE_TAG}' bash -s" <<'ENDSSH'
set -e
cd "$SERVER_PATH"

echo "📥 Carregando imagem..."
docker load < "$ARCHIVE"

if docker compose version >/dev/null 2>&1; then
	COMPOSE="docker compose"
else
	COMPOSE="docker-compose"
fi

echo "🛑 Parando versão anterior..."
$COMPOSE down --remove-orphans || true
docker rm -f parafa-frontend 2>/dev/null || true

echo "🚀 Iniciando nova versão..."
$COMPOSE up -d --no-build frontend
rm -f "$ARCHIVE"

echo "⏳ Aguardando health check..."
for attempt in $(seq 1 15); do
	if curl --fail --silent http://localhost:3000/api/health >/dev/null; then
		break
	fi
	if [ "$attempt" -eq 15 ]; then
		echo "❌ Frontend não respondeu ao health check"
		docker logs --tail 50 parafa-frontend || true
		exit 1
	fi
	sleep 2
done

echo "📊 Status:"
docker ps --filter name=parafa-frontend
echo "📋 Logs recentes:"
docker logs --tail 30 parafa-frontend || true
ENDSSH

echo "✅ Deploy concluído: http://${SERVER_IP}:3000"