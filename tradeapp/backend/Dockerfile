FROM node:20-alpine3.21

RUN apk add --no-cache openssl1.1-compat libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]

