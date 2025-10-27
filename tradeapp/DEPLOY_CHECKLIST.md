# ✅ Production Deployment Checklist for TradeApp

## 📋 Summary

**Build Command:** `npm run build` (already executed ✅)
**Output Folder:** `/Users/yoramerez/tradeapp/frontend/dist/`
**Upload Location:** Server `/var/www/tradeapp/public/`
**Files Required:** Complete `dist/` directory

---

## 📦 Step 1: Upload Files

Upload **these exact files/folders** from `frontend/dist/` to your server:

```
✅ index.html
✅ assets/
   ├── index-59747895.js
   └── index-249771e5.css
✅ vite.svg
```

**Server Destination:** `/var/www/tradeapp/public/`

The `public/` folder becomes your web root.

---

## ⚙️ Step 2: Nginx Configuration

Update your Nginx config (e.g., `/etc/nginx/sites-available/tradeapp`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/tradeapp/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Important:**
- ✅ `root /var/www/tradeapp/public;` (NOT `/var/www/tradeapp/`)
- ✅ `try_files $uri $uri/ /index.html;` for React Router
- ✅ `/api` proxied to backend on port 4000

---

## 🔍 Step 3: Verification Checklist

After deployment, verify each item:

### 3.1 File Structure
```bash
# SSH to server
ls -R /var/www/tradeapp/public/

# Should show:
# index.html
# assets/
#   ├── index-59747895.js
#   └── index-249771e5.css
# vite.svg
```

### 3.2 Permissions
```bash
# Set correct permissions
sudo chown -R www-data:www-data /var/www/tradeapp/public/
sudo chmod -R 755 /var/www/tradeapp/public/
```

### 3.3 Nginx Config
```bash
# Test config
sudo nginx -t

# If OK, reload
sudo systemctl reload nginx
```

### 3.4 Static Files Serve
- Open browser DevTools (F12)
- Network tab → filter JS
- Visit `http://your-server/`
- ✅ Should load `index.html` (status 200)
- ✅ Should load JS bundle (status 200)
- ✅ Should load CSS bundle (status 200)
- ❌ If 403 → check permissions
- ❌ If 404 → wrong root path

### 3.5 React App Loads
- Visit `http://your-server/` in browser
- ✅ Page loads without blank screen
- ✅ No 403 errors
- ✅ App shows login/register page

### 3.6 API Connection
- Try to register a user
- ✅ Backend responds (check Network tab → API call should hit `/api/auth/register`)
- ✅ If API fails → backend not running or wrong proxy config

---

## 🐛 Common Issues & Fixes

### Issue 1: 403 Forbidden
**Cause:** Wrong permissions or wrong root path

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/tradeapp/public/
sudo chmod -R 755 /var/www/tradeapp/public/

# Check Nginx user
grep "user" /etc/nginx/nginx.conf
```

### Issue 2: Blank Page
**Cause:** Missing `index.html` or wrong root

```bash
# Verify root path
sudo nginx -T | grep root

# Should show: root /var/www/tradeapp/public;
```

### Issue 3: 404 on Refresh
**Cause:** Missing `try_files` rule for SPA routing

```nginx
# Must have this in location /
try_files $uri $uri/ /index.html;
```

### Issue 4: API Not Working
**Cause:** Backend not running or proxy not configured

```bash
# Check backend is running
curl http://localhost:4000/api/health

# Check Docker containers
docker ps
docker-compose ps
```

---

## 📝 Quick Test Commands

```bash
# 1. Verify files uploaded
ls -R /var/www/tradeapp/public/

# 2. Check permissions
ls -la /var/www/tradeapp/public/

# 3. Test Nginx config
sudo nginx -t

# 4. Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# 5. Test static file serving
curl -I http://localhost/

# 6. Test API proxy
curl -I http://localhost/api/
```

---

## 🎯 Final Checklist Before Going Live

- [ ] All files uploaded to `/var/www/tradeapp/public/`
- [ ] `index.html` exists in public folder
- [ ] `assets/` folder exists with JS and CSS
- [ ] Correct permissions (www-data:www-data, 755)
- [ ] Nginx root points to `public/` folder
- [ ] `try_files` rule configured for React Router
- [ ] Backend running on port 4000
- [ ] `/api` proxy configured and working
- [ ] Browser shows login page (not 403)
- [ ] Network tab shows JS/CSS loaded successfully
- [ ] API calls work (can register user)

---

## 📊 Production Ready Summary

✅ **Build command:** `npm run build`
✅ **Output folder:** `frontend/dist/`
✅ **Upload location:** Server `/var/www/tradeapp/public/`
✅ **Nginx root:** `/var/www/tradeapp/public;`
✅ **React Router:** Configured with `try_files`
✅ **Static files:** All relative paths work
✅ **API proxy:** `/api` → `http://localhost:4000`

Your production build is ready! 🚀

