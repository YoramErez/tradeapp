#!/bin/bash

# Simple deploy script for server

cd /var/www/tradebus/tradeapp || exit 1

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose build
docker-compose up -d

# Show logs
docker-compose logs --tail=50

echo "✅ Deployment complete!"

