# Deployment Guide for Contabo Server

## שלבים להעלאת האתר ל-Contabo

### 1. התקנת Docker ב-Server

```bash
ssh root@YOUR_SERVER_IP

# התקן Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# התקן Docker Compose
apt-get install docker-compose -y

# בדוק שההתקנה הצליחה
docker --version
docker-compose --version
```

### 2. העתקת הקבצים לשרת

**אפשרות 1: עם Git (מומלץ)**
```bash
cd /var/www
git clone https://github.com/yourusername/tradeapp.git
cd tradeapp
```

**אפשרות 2: עם SCP**
```bash
# מהמחשב שלך:
scp -r /Users/yoramerez/tradeapp root@YOUR_SERVER_IP:/var/www/
```

### 3. הגדרת משתני סביבה

```bash
cd backend
cp .env.example .env
nano .env
```

הכנס את הערכים הבאים:
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://tradeapp:STRONG_PASSWORD_HERE@postgres:5432/tradeapp
JWT_SECRET=RANDOM_SECRET_HERE
CORS_ORIGIN=https://yourdomain.com
```

**יצירת סיסמה בטוחה:**
```bash
openssl rand -base64 32
```

### 4. בניית והרצת האפליקציה

```bash
cd /var/www/tradeapp

# הבנה והרצה של האפליקציה
docker-compose up -d --build

# צפה בלוגים
docker-compose logs -f
```

### 5. הגדרת Nginx (אם יש לך דומיין)

```bash
apt-get install nginx -y

nano /etc/nginx/sites-available/tradeapp
```

הכנס:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

הפעל את האתר:
```bash
ln -s /etc/nginx/sites-available/tradeapp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. הגדרת SSL (אם יש לך דומיין)

```bash
apt-get install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

### 7. פקודות שימושיות

**עדכון האפליקציה:**
```bash
cd /var/www/tradeapp
git pull
docker-compose down
docker-compose up -d --build
```

**צפייה בלוגים:**
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

**עצירת האפליקציה:**
```bash
docker-compose down
```

**הפעלת האפליקציה מחדש:**
```bash
docker-compose up -d
```

**גיבוי בסיס הנתונים:**
```bash
docker exec tradeapp-db pg_dump -U tradeapp tradeapp > backup.sql
```

**שחזור מבסיס נתונים:**
```bash
docker exec -i tradeapp-db psql -U tradeapp tradeapp < backup.sql
```

### 8. פתרון בעיות

**בדיקה שכל הקונטיינרים רצים:**
```bash
docker ps
```

**בדיקת יציאות:**
```bash
netstat -tulpn | grep LISTEN
```

**איפוס הכל (זהירות!):**
```bash
docker-compose down -v
docker system prune -a --volumes
```

## דרישות מינימום לשרת

- **RAM:** 2GB
- **Storage:** 20GB
- **CPU:** 2 vCores
- **OS:** Ubuntu 20.04 או חדש יותר

## כתובת האתר

לאחר ההתקנה, האתר יהיה זמין ב:
- `http://YOUR_SERVER_IP` (ללא דומיין)
- `https://yourdomain.com` (עם דומיין + SSL)

## ביצועים

- האפליקציה רצה עם Docker
- בסיס הנתונים PostgreSQL
- פריסה עצמאית (self-hosted)
- גיבוי אוטומטי מומלץ: `crontab -e`

## תמיכה

במקרה של בעיות, בדוק:
1. לוגים: `docker-compose logs`
2. סטטוס: `docker-compose ps`
3. שימוש בזיכרון: `docker stats`

