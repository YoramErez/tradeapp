FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

