# 🔐 Setting Up SSH for Contabo Server

## Step 1: Get Your Server Details

You need:
- **Server IP Address**
- **SSH Username** (usually `root`)
- **SSH Password** or **SSH Key**

Find these in your Contabo control panel.

## Step 2: Test Connection

```bash
# Test if you can connect
ssh root@YOUR_SERVER_IP

# If it asks for password, enter it
# If it says "Permission denied", you might need to set up SSH key
```

## Step 3: Setup SSH Key (Recommended)

This allows passwordless login:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter to accept default location
# Press Enter twice to use no passphrase (or set one)

# Copy public key to server
ssh-copy-id root@YOUR_SERVER_IP

# Enter password when prompted

# Test - should NOT ask for password
ssh root@YOUR_SERVER_IP
```

## Step 4: Edit the Scripts

Edit these files with your server details:

```bash
# Edit setup script
nano setup_server.sh

# Change these lines:
SERVER_USER="root"  # Your SSH username
SERVER_HOST="YOUR_IP_HERE"  # Your server IP

# Save and exit: Ctrl+X, then Y
```

Same for `deploy_update.sh`:

```bash
nano deploy_update.sh
# Edit SERVER_USER and SERVER_HOST
```

## Step 5: Run Setup

```bash
# Make scripts executable
chmod +x setup_server.sh
chmod +x deploy_update.sh

# Run initial setup
./setup_server.sh
```

This will:
1. Install Git and Docker on server
2. Clone your code from GitHub
3. Setup environment
4. Build and start containers

## Step 6: Configure Environment

After setup, edit the `.env` file:

```bash
# SSH to server
ssh root@YOUR_SERVER_IP

# Edit environment file
cd /var/www/tradeapp/backend
nano .env
```

Add your configuration:

```env
DATABASE_URL="postgresql://postgres:your_strong_password@db:5432/tradeapp"
JWT_SECRET="generate_random_string_here"
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://yourdomain.com"
```

Generate secrets:

```bash
# On your local machine, generate random strings:
openssl rand -base64 32
# Use this for JWT_SECRET

openssl rand -base64 64
# Use this for database password
```

Save and restart:

```bash
cd /var/www/tradeapp
docker-compose down
docker-compose up -d
```

## Future Updates

Every time you want to update your site:

```bash
# Local machine - push changes
git add .
git commit -m "Your changes"
git push

# Deploy to server
./deploy_update.sh
```

Or SSH and pull manually:

```bash
ssh root@YOUR_SERVER_IP
cd /var/www/tradeapp
git pull
docker-compose down && docker-compose up -d --build
```

## Troubleshooting

**Can't connect via SSH:**
```bash
# Check if server is running
ping YOUR_SERVER_IP

# Check if port 22 is open
nmap -p 22 YOUR_SERVER_IP
```

**Docker not found:**
```bash
# SSH to server
ssh root@YOUR_SERVER_IP

# Install Docker manually
apt-get update
apt-get install -y docker.io docker-compose
systemctl start docker
```

**Can't pull from GitHub:**
```bash
# On server
cd /var/www/tradeapp
git remote -v
# Should show: https://github.com/YoramErez/tradeapp.git

# If empty or wrong:
git remote set-url origin https://github.com/YoramErez/tradeapp.git
git pull origin main
```

## Quick Commands

```bash
# View logs
ssh root@YOUR_SERVER_IP
cd /var/www/tradeapp
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Start again
docker-compose up -d

# Check status
docker-compose ps
```

