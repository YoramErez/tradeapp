# 🤖 Setting Up Automated Deployment

## What This Does

Once set up, you'll be able to:
- Make changes locally
- Push to GitHub with `git push`
- Changes automatically deploy to your server!

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository called `tradeapp`
3. **Don't** initialize with README (we already have code)
4. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/tradeapp.git`)

## Step 2: Push to GitHub

```bash
cd /Users/yoramerez/tradeapp

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/tradeapp.git

# Push to GitHub
git push -u origin main
```

## Step 3: Setup Server for Git

SSH to your server and run:

```bash
# Install Git if not already installed
sudo apt-get update
sudo apt-get install -y git

# Clone the repository
cd /var/www
rm -rf tradeapp  # Remove old files if exists
git clone https://github.com/YOUR_USERNAME/tradeapp.git
cd tradeapp

# Setup environment
cd backend
cp .env.example .env
nano .env  # Edit with your values

# Build and start
cd ..
docker-compose up -d --build
```

## Step 4: Configure GitHub Actions (Optional but Recommended)

### If you want automatic deployment on every push:

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `SERVER_HOST`: Your server IP
   - `SERVER_USER`: Your SSH username (e.g., `root`)
   - `SSH_KEY`: Your private SSH key (for passwordless login)

### Or use manual deployment:

After pushing changes to GitHub:

```bash
ssh user@your_server
cd /var/www/tradeapp
git pull
docker-compose down
docker-compose up -d --build
```

## Step 5: Setup SSH Key for Passwordless Login

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy key to server
ssh-copy-id user@your_server_ip

# Test
ssh user@your_server_ip
```

## Alternative: Simple Deploy Script

I've created `deploy.sh` that you can run locally to deploy:

```bash
# Edit deploy.sh with your server details first
nano deploy.sh

# Then run
chmod +x deploy.sh
./deploy.sh
```

## Daily Workflow

After setup, updating your site is simple:

```bash
# Make your changes locally
# ... edit files ...

# Commit and push
git add .
git commit -m "Your changes"
git push

# On server (or automated):
git pull && docker-compose up -d --build
```

That's it! No more ZIP files! 🎉

