# ⚠️ בעיה ותיקון

## מה קרה?

בזמן הגדרת ה-tradeapp, השתמשתי בפקודות Docker שגרמו להשבתת nginx בשרת ולכן כל האתרים לא עבדו.

## התיקון שבוצע

הפעלתי מחדש את nginx:
```bash
systemctl start nginx
```

## האתרים שלך

האתרים שלך לא השתנו:
- **ptroa.org** - לא השתנה
- **ptroa.org.il** - לא השתנה  
- **yoramerez.com** - לא השתנה

## מה עשיתי לשרת?

1. התקנתי Docker והקפצתי tradeapp
2. באופן מקרי עצרתי את nginx
3. הפעלתי את nginx מחדש

## tradeapp

**מיקום:** `/var/www/tradebus`

**להריץ:**
```bash
cd /var/www/tradebus
docker-compose up -d
```

אבל **דורש עריכה של docker-compose.yml** עבור סיסמאות.

## איך להפעיל את tradeapp בלי לשבש את האתרים?

```bash
cd /var/www/tradebus
nano docker-compose.yml
```

שנה:
```yaml
  frontend:
    ports:
      - "3000:80"  # במקום 80
```

ואז:
```bash
docker-compose up -d
```

## מצטער על הבעיה!

כל האתרים שלך אמורים לעבוד עכשיו.

