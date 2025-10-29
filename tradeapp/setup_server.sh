#!/bin/bash

# TradeBus - Server Setup Script
# This script sets up your TradeBus on Contabo server

set -e

# Configuration - UPDATE THESE!
SERVER_USER="root"  # Change if different
SERVER_HOST="207.180.246.111"      # Enter your Contabo IP
SERVER_PATH="/var/www/tradebus/tradeapp"
GITHUB_REPO="https://github.com/YoramErez/tradeapp.git"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== TradeBus Server Setup ===${NC}"

# Check if server details are provided
if [ -z "$SERVER_HOST" ]; then
    echo -e "${RED}Please edit this script and set SERVER_HOST${NC}"
    echo "Example: SERVER_HOST=\"your.server.ip\""
    exit 1
fi

echo -e "${YELLOW}Connecting to server...${NC}"

# SSH to server and setup
ssh ${SERVER_USER}@${SERVER_HOST} << 'REMOTE_SCRIPT'
set -e

echo "📦 Installing required tools..."
apt-get update
apt-get install -y git docker.io docker-compose

echo "🔧 Starting Docker..."
systemctl start docker
systemctl enable docker

echo "📥 Cloning TradeBus from GitHub..."
cd /var/www
mkdir -p tradebus
cd tradebus
rm -rf tradeapp  # Remove old version if exists
git clone https://github.com/YoramErez/tradeapp.git
cd tradeapp

echo "⚙️ Setting up environment..."
cd backend
if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env file - PLEASE EDIT IT with your values!"
fi

echo "🚀 Building and starting containers..."
cd /var/www/tradebus/tradeapp
docker-compose up -d --build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. SSH to server: ssh root@your_server"
echo "2. Edit .env: cd /var/www/tradebus/tradeapp/backend && nano .env"
echo "3. Restart: cd /var/www/tradebus/tradeapp && docker-compose restart"
echo ""
echo "Check logs: docker-compose logs -f"

REMOTE_SCRIPT

echo -e "${GREEN}✅ Server setup initiated!${NC}"
echo ""
echo "To check status:"
echo "  ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  cd ${SERVER_PATH} && docker-compose ps"
echo ""
echo "To view logs:"
echo "  ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  cd ${SERVER_PATH} && docker-compose logs -f"

