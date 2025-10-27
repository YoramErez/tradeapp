#!/bin/bash
# Run TradeApp Backend without Docker

cd /var/www/tradebus/backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start backend
npm run dev

