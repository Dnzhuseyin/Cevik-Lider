# 🚀 Hostinger Deployment Rehberi

## 📁 Dosya Yapısı (Hostinger'a Yüklenecek)

```
public_html/
├── .htaccess                    ✅ (644 izni)
├── index.html                   ✅ (644 izni)
├── account.html                 ✅ (644 izni)
├── courses.html                 ✅ (644 izni)
├── courses.php                  ✅ (644 izni)
├── instructor-content.html      ✅ (644 izni)
├── instructor-content.php       ✅ (644 izni)
├── instructor-courses.html       ✅ (644 izni)
├── instructor-dashboard.html    ✅ (644 izni)
├── instructor-login.html        ✅ (644 izni)
├── instructor-students.html     ✅ (644 izni)
├── instructor-students.php      ✅ (644 izni)
├── module-detail.html           ✅ (644 izni)
├── module-detail.php            ✅ (644 izni)
├── my-notes.html                ✅ (644 izni)
├── progress.html                ✅ (644 izni)
├── register.html                ✅ (644 izni)
├── student-dashboard.html        ✅ (644 izni)
├── student-quiz.html            ✅ (644 izni)
├── css/
│   └── styles.css               ✅ (644 izni)
└── js/
    ├── firebase-production.js   ✅ (644 izni)
    ├── groq-api.js              ✅ (644 izni)
    ├── main.js                  ✅ (644 izni)
    └── user-utils.js            ✅ (644 izni)
```

## ❌ YÜKLENMEYECEK DOSYALAR

- `server.js` ❌ (Development için)
- `simple-server.js` ❌ (Development için)
- `start-server.sh` ❌ (Development için)
- `.git/` ❌ (Git klasörü)
- `README.md` ❌ (Opsiyonel)
- `DEPLOYMENT.md` ❌ (Opsiyonel)

---

## 📤 Hostinger'a Yükleme Adımları

### Yöntem 1: File Manager (Kolay)

1. **Hostinger File Manager'a giriş yapın**
2. **`public_html/` klasörüne gidin**
3. **Tüm dosyaları seçin ve yükleyin:**
   - ✅ Tüm `.html` dosyaları
   - ✅ Tüm `.php` dosyaları
   - ✅ `.htaccess` dosyası
   - ✅ `css/` klasörü (içindeki `styles.css` ile)
   - ✅ `js/` klasörü (içindeki tüm `.js` dosyaları ile)

### Yöntem 2: FTP (Hızlı)

1. **FTP Client kullanın** (FileZilla, WinSCP, Cyberduck)
2. **Hostinger FTP bilgilerinizle bağlanın:**
   - Host: `ftp.ceviklider.com` (veya IP)
   - Username: Hostinger kullanıcı adınız
   - Password: Hostinger şifreniz
   - Port: 21
3. **`public_html/` klasörüne gidin**
4. **Yerel bilgisayarınızdan dosyaları sürükleyip bırakın**

### Yöntem 3: Git (Gelişmiş)

```bash
# Hostinger'da Git yüklüyse:
cd public_html
git clone https://github.com/Dnzhuseyin/Cevik-Lider.git .
```

---

## 🔐 Dosya İzinleri (Permissions)

### File Manager'da Ayarlama:

1. **Dosyaya sağ tıklayın** → **Permissions**
2. **İzinleri ayarlayın:**

| Dosya/Klasör | İzin | Açıklama |
|-------------|------|----------|
| `.htaccess` | **644** | ✅ |
| `*.html` | **644** | ✅ |
| `*.php` | **644** | ✅ |
| `css/` klasörü | **755** | ✅ |
| `css/*.css` | **644** | ✅ |
| `js/` klasörü | **755** | ✅ |
| `js/*.js` | **644** | ✅ |

### Terminal'de Ayarlama (SSH varsa):

```bash
cd public_html

# HTML ve PHP dosyaları
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.php" -exec chmod 644 {} \;

# CSS ve JS dosyaları
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;

# Klasörler
find . -type d -exec chmod 755 {} \;

# .htaccess
chmod 644 .htaccess
```

---

## ✅ Yükleme Sonrası Kontrol Listesi

### 1. Dosya Kontrolleri

- [ ] `.htaccess` dosyası yüklendi mi?
- [ ] `index.html` dosyası yüklendi mi?
- [ ] `js/` klasörü ve içindeki dosyalar yüklendi mi?
- [ ] `css/` klasörü ve içindeki dosyalar yüklendi mi?
- [ ] Tüm `.html` dosyaları yüklendi mi?
- [ ] Tüm `.php` dosyaları yüklendi mi?

### 2. İzin Kontrolleri

- [ ] `.htaccess` → 644
- [ ] `*.html` → 644
- [ ] `*.php` → 644
- [ ] `css/` → 755
- [ ] `css/*.css` → 644
- [ ] `js/` → 755
- [ ] `js/*.js` → 644

### 3. Test Kontrolleri

- [ ] Ana sayfa açılıyor mu? → `https://ceviklider.com`
- [ ] JS dosyaları yükleniyor mu? → `https://ceviklider.com/js/firebase-production.js`
- [ ] CSS dosyası yükleniyor mu? → `https://ceviklider.com/css/styles.css`
- [ ] Console'da hata var mı? (F12 → Console)
- [ ] Firebase bağlantısı çalışıyor mu?

---

## 🐛 Sorun Giderme

### JS Dosyaları Yüklenmiyor

1. **Dosya izinlerini kontrol edin** (644 olmalı)
2. **`.htaccess` dosyasını kontrol edin**
3. **Tarayıcı önbelleğini temizleyin** (Ctrl+Shift+R)
4. **JS dosyasını direkt açmayı deneyin:**
   ```
   https://ceviklider.com/js/firebase-production.js
   ```

### 404 Hatası

1. **`.htaccess` dosyasının varlığını kontrol edin**
2. **Dosya isimlerinde büyük/küçük harf uyumunu kontrol edin**
3. **Dosya yollarını kontrol edin** (`/js/` yerine `js/` olmamalı)

### PHP Dosyaları Çalışmıyor

1. **PHP versiyonunu kontrol edin** (Hostinger'da PHP 8.0+ olmalı)
2. **Dosya izinlerini kontrol edin** (644)
3. **PHP hata loglarını kontrol edin**

---

## 📞 Destek

Sorun yaşarsanız:
1. Browser Console'u kontrol edin (F12)
2. Network tab'ını kontrol edin (hangi dosyalar yüklenmiyor?)
3. Hostinger File Manager'da dosya izinlerini kontrol edin

---

## 🎯 Hızlı Deployment Komutu (SSH varsa)

```bash
# Tüm dosyaları tek seferde yükle
cd public_html
git pull origin main

# İzinleri ayarla
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Test
curl -I https://ceviklider.com
```

---

**✅ Hazır! Artık siteniz yayında!**

