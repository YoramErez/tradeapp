# 🚀 Quick Deployment Guide

## מה צריך לעשות לפני ההעלאה לשרת:

### 1. בדוק שיש לך את כל הקבצים

```
tradeapp/
├── backend/
│   ├── Dockerfile
│   ├── .env.example (קובץ דוגמה)
│   ├── prisma/
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

### 2. צור קובץ .env בשרת

בשרת Contabo, אחרי שתתחבר:
```bash
cd /var/www/tradeapp/backend
nano .env
```

הכנס:
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://tradeapp:YOUR_PASSWORD@postgres:5432/tradeapp
JWT_SECRET=YOUR_RANDOM_SECRET
CORS_ORIGIN=http://YOUR_SERVER_IP
```

**יצירת סיסמאות בטוחות:**
```bash
# פתח קונסול חדש במחשב שלך:
openssl rand -base64 32
# העתק את התוצאה והדבק ב-JWT_SECRET
```

### 3. העתק הכל לשרת

**אפשרות 1: עם SCP (מהמחשב שלך)**
```bash
scp -r /Users/yoramerez/tradeapp root@YOUR_SERVER_IP:/var/www/
```

**אפשרות 2: עם Git (אם העלית ל-GitHub)**
```bash
# בשרת:
cd /var/www
git clone https://github.com/YOUR_USERNAME/tradeapp.git
```

### 4. התקן Docker בשרת

```bash
# תתחבר לשרת:
ssh root@YOUR_SERVER_IP

# התקן Docker:
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# התקן Docker Compose:
apt-get install docker-compose -y
```

### 5. הרץ את האפליקציה

```bash
cd /var/www/tradeapp

# צור קובץ .env:
cd backend
cp .env.example .env
nano .env
# ערוך את הערכים

# רץ את האפליקציה:
cd ..
docker-compose up -d --build

# בדוק שהכל עובד:
docker-compose logs -f
```

### 6. בדוק שהאתר עובד

פתח בדפדפן:
```
http://YOUR_SERVER_IP
```

### 7. שימוש חוזר

כל פעם שתעשה שינוי:
```bash
# בשרת:
cd /var/www/tradeapp
docker-compose down
docker-compose up -d --build
```

## ⚠️ חשוב!

1. **גיבוי מסד נתונים:**
```bash
docker exec tradeapp-db pg_dump -U tradeapp tradeapp > backup.sql
```

2. **סיסמאות חזקות:** אל תשתמש בסיסמאות חלשות ב-.env

3. **פתח פורטים:** ודא שהפורטים 80 ו-4000 פתוחים בחומת האש

## 🆘 פתרון בעיות

**בדוק שהכל רצ:**
```bash
docker ps
```

**צפה בלוגים:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**איפוס מוחלט (זהירות!):**
```bash
docker-compose down -v
docker system prune -a --volumes
```

## 📝 ביצועים

האתר יעבוד על:
- **פורטים:** 80 (Frontend), 4000 (Backend), 5432 (PostgreSQL)
- **רשומות:** כ-200-500MB RAM
- **שטח:** כ-1GB דיסק

## ✅ כל פעולה שהאתר עובד אונליין!

