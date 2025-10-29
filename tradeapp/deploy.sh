#!/bin/bash

# TradeBus - Automated Deploy Script
# This script uploads your local changes to the server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TradeBus Deploy Script ===${NC}"

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Error: backend/.env not found${NC}"
    echo "Please create backend/.env file first"
    exit 1
fi

# Server configuration (UPDATE THESE!)
SERVER_USER="your_username"
SERVER_HOST="your_server_ip"
SERVER_PATH="/path/to/tradeapp"

echo -e "${YELLOW}Uploading files to server...${NC}"

# Upload files (excluding node_modules, .env, etc.)
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude 'dist' \
  --exclude 'build' \
  --exclude '.git' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  ./ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

echo -e "${GREEN}Files uploaded successfully!${NC}"
echo -e "${YELLOW}Connecting to server to build and restart...${NC}"

# SSH to server and run docker-compose
ssh ${SERVER_USER}@${SERVER_HOST} << EOF
  cd ${SERVER_PATH}
  echo "Building Docker images..."
  docker-compose build
  echo "Restarting services..."
  docker-compose up -d
  echo "Done!"
  docker-compose ps
EOF

echo -e "${GREEN}Deployment complete!${NC}"
