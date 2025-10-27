# TradeApp - Automated Deployment Guide

This guide explains how to automate your deployment process.

## Quick Setup (Git-based Deployment)

### Option 1: Git + Hook Deployment (Recommended)

This method allows you to push code to your server automatically.

#### Setup on Server:

1. **Create a Git repository on your server:**

```bash
# SSH to your server
ssh username@your_server_ip

# Create project directory
mkdir -p /var/www/tradeapp
cd /var/www/tradeapp

# Initialize git
git init
git config receive.denyCurrentBranch ignore
```

2. **Add a post-receive hook:**

```bash
cat > .git/hooks/post-receive << 'EOF'
#!/bin/bash
cd /var/www/tradeapp
git reset --hard
docker-compose build
docker-compose up -d
EOF

chmod +x .git/hooks/post-receive
```

3. **Configure SSH access:**

```bash
# On your local machine, add your server as a git remote
cd /path/to/your/local/tradeapp
git remote add production username@your_server_ip:/var/www/tradeapp
```

#### Deployment:

```bash
# Every time you want to deploy, just run:
git push production main
```

### Option 2: rsync Script (Simple)

Use the provided `deploy.sh` script:

1. **Edit the script with your server details:**

```bash
nano deploy.sh
```

Update these lines:
```bash
SERVER_USER="your_username"
SERVER_HOST="your_server_ip"
SERVER_PATH="/var/www/tradeapp"
```

2. **Make it executable:**

```bash
chmod +x deploy.sh
```

3. **Deploy:**

```bash
./deploy.sh
```

### Option 3: Manual rsync (One-time)

If you prefer to upload manually:

```bash
# Upload files
rsync -avz --exclude 'node_modules' --exclude '.env' \
  --exclude '.git' --exclude 'dist' --exclude 'build' \
  ./ username@server:/var/www/tradeapp/

# SSH and restart
ssh username@server "cd /var/www/tradeapp && docker-compose up -d --build"
```

### Option 4: GitHub Actions (Advanced)

For professional CI/CD:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/tradeapp
          git pull
          docker-compose build
          docker-compose up -d
```

2. Add secrets in GitHub Settings → Secrets

3. Every push to `main` branch will automatically deploy!

## Recommended Workflow

1. **Development:** Work locally and test
2. **Commit:** `git add . && git commit -m "Your changes"`
3. **Deploy:** `./deploy.sh` or `git push production`
4. **Done!** Website updates automatically

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :80

# Kill the process
kill -9 <PID>
```

### Docker Issues
```bash
# View logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues
Check `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@db:5432/tradeapp"
```

## Security Tips

1. **Use environment variables for sensitive data**
2. **Don't commit `.env` files**
3. **Use HTTPS for production**
4. **Enable firewall on server:**
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

5. **Change default passwords**

## Quick Commands Reference

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec db psql -U postgres -d tradeapp
```

