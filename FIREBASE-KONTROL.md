# 🔍 Firebase'de PDF Kontrolü

## 1. Firebase Console'a Git

```
https://console.firebase.google.com/project/cevik-lider/firestore/data
```

## 2. coordinatorVideos Koleksiyonunu Aç

Sol menüden `coordinatorVideos` koleksiyonuna tıklayın.

## 3. Video Dokümanlarını İncele

Her video dokümanında şu field'lar olmalı:

```javascript
{
  id: "ABC123",
  title: "Video Başlığı",
  youtubeUrl: "https://youtube.com/watch?v=...",
  moduleId: "module_XYZ",
  duration: 10,
  difficulty: "beginner",
  description: "...",
  status: "active",
  createdAt: "2025-01-21T...",

  questions: [
    {
      id: "q_1",
      type: "multiple-choice",
      question: "...",
      options: [...],
      correctAnswer: "..."
    }
  ],

  pdfs: [                    // ← BU OLMALI!
    {
      title: "PDF Başlığı",
      url: "https://firebasestorage.googleapis.com/...",
      fileName: "test.pdf",
      size: 123456,
      storagePath: "pdfs/..."
    }
  ]
}
```

## 4. Kontrol Listesi

### ✅ Eğer `pdfs` Field'i VARSA:

- PDF'ler Firebase'de kayıtlı ✅
- Sorun frontend'de olabilir
- Console loglarına bakın:
  ```
  📄 video.pdfs: [{...}]  ← PDF var mı?
  ```

### ❌ Eğer `pdfs` Field'i YOKSA:

**İki olasılık:**

#### A) Video Eskiden Eklendi (instructor-content.html güncellemesinden önce)
- O videoda `pdfs` olmayabilir (normal)
- Çözüm: Yeni bir video ekleyin ve test edin

#### B) Video Yeni Eklendi Ama PDF'ler Kaydedilmedi
- `handleSubmit()` fonksiyonu düzgün çalışmıyor
- Koordinatör console'unda hata var mı kontrol edin
- `instructor-content.html` dosyasının güncel versiyonunu kullanıyor musunuz?

## 5. Yeni Video Test Senaryosu

### Adım 1: Koordinatör Girişi
```
http://localhost:5500/instructor-login.html
Email: koordinator@meb.gov.tr
Şifre: 1234
```

### Adım 2: Modüller Sayfası
```
http://localhost:5500/instructor-courses.html
```

### Adım 3: "Videolar" Butonuna Tıkla
Herhangi bir modülde "Videolar" butonuna tıklayın
→ `instructor-content.html?moduleId=XXX` açılacak

### Adım 4: Console'u Aç (F12)
Şu logları göreceksiniz:
```
✅ Firebase bağlantısı başarılı!
✅ Modüller: X
📹 X toplam video, X aktif video bulundu
```

### Adım 5: Video Formu Doldur
```
Video Başlığı: "Test Video - PDF Debug"
YouTube URL: "https://youtube.com/watch?v=dQw4w9WgXcQ"
Modül: (otomatik seçili)
Süre: 5
Zorluk: Başlangıç
Açıklama: "PDF test için debug videosu"
```

### Adım 6: Soru Ekle (Opsiyonel)
```
Soru Tipi: Çoktan Seçmeli
Soru: "Test sorusu?"
Şık 1: "A", Doğru: ✓
Şık 2: "B"
Şık 3: "C"
Şık 4: "D"
→ "Soru Ekle" tıkla
```

### Adım 7: PDF Ekle
```
PDF Başlığı: "Debug Test PDF"
→ [Dosya Seç] herhangi bir PDF (max 10MB)
→ "PDF Yükle ve Ekle" butonuna tıkla
→ Progress bar görünecek
→ "✅ PDF başarıyla yüklendi!" mesajı
```

**Console'da şunu göreceksiniz:**
```javascript
📊 Upload ilerleme: 0.0%
📊 Upload ilerleme: 25.3%
📊 Upload ilerleme: 50.7%
📊 Upload ilerleme: 75.2%
📊 Upload ilerleme: 100.0%
✅ PDF yüklendi: {
  success: true,
  url: "https://firebasestorage.googleapis.com/...",
  fileName: "test.pdf",
  size: 123456,
  storagePath: "pdfs/..."
}
```

### Adım 8: PDF Listede Görünüyor mu?
PDF yükledikten sonra formda PDF listesi görünecek:
```
┌────────────────────────────────────┐
│ 📕 Debug Test PDF     (120 KB) ❌ │
└────────────────────────────────────┘
```

### Adım 9: Kaydet
```
→ "Kaydet" butonuna tıkla
```

**Console'da şunu göreceksiniz:**
```javascript
Kaydedilecek veri: {
  title: "Test Video - PDF Debug",
  youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  moduleId: "...",
  duration: 5,
  difficulty: "beginner",
  description: "PDF test için debug videosu",
  questions: [...],
  pdfs: [                          // ← BU OLMALI!
    {
      title: "Debug Test PDF",
      url: "https://firebasestorage.googleapis.com/...",
      fileName: "test.pdf",
      size: 123456,
      storagePath: "pdfs/..."
    }
  ],
  status: "active",
  createdAt: "2025-01-21T..."
}
```

### Adım 10: Firebase Console Kontrol
```
1. Firebase Console'a git:
   https://console.firebase.google.com/project/cevik-lider/firestore/data

2. coordinatorVideos koleksiyonuna git

3. En son eklenen videoyu bul (createdAt'e göre sırala)

4. Video dokümanını aç

5. "pdfs" field'ını kontrol et:
   ✅ Var mı?
   ✅ Array mi?
   ✅ İçinde PDF objeleri var mı?
```

### Adım 11: Öğrenci Tarafından Test
```
1. Öğrenci girişi:
   http://localhost:5500
   Email: ogrenci@test.com
   Şifre: 1234

2. Modül detaya git:
   http://localhost:5500/module-detail.html?module=XXX

3. Console'u aç (F12)

4. "Test Video - PDF Debug" kartına tıkla

5. Console loglarını oku:
   📄 loadPDFs çağrıldı. Video: {...}
   📄 video.pdfs: [{...}]        ← Bu array boş mu dolu mu?

   Eğer DOLU ise:
   📄 1 PDF yükleniyor...
   ✅ PDF'ler yüklendi

   Eğer BOŞ ise:
   ⚠️ Video'da PDF yok

6. Sayfa scroll et, PDF section'ı gör
```

## 6. Troubleshooting

### Durum A: Firebase'de PDF Var, Frontend'de Yok

**Console'da şunu görüyorsanız:**
```javascript
// Firebase'den gelen ham veri:
Video 1: ... → pdfs: [{title: "...", url: "..."}]

// Ama loadPDFs'de:
📄 video.pdfs: []
```

**Sebep:** Video mapping sırasında PDF'ler kayboluyor

**Çözüm:** `module-detail.html` satır 373-383'ü kontrol edin:
```javascript
const videoObjects = allVideos.map((video, index) => ({
    // ...
    pdfs: video.pdfs || []  // ← BU SATIR VAR MI?
}));
```

### Durum B: Firebase'de PDF Yok

**Console'da şunu görüyorsanız:**
```javascript
// Firebase'den gelen ham veri:
Video 1: ... → pdfs: undefined (veya field yok)
```

**Sebep:** Video kaydedilirken PDF'ler eklenmemiş

**Çözüm:**
1. `instructor-content.html` dosyasının güncel olduğundan emin olun
2. Yeni bir video ekleyin
3. Koordinatör console'unda "Kaydedilecek veri" logunu kontrol edin
4. `pdfs` array'i var mı?

### Durum C: PDF Upload Hatası

**Console'da şunu görüyorsanız:**
```javascript
❌ PDF yükleme hatası: firebase.storage is not a function
```

**Çözüm:** Firebase Storage CDN eksik
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
```

**Console'da şunu görüyorsanız:**
```javascript
❌ PDF yükleme hatası: Sadece PDF dosyaları yüklenebilir
```

**Çözüm:** .pdf uzantılı dosya seçin

**Console'da şunu görüyorsanız:**
```javascript
❌ PDF yükleme hatası: PDF boyutu 10MB'dan küçük olmalıdır
```

**Çözüm:** Daha küçük bir PDF seçin veya PDF'i sıkıştırın

## 7. Manuel Firebase Test

Eğer hala sorun varsa, manuel olarak Firebase'e PDF ekleyin:

```
1. Firebase Console'a git
2. coordinatorVideos koleksiyonuna git
3. Bir video dokümanını aç
4. "Add field" tıkla
5. Field name: pdfs
6. Type: array
7. Array value (map):
   {
     title: "Test PDF",
     url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
     fileName: "dummy.pdf",
     size: 13264,
     storagePath: "pdfs/test.pdf"
   }
8. Save
9. Öğrenci tarafından test et
```

Eğer manuel eklediğiniz PDF görünüyorsa, sorun kaydetme sırasında oluyor demektir.

---

**Hazırlayan:** Claude Sonnet 4.5 🤖
**Tarih:** 21 Ocak 2025
