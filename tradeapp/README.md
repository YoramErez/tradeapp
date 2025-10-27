# TradeApp - Peer-to-Peer Trading Platform

A modern web application for peer-to-peer item trading with a Tinder-style swipe interface.

## Features

- 🔐 User Authentication (Register/Login)
- 📝 Listings Management (Create, View, Delete)
- 👆 Swipe Interface for browsing items
- ❤️ Like items for potential trades
- 📱 Responsive Design
- 🎨 Beautiful UI with CSS Modules

## Tech Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Vite, CSS Modules
- **Deployment:** Docker, Docker Compose

## Deployment on Contabo Server

### Prerequisites

- Contabo VPS with Ubuntu 20.04+
- SSH access to the server
- Domain name (optional)

### Setup Instructions

1. **Connect to your server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   apt-get install docker-compose -y
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tradeapp.git
   cd tradeapp
   ```

4. **Create environment file:**
   ```bash
   cd backend
   cp .env.example .env
   nano .env
   ```

   Set the following variables:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=postgresql://tradeapp:YOUR_STRONG_PASSWORD@postgres:5432/tradeapp
   JWT_SECRET=YOUR_RANDOM_SECRET_HERE
   CORS_ORIGIN=https://yourdomain.com
   ```

5. **Start the application:**
   ```bash
   cd ..
   docker-compose up -d
   ```

6. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Using Nginx as Reverse Proxy (Optional)

If you want to use a domain name:

```bash
apt-get install nginx -y

nano /etc/nginx/sites-available/tradeapp
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/tradeapp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### SSL with Let's Encrypt (Optional)

```bash
apt-get install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

## Maintenance

**Update the application:**
```bash
git pull
docker-compose down
docker-compose up -d --build
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop application:**
```bash
docker-compose down
```

**Backup database:**
```bash
docker exec tradeapp-db pg_dump -U tradeapp tradeapp > backup.sql
```

## Development

**Start locally:**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## License

MIT

