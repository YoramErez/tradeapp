# 🌐 TradeApp - Site Status

## ✅ מה עובד

1. **Frontend**: רץ וזמין ב- http://207.180.246.111:8080
2. **Backend**: רץ וזמין ב- http://207.180.246.111:4000  
3. **GitHub**: https://github.com/YoramErez/tradeapp
4. **Docker**: מותקן ועובד בשרת

## ⚠️ מה צריך לתקן

### בעיה: PostgreSQL לא עובד

**הסיבה**: חסרים משתני סביבה ב-`docker-compose.yml`

### פתרון מהיר:

**SSH לשרת:**
```bash
ssh root@207.180.246.111
cd /var/www/tradeapp
```

**ערוך `docker-compose.yml`:**
```bash
nano docker-compose.yml
```

**עדכן את השורות:**
```yaml
environment:
  POSTGRES_DB: tradeapp
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: tradeapp2024  # שים סיסמה חזקה
```

**כמו כן בעדש `backend`:**
```yaml
environment:
  JWT_SECRET: your_random_secret_key_here
```

**שמור וצא:** Ctrl+X, Y, Enter

**הפעל מחדש:**
```bash
docker-compose down
docker-compose up -d
```

## 📍 כתובות

- **Frontend**: http://207.180.246.111:8080
- **Backend API**: http://207.180.246.111:4000
- **Health Check**: http://207.180.246.111:4000/api/health

## 🔄 עדכון עתידי

בכל שינוי בקוד:

```bash
# במחשב שלך
git add .
git commit -m "השינויים שלך"
git push

# SSH לשרת ועדכן
ssh root@207.180.246.111
cd /var/www/tradeapp
git pull
docker-compose down
docker-compose up -d --build
```

## 📝 הערות

1. פורט 80 תפוס על ידי nginx קיים, לכן Frontend עובד על 8080
2. ליצור DNS ספציפי או להעביר nginx קיים להפנות ל-8080
3. הדפסה: `docker logs tradeapp-backend` להראות שגיאות

## ✅ סיכום

האתר עובד! רק צריך לתקן את משתני ה-`.env` של PostgreSQL.

