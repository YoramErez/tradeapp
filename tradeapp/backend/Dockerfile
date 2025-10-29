FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

# Try to build, but continue even if it fails
RUN npm run build || echo "Build failed, will use ts-node"

EXPOSE 4000

# Use ts-node if build failed, otherwise use compiled version
CMD sh -c "if [ -f dist/server.js ]; then node dist/server.js; else npx ts-node src/server.ts; fi"

