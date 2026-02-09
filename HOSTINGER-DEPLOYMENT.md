# Hostinger Deployment Talimatları

## 📋 Gereksinimler

- Hostinger hesabı (Shared Hosting veya Premium)
- PHP 7.4 veya üzeri
- SSL sertifikası (Hostinger ücretsiz sağlar)
- FTP/SFTP erişimi veya File Manager

## 🚀 Deployment Adımları

### 1. Dosyaları Hazırlama

Projenin ana dizininde bu dosyalar olmalı:
```
✅ index.html
✅ api/groq-proxy.php
✅ .htaccess
✅ .env
✅ js/
✅ css/
✅ data/
✅ tüm HTML dosyaları
```

### 2. .env Dosyasını Güncelleme

`.env` dosyasını düzenleyin:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

**⚠️ ÖNEMLİ:** `.env` dosyası `.htaccess` ile korunmaktadır!

### 3. Hostinger'a Yükleme

#### Yöntem A: File Manager (Tavsiye Edilen)

1. Hostinger hPanel'e giriş yapın
2. **Files** → **File Manager** açın
3. `public_html` klasörüne gidin
4. Tüm dosyaları yükleyin (ZIP olarak yükleme önerilir)
5. Gerekirse ZIP'i Extract edin

#### Yöntem B: FTP/SFTP

1. FileZilla veya benzeri FTP istemcisi kullanın
2. Hostinger FTP bilgilerinizi girin:
   - Host: ftp.yourdomain.com
   - Username: (Hostinger'dan alın)
   - Password: (Hostinger'dan alın)
   - Port: 21 (FTP) veya 22 (SFTP)
3. Tüm dosyaları `public_html` klasörüne yükleyin

### 4. Firebase Yapılandırması

Firebase zaten yapılandırılmış (`js/firebase-production.js`), herhangi bir değişiklik gerekmez.

### 5. Domain ve SSL

1. **SSL Sertifikası:**
   - hPanel → **SSL** → **Free SSL** aktif edin
   - Let's Encrypt otomatik yüklenir

2. **Domain Ayarları:**
   - hPanel → **Domains** → domain'inizi kontrol edin
   - DNS kayıtları doğru olmalı

### 6. PHP Ayarları (Opsiyonel)

Eğer `.htaccess` PHP ayarları çalışmazsa:

1. hPanel → **Advanced** → **PHP Configuration**
2. Şu ayarları yapın:
   ```
   upload_max_filesize = 50M
   post_max_size = 50M
   max_execution_time = 300
   memory_limit = 256M
   ```

### 7. Test Etme

1. `https://yourdomain.com` açın
2. Giriş yapın ve test edin:
   - ✅ Login çalışıyor mu?
   - ✅ Firebase bağlantısı var mı?
   - ✅ AI önerileri çalışıyor mu?
   - ✅ Video yükleme çalışıyor mu?

3. **AI Proxy Test:**
   ```
   https://yourdomain.com/api/groq-proxy
   ```
   POST isteği gönderip test edin (Postman veya cURL ile)

### 8. Hata Ayıklama

#### Problem: AI önerileri çalışmıyor

**Çözüm:**
1. `.env` dosyası doğru mu kontrol edin
2. PHP error log'larını kontrol edin:
   - hPanel → **Advanced** → **Error Log**
3. Browser console'da hata var mı kontrol edin

#### Problem: 404 hatası

**Çözüm:**
1. `.htaccess` dosyası yüklü mü kontrol edin
2. `mod_rewrite` aktif mi kontrol edin (Hostinger'da varsayılan aktiftir)

#### Problem: CORS hatası

**Çözüm:**
1. `.htaccess` dosyasındaki CORS header'ları kontrol edin
2. `api/groq-proxy.php` dosyasındaki CORS header'ları kontrol edin

#### Problem: Firebase bağlantı hatası

**Çözüm:**
1. Firebase config dosyası (`js/firebase-production.js`) doğru mu?
2. Firebase domain'i whitelist'e eklenmiş mi?
   - Firebase Console → **Project Settings** → **Authorized domains**
   - Domain'inizi ekleyin

## 📊 Performans Optimizasyonu

### 1. Caching

`.htaccess` zaten cache ayarları içeriyor. Hostinger hPanel'den:
- **Website** → **Speed Optimization** → **Cache** aktif edin

### 2. Cloudflare (Opsiyonel)

Hostinger ücretsiz Cloudflare entegrasyonu sunar:
- hPanel → **Website** → **Cloudflare**

## 🔒 Güvenlik

### Yapılmış Güvenlik Önlemleri:

✅ `.env` dosyası `.htaccess` ile korunuyor
✅ API anahtarı backend'de güvenli
✅ HTTPS zorunlu (`.htaccess`)
✅ Security headers eklendi
✅ Directory listing kapalı

### Ek Güvenlik (Önerilen):

1. **Hostinger Security:**
   - hPanel → **Security** → **Malware Scanner** çalıştırın

2. **Backup:**
   - hPanel → **Files** → **Backups** otomatik backup aktif edin

## 📁 Dosya Yapısı (Production)

```
public_html/
├── index.html
├── student-dashboard.html
├── instructor-dashboard.html
├── module-detail.html
├── progress.html
├── instructor-content.html
├── instructor-students.html
├── .htaccess
├── .env (GÜVENLİ)
├── api/
│   └── groq-proxy.php
├── js/
│   ├── firebase-production.js
│   ├── groq-api.js
│   ├── main.js
│   └── user-utils.js
├── css/
│   └── styles.css
├── data/
│   └── timelines/
│       └── question-timestamps.json
└── images/ (varsa)
```

## 🎯 Son Kontrol Listesi

- [ ] Tüm dosyalar yüklendi
- [ ] `.env` dosyası doğru API key ile güncellenmiş
- [ ] SSL sertifikası aktif
- [ ] HTTPS çalışıyor
- [ ] Login sistemi çalışıyor
- [ ] Firebase bağlantısı var
- [ ] AI önerileri çalışıyor
- [ ] Video yükleme çalışıyor
- [ ] Timestamp sistemi çalışıyor
- [ ] Backup ayarlandı

## 📞 Destek

Sorun olursa:
1. Hostinger Live Chat (7/24)
2. hPanel → **Help** → **Tutorials**
3. Proje GitHub repository'si

---

**✅ Deployment Tamamlandı!**

Site şu adreste canlı: `https://yourdomain.com`
