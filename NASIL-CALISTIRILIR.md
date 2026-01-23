# 🚀 Projeyi Lokal Olarak Çalıştırma Kılavuzu

## ⚡ Hızlı Başlangıç (3 Adım)

### 1️⃣ Groq API Key Alın (1 dakika)

1. **Tarayıcıda açın:** https://console.groq.com/keys
2. **Giriş yapın** (ücretsiz hesap oluşturun)
3. **"Create API Key"** butonuna tıklayın
4. API key'i **kopyalayın** (örnek: `gsk_abc123...`)

### 2️⃣ .env Dosyasını Düzenleyin

Proje klasöründe `.env` dosyasını açın ve API key'inizi yapıştırın:

**ÖNCESİ:**
```bash
GROQ_API_KEY=your_groq_api_key_here
```

**SONRASI:**
```bash
GROQ_API_KEY=gsk_abc123xyz789...
```

💾 Dosyayı kaydedin!

### 3️⃣ Server'ı Başlatın

**Terminalde komutu çalıştırın:**
```bash
./START-LOCAL.sh
```

Veya:
```bash
node local-server.js
```

✅ Server çalışıyor! Artık tarayıcınızda açabilirsiniz.

---

## 🌐 Tarayıcıda Açın

Server başladıktan sonra **tarayıcınıza** gidin:

### 👨‍🎓 Öğrenci Tarafı
- **Ana Sayfa:** http://localhost:3000
- **Giriş:** Herhangi bir email (örn: `ogrenci@test.com`)
- **Şifre:** Herhangi bir şifre (örn: `1234`)

### 👨‍🏫 Koordinatör Tarafı
- **Giriş Sayfası:** http://localhost:3000/instructor-login.html
- **Email:** `koordinator@meb.gov.tr`
- **Şifre:** Herhangi bir şifre (örn: `1234`)

---

## 🎯 Ne Yapabilirsiniz?

### Koordinatör Olarak:
1. ✅ **Modül Oluşturma:** Yeni eğitim modülleri ekleyin
2. ✅ **Video Yönetimi:** Her modül için videolar ekleyin
3. ✅ **PDF Ekleme:** Videolara PDF dökümanlar ekleyin
4. ✅ **Soru Ekleme:** Video başına 4 şıklı sorular ekleyin
5. ✅ **İstatistikler:** Video, soru, PDF sayılarını görün

### Öğrenci Olarak:
1. ✅ **Video İzleme:** YouTube videoları izleyin
2. ✅ **PDF İndirme:** Video altında PDF dökümanları görün ve indirin
3. ✅ **Soru Çözme:** Her video için soruları cevaplayın
4. ✅ **İlerleme Takibi:** Modül ilerlemesini görün

---

## 🎬 Yeni Özellikler (Az Önce Eklendi!)

### 📹 Modül Bazlı Video Yönetimi
- Her modül için özel video yönetim sayfası
- "Videolar" butonu ile kolay erişim
- Modüle özel istatistikler

### 📄 PDF Döküman Desteği
- Video başına birden fazla PDF eklenebilir
- Öğrenci tarafında güzel kartlar halinde görünür
- Tek tıkla PDF açma/indirme

### 🎨 Gelişmiş Arayüz
- Modern, responsive tasarım
- Hover efektleri
- Kullanıcı dostu kartlar

---

## 🛑 Server'ı Durdurmak İçin

Terminal'de **Ctrl + C** tuşlarına basın.

---

## ⚠️ Önemli Notlar

### 🔒 Güvenlik
- `.env` dosyasını **asla** Git'e eklemeyin!
- API key'inizi **kimseyle paylaşmayın**!
- Production'da Firebase Authentication kullanın

### 🔥 Firebase
- Local'de Firebase Firestore kullanılıyor
- İnternet bağlantısı gerekiyor
- Offline persistence aktif

### 🤖 AI Özellikleri
- Groq API (Llama 3.3 70B modeli)
- Otomatik soru üretimi
- Kişiselleştirilmiş geri bildirim

---

## 🐛 Sorun Yaşıyorsanız?

### "Port already in use" Hatası
```bash
# Port 3000'i kullananan process'i sonlandır
kill -9 $(lsof -ti:3000)

# Server'ı tekrar başlat
./START-LOCAL.sh
```

### "GROQ_API_KEY tanımlı değil" Hatası
1. `.env` dosyasını kontrol edin
2. API key doğru girilmiş mi?
3. Server'ı yeniden başlatın

### Firebase Bağlantı Hatası
- İnternet bağlantınızı kontrol edin
- Tarayıcı Console'da hata varsa bakın (F12)

### Video Görünmüyor
- YouTube URL'si doğru mu?
- Koordinatör panelinden video ekleyin
- Console'da hata var mı kontrol edin

---

## 📂 Önemli Sayfalar

```
Koordinatör:
├── instructor-login.html           # Giriş
├── instructor-dashboard.html       # Ana panel
├── instructor-courses.html         # Modül yönetimi
└── module-video-manager.html       # 🆕 Video yönetimi

Öğrenci:
├── index.html                      # Giriş
├── student-dashboard.html          # Ana panel
├── courses.html                    # Modüller
└── module-detail.html              # Video izleme + PDF'ler
```

---

## 💡 İpuçları

1. **Tarayıcıyı yenileyin:** Değişiklikler için F5
2. **Console açık tutun:** Hataları görmek için F12
3. **Farklı tarayıcı deneyin:** Chrome önerilir
4. **Cache temizleyin:** Ctrl+Shift+Delete

---

## 📞 Yardıma mı İhtiyacınız Var?

1. **LOCAL-SETUP.md** dosyasını okuyun (detaylı kılavuz)
2. **Console loglarını** kontrol edin (F12)
3. **Terminal çıktısını** inceleyin
4. **YENI-OZELLIKLER.md** dosyasına bakın

---

## 🎉 Başarılar!

Artık projeniz lokal olarak çalışıyor!

**Test senaryosu:**
1. Koordinatör olarak giriş yap
2. Yeni modül oluştur
3. Modülde "Videolar" butonuna tıkla
4. Video + PDF + Soru ekle
5. Öğrenci olarak giriş yap
6. Modüle git ve videoyu izle
7. PDF'leri gör ve indir
8. Soruları çöz

---

**Hazırlayan:** Claude Sonnet 4.5 🤖
**Tarih:** 21 Ocak 2025
