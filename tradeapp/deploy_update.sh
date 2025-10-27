#!/bin/bash

# TradeApp - Update Server Script
# Use this after initial setup to update server with latest changes

set -e

# Configuration - UPDATE THESE!
SERVER_USER="root"  # Change if different
SERVER_HOST="207.180.246.111"      # Enter your Contabo IP
SERVER_PATH="/var/www/tradeapp"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== TradeApp Server Update ===${NC}"

# Check if server details are provided
if [ -z "$SERVER_HOST" ]; then
    echo -e "${RED}Please edit this script and set SERVER_HOST${NC}"
    echo "Example: SERVER_HOST=\"your.server.ip\""
    exit 1
fi

echo -e "${YELLOW}Connecting to server to update...${NC}"

# SSH to server and update
ssh ${SERVER_USER}@${SERVER_HOST} << 'REMOTE_SCRIPT'
set -e

cd /var/www/tradeapp

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "🛑 Stopping containers..."
docker-compose down

echo "🔨 Building new containers..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

echo "📊 Checking status..."
docker-compose ps

echo "✅ Update complete!"

REMOTE_SCRIPT

echo -e "${GREEN}✅ Server updated successfully!${NC}"

