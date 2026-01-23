# 🚀 Çevik Lider Platformu - Çalıştırma Kılavuzu

## ✅ SERVER BAŞARILI BİR ŞEKİLDE ÇALIŞIYOR!

```
📡 URL: http://localhost:5500
🎉 Durum: ÇALIŞIYOR
```

---

## 🌐 Tarayıcınızda Açın

### 👨‍🎓 Öğrenci Girişi
```
🔗 http://localhost:5500
📧 Email: ogrenci@test.com (herhangi bir email)
🔑 Şifre: 1234 (herhangi bir şifre)
```

### 👨‍🏫 Koordinatör Girişi
```
🔗 http://localhost:5500/instructor-login.html
📧 Email: koordinator@meb.gov.tr
🔑 Şifre: 1234 (herhangi bir şifre)
```

---

## ⚠️ ÖNEMLİ: Groq API Key Eklemeyi Unutmayın!

Server çalışıyor ama AI özellikleri için API key gerekli:

### 1️⃣ API Key Alın (1 dakika)
```
https://console.groq.com/keys
```
- Ücretsiz hesap oluşturun
- "Create API Key" tıklayın
- Key'i kopyalayın

### 2️⃣ .env Dosyasını Düzenleyin
```bash
# .env dosyasını açın ve düzenleyin:
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3️⃣ Server'ı Yeniden Başlatın
```bash
# Terminalde Ctrl+C ile durdurun
# Sonra tekrar başlatın:
./START-LOCAL.sh
```

---

## 🎯 Yeni Özellikler (AZ ÖNCE EKLENDİ!)

### ✨ Koordinatör İçin
1. **Modül Bazlı Video Yönetimi**
   - Her modülde "Videolar" butonu
   - Modüle özel video ekleme sayfası
   - http://localhost:5500/instructor-courses.html

2. **PDF Döküman Ekleme**
   - Video başına birden fazla PDF
   - PDF başlığı + URL
   - Öğrenciler video altında görebilir

3. **Soru Ekleme**
   - 4 şıklı çoktan seçmeli
   - Her video için sınırsız soru

### ✨ Öğrenci İçin
1. **Video İzleme**
   - YouTube entegrasyonu
   - http://localhost:5500/module-detail.html?moduleId=X

2. **PDF Görünümü**
   - Video altında güzel kartlar
   - Tek tıkla açma/indirme
   - Çoklu PDF desteği

3. **Test Soruları**
   - Video başına sorular
   - Anında geri bildirim

---

## 🛑 Server'ı Durdurmak İçin

```bash
# Terminalde:
Ctrl + C

# Veya komut satırından:
pkill -f "node local-server"
```

---

## 🔄 Server'ı Tekrar Başlatmak İçin

```bash
# Kolay yol:
./START-LOCAL.sh

# Manuel yol:
node local-server.js
```

---

## 📝 Test Senaryosu

### Koordinatör Olarak:
1. ✅ http://localhost:5500/instructor-login.html
2. ✅ "Eğitim Modülleri" → Yeni modül ekle
3. ✅ Modül kartında "Videolar" butonuna tıkla
4. ✅ Video ekle:
   - YouTube URL
   - PDF'ler (Google Drive, Dropbox, vb.)
   - 4 şıklı sorular
5. ✅ Kaydet ve istatistikleri gör

### Öğrenci Olarak:
1. ✅ http://localhost:5500
2. ✅ Modüle git
3. ✅ Videoyu izle
4. ✅ Video altında PDF'leri gör
5. ✅ PDF'leri aç/indir
6. ✅ Soruları çöz

---

## 🐛 Sorun Giderme

### "Port already in use" Hatası
```bash
# Port 5500'i temizle:
pkill -f "node local-server"

# Server'ı tekrar başlat:
./START-LOCAL.sh
```

### Server Başlatma Hatası
```bash
# Log dosyasını kontrol et:
cat /tmp/cevik-lider-server.log

# Port kontrolü:
lsof -i :5500
```

### Tarayıcıda Sayfa Açılmıyor
1. Server çalışıyor mu? → Terminal'e bakın
2. Doğru URL mi? → http://localhost:5500
3. Console'da hata var mı? → F12 açın

### AI Özellikleri Çalışmıyor
- API key eklediniz mi?
- `.env` dosyasını kontrol edin
- Server'ı yeniden başlattınız mı?

---

## 📂 Önemli Sayfalar

```
Koordinatör:
├── http://localhost:5500/instructor-login.html
├── http://localhost:5500/instructor-dashboard.html
├── http://localhost:5500/instructor-courses.html
└── http://localhost:5500/module-video-manager.html (🆕)

Öğrenci:
├── http://localhost:5500/
├── http://localhost:5500/student-dashboard.html
├── http://localhost:5500/courses.html
└── http://localhost:5500/module-detail.html
```

---

## 💡 İpuçları

1. **Cache temizle:** Değişiklik göremiyorsanız Ctrl+Shift+R
2. **Console aç:** Hataları görmek için F12
3. **Log kontrol:** `/tmp/cevik-lider-server.log`
4. **Port değiştir:** `local-server.js` → `PORT = 5500`

---

## 📞 Daha Fazla Bilgi

| Konu | Dosya |
|------|-------|
| Hızlı başlangıç | NASIL-CALISTIRILIR.md |
| Detaylı kurulum | LOCAL-SETUP.md |
| Yeni özellikler | YENI-OZELLIKLER.md |
| Genel bakış | README-LOKAL.md |

---

## 🎉 Başarılar!

Server çalışıyor ve projeniz kullanıma hazır!

**Bir sonraki adım:**
- Tarayıcıda http://localhost:5500 açın
- Koordinatör veya öğrenci olarak giriş yapın
- Yeni özellikleri keşfedin

**Keyifli geliştirmeler!** 🚀

---

**Server Durumu:** ✅ ÇALIŞIYOR
**Port:** 5500
**URL:** http://localhost:5500
**Log:** /tmp/cevik-lider-server.log

**Hazırlayan:** Claude Sonnet 4.5 🤖
**Tarih:** 21 Ocak 2025
