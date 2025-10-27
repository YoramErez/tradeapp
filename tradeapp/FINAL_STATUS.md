# ✅ TradeApp - Site is LIVE!

## 🌐 כתובת האתר

**Frontend:** http://207.180.246.111  
**Backend API:** http://207.180.246.111:4000

## 📍 מיקום השרת

הקבצים בשרת נמצאים ב: `/var/www/tradebus`

## ⚠️ בעיה ידועה

**PostgreSQL מתחיל מחדש** - צריך לתקן משתני סביבה

### תיקון מהיר:

```bash
ssh root@207.180.246.111
cd /var/www/tradebus
nano docker-compose.yml
```

עדכן:
```yaml
environment:
  POSTGRES_PASSWORD: your_strong_password_here
  JWT_SECRET: your_random_secret_key_here
```

שמור ואז:
```bash
docker-compose down
docker-compose up -d
```

## 🔄 עדכון עתידי

```bash
# במחשב שלך
git add .
git commit -m "השינויים"
git push

# SSH לשרת
ssh root@207.180.246.111
cd /var/www/tradebus
git pull
docker-compose down
docker-compose up -d --build
```

## 📝 מצב נוכחי

- ✅ Frontend עובד על פורט 80
- ✅ Backend עובד על פורט 4000
- ⚠️ PostgreSQL צריך עדכון משתני סביבה
- ✅ GitHub: https://github.com/YoramErez/tradeapp

