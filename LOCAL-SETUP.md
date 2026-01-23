# 🚀 Local Development Setup

## Hızlı Başlangıç

### 1️⃣ Groq API Key Alın

1. [https://console.groq.com/keys](https://console.groq.com/keys) adresine gidin
2. Giriş yapın (ücretsiz hesap oluşturabilirsiniz)
3. "Create API Key" butonuna tıklayın
4. API key'inizi kopyalayın

### 2️⃣ .env Dosyasını Düzenleyin

Proje klasöründe `.env` dosyasını açın ve API key'inizi ekleyin:

```bash
# Groq API Key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3️⃣ Server'ı Başlatın

**Otomatik (Önerilen):**
```bash
./START-LOCAL.sh
```

**Manuel:**
```bash
node local-server.js
```

### 4️⃣ Tarayıcıda Açın

Server başladıktan sonra şu adresleri ziyaret edin:

- **Ana Sayfa:** http://localhost:3000
- **Öğrenci Girişi:** http://localhost:3000/index.html
- **Koordinatör Girişi:** http://localhost:3000/instructor-login.html
- **Öğrenci Dashboard:** http://localhost:3000/student-dashboard.html
- **Koordinatör Dashboard:** http://localhost:3000/instructor-dashboard.html

---

## 📋 Gereksinimler

- **Node.js** (v14 veya üzeri)
  - İndir: https://nodejs.org/
  - Kontrol: `node --version`

- **Groq API Key** (Ücretsiz)
  - Al: https://console.groq.com/keys

---

## 🎯 Test Kullanıcıları

### Öğrenci Girişi
- **E-posta:** herhangi bir email (örn: `ogrenci@email.com`)
- **Şifre:** herhangi bir şifre (örn: `1234`)

### Koordinatör Girişi
- **E-posta:** `koordinator@meb.gov.tr` veya `instructor@meb.gov.tr`
- **Şifre:** herhangi bir şifre (örn: `1234`)

> ℹ️ Local development'ta Firebase Authentication devre dışı, localStorage kullanılıyor

---

## 🔧 Server Özellikleri

### Local Development Server (local-server.js)

✅ **Static File Serving**
- HTML, CSS, JavaScript dosyaları
- Otomatik MIME type algılama
- .html extension otomatik ekleme

✅ **Groq API Proxy**
- Endpoint: `/api/groq-proxy`
- CORS desteği
- API key güvenli backend'de

✅ **Hot Reload Değil**
- Değişiklik yaptıktan sonra tarayıcıyı yenileyin
- Server'ı yeniden başlatmanıza gerek yok (static dosyalar için)

---

## 📁 Proje Yapısı

```
yeniWeb - Kopya/
├── index.html                      # Ana giriş (öğrenci)
├── instructor-login.html           # Koordinatör girişi
├── instructor-courses.html         # Modül yönetimi
├── module-video-manager.html       # 🆕 Video yönetimi (modül bazlı)
├── module-detail.html              # Video izleme (öğrenci)
├── student-dashboard.html          # Öğrenci paneli
├── instructor-dashboard.html       # Koordinatör paneli
│
├── js/
│   ├── firebase-production.js      # Firebase DB
│   ├── groq-api.js                # AI API
│   └── user-utils.js              # Kullanıcı fonksiyonları
│
├── api/
│   └── groq-proxy.js              # Vercel serverless function
│
├── local-server.js                 # 🆕 Local development server
├── START-LOCAL.sh                  # 🆕 Başlangıç scripti
├── .env                           # 🆕 API key (GİT'e EKLEMEYİN!)
└── package.json
```

---

## 🐛 Sorun Giderme

### Server Başlamıyor

**Hata:** `Error: listen EADDRINUSE: address already in use :::3000`

**Çözüm:** Port 3000 zaten kullanımda
```bash
# Port kullanan process'i bul
lsof -ti:3000

# Process'i sonlandır
kill -9 $(lsof -ti:3000)

# Server'ı tekrar başlat
./START-LOCAL.sh
```

### Groq API Hatası

**Hata:** `GROQ_API_KEY tanımlı değil`

**Çözüm:**
1. `.env` dosyasının olduğundan emin olun
2. API key'in doğru formatta olduğunu kontrol edin
3. Server'ı yeniden başlatın

**Hata:** `401 Unauthorized`

**Çözüm:**
- API key'iniz geçersiz veya süresi dolmuş
- https://console.groq.com/keys adresinden yeni key alın

### Firebase Bağlantı Hatası

**Hata:** Console'da Firebase hataları

**Çözüm:**
- İnternet bağlantınızı kontrol edin
- Firebase Firestore kurallarını kontrol edin
- `js/firebase-production.js` dosyasındaki config'i kontrol edin

### Video Yüklenmedi

**Hata:** Video player'da "Video URL Mevcut Değil"

**Çözüm:**
- Video'nun YouTube URL'si doğru girilmiş mi kontrol edin
- YouTube video ID'si çıkarılabiliyorsa sorun yok
- Koordinatör panelinden videoyu tekrar ekleyin

---

## 🚀 Production Deployment

Local development tamamlandıktan sonra Vercel'e deploy etmek için:

```bash
# Vercel CLI kur (ilk kez)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Environment variable ekle
vercel env add GROQ_API_KEY
```

---

## 📝 Notlar

### .gitignore
`.env` dosyasını GIT'e eklemeyin:
```gitignore
.env
.env.local
.env.*.local
```

### API Key Güvenliği
- API key'inizi asla frontend'de göstermeyin
- Her zaman backend proxy kullanın
- Production'da Vercel Environment Variables kullanın

### Firebase Güvenliği
- Firestore Security Rules'ları aktif tutun
- Production'da authentication ekleyin
- API quotaları ayarlayın

---

## 🆘 Destek

Sorun yaşıyorsanız:

1. **Console'u kontrol edin:** Tarayıcı DevTools > Console
2. **Server loglarına bakın:** Terminal çıktısını inceleyin
3. **Dosya izinlerini kontrol edin:** `chmod +x START-LOCAL.sh`
4. **Port'u değiştirin:** `local-server.js` içinde `PORT = 3001`

---

## 📚 Ek Kaynaklar

- **Firebase Docs:** https://firebase.google.com/docs
- **Groq API Docs:** https://console.groq.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Font Awesome:** https://fontawesome.com/icons

---

**Son Güncelleme:** 21 Ocak 2025
**Hazırlayan:** Claude Sonnet 4.5 🤖
