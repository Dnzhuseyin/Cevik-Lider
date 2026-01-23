# 🎥 Yeni Video ve PDF Yönetim Özellikleri

## 📋 Genel Bakış

Çevik Lider platformuna **modül bazlı video yönetimi** ve **PDF döküman desteği** eklendi. Koordinatörler artık her modül için özel video ve PDF yönetimi yapabilir, öğrenciler ise videoların altında ilgili PDF dökümanları görebilir.

---

## ✨ Eklenen Özellikler

### 1. 🎬 Modül Bazlı Video Yönetimi

#### Koordinatör Tarafı
- **Her modülde "Videolar" butonu** eklendi (`instructor-courses.html`)
- Modüle özel **yeni video yönetim sayfası** (`module-video-manager.html`)
- Özellikleri:
  - ✅ Video ekleme (YouTube URL)
  - ✅ Video düzenleme
  - ✅ Video silme
  - ✅ Soru ekleme (4 şıklı çoktan seçmeli)
  - ✅ PDF döküman ekleme
  - ✅ İstatistikler (toplam video, soru, PDF sayısı)

#### Sayfa Konumu
```
/module-video-manager.html?moduleId=<MODULE_ID>
```

#### Erişim
1. Koordinatör paneline giriş yapın
2. "Eğitim Modülleri" sayfasına gidin
3. Bir modül kartında **"Videolar"** butonuna tıklayın
4. Modüle özel video yönetim sayfası açılır

---

### 2. 📄 PDF Döküman Yönetimi

#### Koordinatör Tarafı
Video eklerken **PDF döküman bölümü**:
- PDF başlığı
- PDF URL (bulut hizmetine yüklenen dosyanın linki)
- Her video için birden fazla PDF eklenebilir
- PDF önizleme ve silme

#### Veri Yapısı
Video nesnesinde `pdfs` array'i:
```javascript
{
  title: "Video başlığı",
  youtubeUrl: "https://youtube.com/...",
  pdfs: [
    {
      title: "Afet Yönetimi El Kitabı",
      url: "https://example.com/document.pdf"
    },
    {
      title: "Acil Durum Prosedürleri",
      url: "https://example.com/procedures.pdf"
    }
  ],
  questions: [...],
  ...
}
```

---

### 3. 🎓 Öğrenci Tarafı - PDF Görünümü

#### Video Detay Sayfası (`module-detail.html`)
Videoların hemen altında **"Ek Dökümanlar ve Kaynaklar"** bölümü:

**Özellikler:**
- 📄 Video ile ilişkili tüm PDF'ler listelenir
- 🎨 Görsel olarak çekici kartlar (kırmızı-turuncu gradyan)
- 🔗 Yeni sekmede açılır (`target="_blank"`)
- ⬇️ "İndir veya görüntüle" metni
- ✨ Hover efektleri (scale, renk değişimi)

**Görünüm:**
```
┌─────────────────────────────────────────────────┐
│ 📄  Afet Yönetimi El Kitabı          🔗        │
│     ↓ İndir veya görüntüle                      │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ 📄  Acil Durum Prosedürleri           🔗        │
│     ↓ İndir veya görüntüle                      │
└─────────────────────────────────────────────────┘
```

**Dinamik Görünüm:**
- Video'da PDF yoksa: Bölüm gizlenir
- PDF varsa: Otomatik gösterilir

---

## 🗂️ Değiştirilen Dosyalar

### 1. `instructor-courses.html`
**Değişiklikler:**
- Her modül kartına "Videolar" butonu eklendi
- `manageModuleVideos(moduleId)` fonksiyonu eklendi
- Buton layoutu güncellendi (Videolar | Düzenle | Sil)

**Kod:**
```javascript
function manageModuleVideos(moduleId) {
    window.location.href = `module-video-manager.html?moduleId=${moduleId}`;
}
```

### 2. `module-video-manager.html` ✨ YENİ DOSYA
**Özellikler:**
- Modül bazlı video yönetimi
- PDF yükleme formu
- Soru ekleme sistemi
- Video listeleme ve silme
- İstatistikler

**Bölümler:**
- Header (modül bilgisi, geri dön butonu)
- Stats (4 istatistik kartı)
- Video ekleme formu
  - Video bilgileri
  - PDF dökümanlar bölümü
  - Sorular bölümü
- Video listesi

### 3. `module-detail.html` (Öğrenci Sayfası)
**Değişiklikler:**
- Video player'ın altına PDF bölümü eklendi
- `loadPDFs(video)` fonksiyonu eklendi
- `loadVideo()` fonksiyonuna PDF yükleme çağrısı eklendi

**HTML:**
```html
<!-- PDF Documents Section -->
<div id="pdf-section" style="display: none;">
    <h3>
        <i class="fas fa-file-pdf"></i>
        Ek Dökümanlar ve Kaynaklar
    </h3>
    <div id="pdf-container"></div>
</div>
```

**JavaScript:**
```javascript
function loadPDFs(video) {
    // Video'da PDF varsa göster, yoksa gizle
    // PDF'leri güzel kartlar halinde render et
}
```

---

## 🎯 Kullanım Senaryosu

### Koordinatör İş Akışı

1. **Modül Oluştur**
   - "Eğitim Modülleri" sayfasında "Yeni Modül Ekle"
   - Modül bilgilerini gir ve kaydet

2. **Video Ekle**
   - Modül kartında "Videolar" butonuna tıkla
   - "Yeni Video Ekle" formunu doldur:
     - Video başlığı
     - YouTube URL
     - Süre, zorluk, açıklama

3. **PDF Ekle**
   - PDF bölümünde:
     - PDF başlığı gir
     - PDF URL'si gir (Google Drive, Dropbox, vb.)
     - "PDF Ekle" butonuna tıkla
   - Birden fazla PDF eklenebilir

4. **Soru Ekle**
   - "Soru Ekle" butonuna tıkla
   - Soru metnini yaz
   - 4 şıkkı doldur
   - Doğru cevabı seç
   - İstersen daha fazla soru ekle

5. **Kaydet**
   - "Videoyu Kaydet" butonuna tıkla
   - Video Firebase'e kaydedilir
   - Liste otomatik güncellenir

### Öğrenci İş Akışı

1. **Modüle Git**
   - "Eğitim Modülleri" sayfasından modül seç

2. **Video İzle**
   - Video otomatik yüklenir ve oynatılır

3. **PDF'leri İncele**
   - Video altında "Ek Dökümanlar" bölümünü gör
   - PDF kartlarına tıklayarak dökümanları aç
   - Yeni sekmede PDF açılır

4. **Soruları Çöz**
   - PDF'lerin altında sorular bölümü var
   - Soruları cevaplayarak öğrenmeyi pekiştir

---

## 🔧 Teknik Detaylar

### Firebase Veri Yapısı

**Collection:** `coordinator_videos`

**Örnek Video Dökümanı:**
```javascript
{
  id: "video_123456",
  title: "Afet Yönetimi Temelleri",
  moduleId: "module_001",
  youtubeUrl: "https://www.youtube.com/watch?v=...",
  youtubeVideoId: "dQw4w9WgXcQ",
  description: "Afet yönetiminin temel prensipleri",
  duration: 25,
  difficulty: "intermediate",
  order: 1,
  status: "active",

  // PDF Dökümanlar
  pdfs: [
    {
      title: "Afet Yönetimi El Kitabı",
      url: "https://drive.google.com/file/d/.../view"
    },
    {
      title: "Acil Durum Prosedürleri",
      url: "https://www.example.com/documents/emergency.pdf"
    }
  ],

  // Sorular
  questions: [
    {
      question: "Afet anında ilk öncelik nedir?",
      options: [
        "Can güvenliği",
        "Mal güvenliği",
        "İletişim",
        "Dokümantasyon"
      ],
      correct: 0
    }
  ],

  createdAt: "2025-01-21T...",
  updatedAt: "2025-01-21T..."
}
```

### PDF URL Kaynakları

Koordinatörler PDF'leri şu hizmetlere yükleyip link alabilir:
- **Google Drive** (Paylaşım linki)
- **Dropbox** (Public link)
- **OneDrive** (Paylaşım linki)
- Kendi web sunucuları
- Bulut depolama hizmetleri

**Örnek Google Drive Linki:**
```
https://drive.google.com/file/d/1ABC123xyz/view
```

---

## 🎨 Tasarım Özellikleri

### PDF Kartları
- **Renk Şeması:** Kırmızı-turuncu gradyan (`from-red-50 to-orange-50`)
- **Border:** 2px kırmızı (`border-red-200`)
- **İkon:** `fas fa-file-pdf` (kırmızı)
- **Hover Efekti:**
  - Scale artışı (`scale-[1.02]`)
  - Gölge artışı (`hover:shadow-lg`)
  - Border renk değişimi (`hover:border-red-300`)
  - Başlık rengi değişimi

### İstatistik Kartları
1. **Toplam Video** (Mavi - `bg-primary/10`)
2. **Toplam Soru** (Yeşil - `bg-accent/10`)
3. **Toplam PDF** (Kırmızı - `bg-secondary/10`)
4. **Toplam Süre** (Mor - `bg-cyber/10`)

---

## ✅ Test Checklist

### Koordinatör Tarafı
- [ ] Modül listesinde "Videolar" butonu görünüyor
- [ ] "Videolar" butonuna tıklayınca doğru modül ID'si ile sayfa açılıyor
- [ ] Video ekleme formu çalışıyor
- [ ] PDF ekleme/çıkarma çalışıyor
- [ ] Soru ekleme/çıkarma çalışıyor
- [ ] Video kaydetme başarılı
- [ ] Video listesi güncelleniyor
- [ ] Video silme çalışıyor
- [ ] İstatistikler doğru gösteriliyor

### Öğrenci Tarafı
- [ ] Video doğru yükleniyor
- [ ] PDF bölümü video'da PDF varsa görünüyor
- [ ] PDF bölümü video'da PDF yoksa gizli
- [ ] PDF kartları tıklanabilir
- [ ] PDF'ler yeni sekmede açılıyor
- [ ] PDF kartlarında hover efektleri çalışıyor
- [ ] PDF başlıkları doğru gösteriliyor

---

## 🚀 Gelecek Geliştirmeler

### Öneriler
1. **PDF Upload:** Koordinatör arayüzünden doğrudan PDF yükleme
2. **PDF Preview:** Sayfada PDF önizleme (PDF.js ile)
3. **PDF İndirme:** Tek tıkla indirme butonu
4. **PDF Kategorileri:** PDF'leri gruplandırma (Sunum, El Kitabı, Alıştırma vb.)
5. **PDF İstatistikleri:** Hangi PDF'lerin kaç kere indirildiği
6. **PDF Arama:** PDF içeriğinde arama
7. **Video Edit:** Mevcut videoları düzenleme özelliği

---

## 📞 Destek

Sorularınız için:
- 📧 E-posta: [destek@ceviklider.com]
- 📝 Issue: GitHub Issues
- 📚 Dokümantasyon: README.md

---

**Son Güncelleme:** 21 Ocak 2025
**Versiyon:** 2.0.0
**Geliştirici:** Claude Sonnet 4.5 🤖
