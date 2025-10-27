# 🔄 How to Update Your Server

## Current Status
✅ Code is now on GitHub: https://github.com/YoramErez/tradeapp

## Next Step: Update Your Server to Use Git

Instead of manually uploading files, your server will pull from GitHub automatically!

### Option 1: Quick Update (SSH to your server)

```bash
# Connect to your server
ssh username@your_server_ip

# Navigate to project directory
cd /var/www/tradeapp

# Stop current containers
docker-compose down

# Clone from GitHub (or pull if already exists)
git clone https://github.com/YoramErez/tradeapp.git temp
# Or if directory exists:
# cd /var/www/tradeapp && git pull

# Move to new directory
cd temp
# Or: cd /var/www/tradeapp

# Setup environment
cd backend
cp .env.example .env
nano .env  # Edit with your values

# Build and start
cd ..
docker-compose up -d --build
```

### Option 2: Automatic Deployment (Recommended)

Once this is set up, every `git push` will automatically update your server!

1. **Add SSH key to GitHub:**
   ```bash
   # Generate key if you don't have one
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Copy public key
   cat ~/.ssh/id_ed25519.pub
   # Add this to GitHub: Settings → SSH Keys
   ```

2. **On your server, create deploy hook:**
   ```bash
   # SSH to server
   ssh username@your_server
   
   # Setup Git repository
   cd /var/www/tradeapp
   git pull origin main
   
   # Make script executable
   chmod +x .github/workflows/deploy.sh
   
   # Test deployment
   .github/workflows/deploy.sh
   ```

3. **Future updates become automatic!**

## Daily Workflow

After setup, updating your site is simple:

```bash
# Make your changes
# ... edit files in your IDE ...

# Commit and push
git add .
git commit -m "Description of changes"
git push

# Server will automatically update!
```

## Manual Update (if needed)

If you need to manually update the server:

```bash
ssh username@your_server
cd /var/www/tradeapp
git pull
docker-compose down
docker-compose up -d --build
```

That's it! No more ZIP files! 🎉

