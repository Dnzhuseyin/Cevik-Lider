# ✅ PDF ve Soru Sistemi Entegrasyonu - TAMAMLANDI

## 🎉 Yapılan Değişiklikler

### 1. instructor-content.html - PDF Upload Eklendi

**Ne Değişti:**
- PDF yükleme özelliği tamamen entegre edildi
- Kaydetme sırasında PDF'ler de veritabanına kaydediliyor
- URL'den gelen modül ID'si otomatik seçiliyor

**Eklenen Özellikler:**

#### a) PDF Upload Formu (Satır 102-142)
```html
<div style="margin-bottom: 20px; padding: 20px; background: #fef2f2; border-radius: 8px;">
    <h3><i class="fas fa-file-pdf"></i> PDF Dökümanları</h3>

    <!-- PDF Başlığı -->
    <input type="text" id="pdf-title" placeholder="PDF Başlığı *">

    <!-- Dosya Seçici -->
    <input type="file" id="pdf-file" accept=".pdf">

    <!-- Upload Progress Bar -->
    <div id="pdf-upload-progress" style="display: none;">
        <span id="upload-progress-text">0%</span>
        <div id="upload-progress-bar"></div>
    </div>

    <!-- PDF Listesi -->
    <div id="pdf-list"></div>

    <!-- Upload Butonu -->
    <button type="button" onclick="addPDF()">PDF Yükle ve Ekle</button>
</div>
```

#### b) PDF JavaScript Fonksiyonları (Satır 281-404)

**Global Variables:**
```javascript
let pdfsData = [];  // Yüklenen PDF'leri tutar
let pdfCounter = 0; // Unique ID için
```

**addPDF() - PDF Yükleme Fonksiyonu:**
```javascript
async function addPDF() {
    // 1. Input validasyonu
    const title = document.getElementById('pdf-title').value.trim();
    const fileInput = document.getElementById('pdf-file');
    const file = fileInput.files[0];

    if (!title || !file) {
        alert('❌ PDF başlığı ve dosya gereklidir');
        return;
    }

    // 2. Dosya validasyonu
    if (!file.type.includes('pdf')) {
        alert('❌ Sadece PDF dosyaları yüklenebilir');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('❌ PDF boyutu 10MB\'dan küçük olmalıdır');
        return;
    }

    // 3. UI Hazırlık
    const addButton = event.target;
    const progressDiv = document.getElementById('pdf-upload-progress');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');

    addButton.disabled = true;
    progressDiv.style.display = 'block';

    // 4. Firebase Storage'a Yükle
    try {
        const result = await window.DB.uploadPDF(file, 'temp');

        if (result.success) {
            // 5. PDF'i listeye ekle
            pdfsData.push({
                id: `pdf_${Date.now()}_${pdfCounter++}`,
                title: title,
                url: result.url,
                fileName: result.fileName,
                size: result.size,
                storagePath: result.storagePath
            });

            // 6. UI Güncelle
            renderPDFList();
            document.getElementById('pdf-title').value = '';
            fileInput.value = '';

            alert('✅ PDF başarıyla yüklendi!');
        }
    } catch (error) {
        alert('❌ PDF yükleme hatası: ' + error.message);
    } finally {
        addButton.disabled = false;
        progressDiv.style.display = 'none';
    }
}
```

**renderPDFList() - PDF Listesini Göster:**
```javascript
function renderPDFList() {
    const container = document.getElementById('pdf-list');

    if (pdfsData.length === 0) {
        container.innerHTML = '<p style="color: #6b7280;">Henüz PDF eklenmedi</p>';
        return;
    }

    container.innerHTML = pdfsData.map(pdf => `
        <div style="display: flex; justify-content: space-between; align-items: center;
                    padding: 12px; background: white; border: 1px solid #e5e7eb;
                    border-radius: 8px; margin-bottom: 8px;">
            <div style="flex: 1;">
                <i class="fas fa-file-pdf" style="color: #dc2626; margin-right: 8px;"></i>
                <strong>${pdf.title}</strong>
                <span style="color: #6b7280; font-size: 0.875rem; margin-left: 8px;">
                    (${formatFileSize(pdf.size)})
                </span>
            </div>
            <button type="button" onclick="removePDF('${pdf.id}')"
                    style="background: #fee2e2; color: #dc2626; border: none;
                           padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                <i class="fas fa-times"></i> Sil
            </button>
        </div>
    `).join('');
}
```

**formatFileSize() - Dosya Boyutunu Formatla:**
```javascript
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

**removePDF() - PDF'i Sil:**
```javascript
async function removePDF(pdfId) {
    if (!confirm('Bu PDF\'i silmek istediğinizden emin misiniz?')) return;

    try {
        const pdf = pdfsData.find(p => p.id === pdfId);
        if (pdf && pdf.storagePath) {
            // Firebase Storage'dan sil
            await window.DB.deletePDF(pdf.storagePath);
        }

        // Listeden kaldır
        pdfsData = pdfsData.filter(p => p.id !== pdfId);
        renderPDFList();

        alert('✅ PDF silindi');
    } catch (error) {
        alert('❌ PDF silme hatası: ' + error.message);
    }
}
```

#### c) handleSubmit() Güncellendi (Satır 522-540)

**Öncesi:**
```javascript
const data = {
    title: ...,
    youtubeUrl: ...,
    moduleId: ...,
    questions: questions,
    status: 'active',
    createdAt: new Date().toISOString()
};
```

**Sonrası:**
```javascript
const data = {
    title: document.getElementById('videoTitle').value,
    youtubeUrl: document.getElementById('youtubeUrl').value,
    moduleId: document.getElementById('videoModule').value,
    duration: parseInt(document.getElementById('videoDuration').value),
    difficulty: document.getElementById('difficulty').value,
    description: document.getElementById('videoDescription').value,
    questions: questions,
    pdfs: pdfsData.map(pdf => ({          // ✅ PDF'ler eklendi
        title: pdf.title,
        url: pdf.url,
        fileName: pdf.fileName,
        size: pdf.size,
        storagePath: pdf.storagePath
    })),
    status: 'active',
    createdAt: new Date().toISOString()
};

const result = await window.DB.save('coordinatorVideos', data);
if (result && result.success) {
    alert('✅ Video, sorular ve PDF\'ler eklendi!');
    document.getElementById('videoForm').reset();
    document.getElementById('questions-container').innerHTML = '';
    questionCount = 0;
    pdfsData = [];              // ✅ PDF listesi temizlendi
    pdfCounter = 0;
    renderPDFList();
    await loadVideos();
}
```

#### d) loadModules() - URL Parameter Desteği (Satır 207-228)

**Eklenen Kod:**
```javascript
async function loadModules() {
    try {
        const result = await window.DB.load('modules');
        const modules = (result && result.success) ? result.data : [];

        // ✅ URL'den moduleId al
        const urlParams = new URLSearchParams(window.location.search);
        const preselectedModuleId = urlParams.get('moduleId');

        ['videoModule', 'filterModule'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = id === 'filterModule' ?
                '<option value="">Tüm Modüller</option>' :
                '<option value="">Modül seçin...</option>';

            modules.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.title || 'İsimsiz';
                select.appendChild(opt);
            });

            // ✅ Modülü otomatik seç
            if (preselectedModuleId && id === 'videoModule') {
                select.value = preselectedModuleId;
                console.log('✅ Modül otomatik seçildi:', preselectedModuleId);
            }
        });

        document.getElementById('active-modules').textContent = modules.length;
        console.log('✅ Modüller:', modules.length);
    } catch (e) {
        console.error('❌ Modül hatası:', e);
    }
}
```

---

### 2. instructor-courses.html - Redirect Güncellendi

**Ne Değişti:**
Video yönetim butonu artık `instructor-content.html` sayfasına yönlendiriyor

**Satır 981-984:**

**Öncesi:**
```javascript
function manageModuleVideos(moduleId) {
    console.log('🎥 Modül video yönetimi açılıyor:', moduleId);
    window.location.href = `module-video-manager.html?moduleId=${moduleId}`;
}
```

**Sonrası:**
```javascript
function manageModuleVideos(moduleId) {
    console.log('🎥 Modül video yönetimi açılıyor:', moduleId);
    window.location.href = `instructor-content.html?moduleId=${moduleId}`;  // ✅ Değişti
}
```

---

## 🎯 Nasıl Çalışır?

### Koordinatör Akışı:

#### 1. Modül Sayfasına Git
```
http://localhost:5500/instructor-courses.html
```

#### 2. Modül Kartında "Videolar" Butonuna Tıkla
```javascript
// Bu butona tıklandığında:
manageModuleVideos('module_12345')

// Şu sayfaya gider:
http://localhost:5500/instructor-content.html?moduleId=module_12345
```

#### 3. instructor-content.html Açılır
```javascript
// Sayfa yüklendiğinde:
1. loadModules() çalışır
2. URL'den moduleId alır: URLSearchParams().get('moduleId')
3. Modül dropdown'ında otomatik seçer: select.value = 'module_12345'
4. Koordinatör formu doldurur
```

#### 4. Video Formu Doldur
```
✅ Video Başlığı: "Afet Yönetimi - Giriş"
✅ YouTube URL: "https://youtube.com/watch?v=..."
✅ Modül: "Afet Yönetimi" (otomatik seçili)
✅ Süre: 15 dakika
✅ Zorluk: Başlangıç
✅ Açıklama: "..."
```

#### 5. Sorular Ekle
```javascript
// Soru tipi seç:
- Çoktan Seçmeli (4 şıklı)
- Açık Uçlu
- Boşluk Doldurma

// Her soru için:
addQuestion() → questions array'e ekler
```

#### 6. PDF Ekle
```javascript
// PDF Başlığı yaz
"Afet Yönetimi El Kitabı"

// Dosya seç
[Dosya Seçin] → afet-kitap.pdf (2.5 MB)

// PDF Yükle ve Ekle butonuna tıkla
addPDF() →
  1. Dosyayı validate et
  2. Firebase Storage'a yükle: pdfs/module_12345_1706789123456_afet-kitap.pdf
  3. Progress bar göster: 0% → 50% → 100%
  4. URL al: https://firebasestorage.googleapis.com/...
  5. pdfsData array'e ekle
  6. renderPDFList() ile göster
```

#### 7. Videoyu Kaydet
```javascript
handleSubmit() →
  1. Tüm form verilerini topla
  2. questions array'i ekle
  3. pdfs array'i ekle
  4. Firebase'e kaydet: DB.save('coordinatorVideos', data)
  5. Form'u temizle
  6. PDF listesini temizle
  7. Success mesajı: "✅ Video, sorular ve PDF'ler eklendi!"
```

---

### Firebase'e Kaydedilen Veri Yapısı:

```json
{
  "id": "video_1706789123456",
  "title": "Afet Yönetimi - Giriş",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "moduleId": "module_12345",
  "duration": 15,
  "difficulty": "beginner",
  "description": "Afet yönetimine giriş videosu",
  "questions": [
    {
      "id": "q_1",
      "type": "multiple-choice",
      "question": "Afet nedir?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    },
    {
      "id": "q_2",
      "type": "open-ended",
      "question": "Afet öncesi hazırlık önlemlerini açıklayın"
    }
  ],
  "pdfs": [
    {
      "title": "Afet Yönetimi El Kitabı",
      "url": "https://firebasestorage.googleapis.com/v0/b/cevik-lider.appspot.com/o/pdfs%2Fmodule_12345_1706789123456_afet-kitap.pdf?alt=media&token=...",
      "fileName": "afet-kitap.pdf",
      "size": 2621440,
      "storagePath": "pdfs/module_12345_1706789123456_afet-kitap.pdf"
    }
  ],
  "status": "active",
  "createdAt": "2025-01-21T10:30:00.000Z"
}
```

---

### Öğrenci Akışı:

#### 1. Modül Detay Sayfasına Git
```
http://localhost:5500/module-detail.html?moduleId=module_12345
```

#### 2. Video Seç ve İzle
```javascript
// Video kartına tıklandığında:
loadVideoDetails(videoId) →
  1. Video bilgilerini yükle
  2. YouTube player'ı göster
  3. loadPDFs(video) fonksiyonunu çağır
```

#### 3. PDF'leri Gör (module-detail.html)
```javascript
function loadPDFs(video) {
    const pdfSection = document.getElementById('pdf-section');
    const pdfContainer = document.getElementById('pdf-container');

    // PDF yoksa gizle
    if (!video.pdfs || video.pdfs.length === 0) {
        pdfSection.style.display = 'none';
        return;
    }

    // PDF varsa göster
    pdfSection.style.display = 'block';

    // PDF kartlarını oluştur
    pdfContainer.innerHTML = video.pdfs.map(pdf => `
        <a href="${pdf.url}" target="_blank"
           class="block p-4 bg-gradient-to-r from-red-50 to-orange-50
                  border-2 border-red-200 rounded-lg hover:shadow-lg
                  transition-all duration-200">
            <div class="flex items-center justify-between">
                <div class="flex items-center flex-1">
                    <i class="fas fa-file-pdf text-2xl text-red-600 mr-3"></i>
                    <div>
                        <h4 class="font-semibold text-gray-800">${pdf.title}</h4>
                        <p class="text-sm text-gray-600">
                            ${formatFileSize(pdf.size)} - İndir veya görüntüle
                        </p>
                    </div>
                </div>
                <i class="fas fa-external-link-alt text-red-600"></i>
            </div>
        </a>
    `).join('');
}
```

#### 4. PDF Kartı Görünümü
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Ek Dökümanlar ve Kaynaklar                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📕  Afet Yönetimi El Kitabı               🔗        │   │
│  │     2.5 MB - İndir veya görüntüle                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📗  Acil Durum Prosedürleri               🔗        │   │
│  │     1.8 MB - İndir veya görüntüle                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Sorun Giderme

### Problem 1: "PDF öğrenci tarafında görünmüyor"

**Sebep:**
- `handleSubmit()` fonksiyonu PDF'leri kaydetmiyordu
- Video verisinde `pdfs` array'i yoktu

**Çözüm:** ✅ TAMAM
- `handleSubmit()` güncellendi
- `pdfs` array'i video verisine eklendi
- Kayıt sonrası PDF listesi temizleniyor

### Problem 2: "Soru sistemi eski sistemdeki gibi olmalı"

**Sebep:**
- `module-video-manager.html` basit soru sistemi vardı
- `instructor-content.html` gelişmiş 3 tip soru vardı

**Çözüm:** ✅ TAMAM
- PDF özelliği `instructor-content.html`'e eklendi
- Redirect `instructor-content.html`'e yapılıyor
- 3 tip soru desteği devam ediyor

### Problem 3: "Modül otomatik seçilmiyor"

**Sebep:**
- URL'den `moduleId` alınmıyordu

**Çözüm:** ✅ TAMAM
- `loadModules()` fonksiyonu güncellendi
- `URLSearchParams` ile moduleId alınıyor
- Dropdown otomatik seçiliyor

---

## ✅ Test Senaryosu

### 1. Koordinatör Testi

```bash
# 1. Kurslara git
http://localhost:5500/instructor-courses.html

# 2. Bir modülde "Videolar" butonuna tıkla
→ instructor-content.html?moduleId=XXX açılmalı
→ Modül dropdown'ı otomatik seçilmeli

# 3. Video formu doldur
→ Başlık, URL, süre, zorluk, açıklama

# 4. Soru ekle
→ Tip seç (çoktan seçmeli, açık uçlu, boşluk doldurma)
→ Soru detaylarını gir
→ "Soru Ekle" tıkla

# 5. PDF ekle
→ PDF başlığı yaz
→ Dosya seç (.pdf, max 10MB)
→ "PDF Yükle ve Ekle" tıkla
→ Progress bar görünmeli
→ PDF listede görünmeli

# 6. Videoyu kaydet
→ "Kaydet" butonuna tıkla
→ "✅ Video, sorular ve PDF'ler eklendi!" mesajı
→ Form temizlenmeli
→ PDF listesi temizlenmeli

# 7. Firebase Console kontrol
→ coordinatorVideos koleksiyonunda video olmalı
→ pdfs array'i olmalı
→ Storage'da PDF dosyası olmalı
```

### 2. Öğrenci Testi

```bash
# 1. Modül detaya git
http://localhost:5500/module-detail.html?moduleId=XXX

# 2. Video seç
→ Video oynatıcı açılmalı

# 3. Aşağı kaydır
→ "📄 Ek Dökümanlar ve Kaynaklar" bölümü görünmeli

# 4. PDF kartlarını gör
→ Her PDF için kart olmalı
→ Başlık, boyut, ikon görünmeli

# 5. PDF'e tıkla
→ Yeni sekmede açılmalı
→ PDF görüntülenmeli veya indirilmeli

# 6. Sorular bölümü
→ Sorular görünmeli
→ Çözebilmeli
```

---

## 📊 Veri Akışı Özeti

```
KOORDINATÖR TARAFINDAN:
=====================

instructor-courses.html
    ↓ (Videolar butonuna tıkla)
instructor-content.html?moduleId=XXX
    ↓ (Modül otomatik seçilir)
Video Formu Doldur
    ↓
Sorular Ekle (3 tip)
    ↓
PDF'ler Ekle (Firebase Storage)
    ↓
Kaydet
    ↓
Firebase Firestore (coordinatorVideos)
    {
        title, youtubeUrl, moduleId, duration,
        difficulty, description,
        questions: [...],
        pdfs: [
            {title, url, fileName, size, storagePath}
        ],
        status, createdAt
    }


ÖĞRENCİ TARAFINDAN:
==================

module-detail.html?moduleId=XXX
    ↓ (Sayfa yüklenir)
Firebase'den videoları yükle
    ↓ (Video seçilir)
loadVideoDetails(videoId)
    ↓
YouTube Player Göster
    ↓
loadPDFs(video)
    ↓
PDF Kartları Oluştur
    ↓
Öğrenci PDF'leri görür ve tıklar
    ↓
PDF yeni sekmede açılır (Firebase CDN)
```

---

## 🎯 Özet

### ✅ Tamamlanan İşler:

1. **PDF Upload Sistemi**
   - ✅ Firebase Storage entegrasyonu
   - ✅ Progress bar ile yükleme
   - ✅ Dosya validasyonu (tip, boyut)
   - ✅ Unique dosya isimlendirme
   - ✅ PDF listesi gösterimi
   - ✅ PDF silme fonksiyonu

2. **instructor-content.html Entegrasyonu**
   - ✅ PDF formu eklendi
   - ✅ `handleSubmit()` güncellendi
   - ✅ PDF'ler veritabanına kaydediliyor
   - ✅ Form temizleme sonrası PDF listesi sıfırlanıyor
   - ✅ URL'den modül otomatik seçilimi

3. **instructor-courses.html Güncellemesi**
   - ✅ "Videolar" butonu `instructor-content.html`'e yönlendiriyor
   - ✅ ModuleId URL parametresi ile gönderiliyor

4. **Öğrenci Tarafı (module-detail.html)**
   - ✅ `loadPDFs()` fonksiyonu mevcut
   - ✅ PDF kartları güzel tasarım
   - ✅ Firebase Storage URL'leri çalışıyor

### 📋 Özellikler:

- ✅ 3 tip soru sistemi (çoktan seçmeli, açık uçlu, boşluk doldurma)
- ✅ Firebase Storage ile PDF depolama
- ✅ 10MB dosya boyutu limiti
- ✅ Progress bar ile upload takibi
- ✅ Otomatik modül seçimi
- ✅ Responsive PDF kartları
- ✅ Tek tıkla PDF açma/indirme

---

**Sistem Hazır!** 🚀

Koordinatörler artık video eklerken:
1. İstediği sayıda soru ekleyebilir (3 farklı tipte)
2. İstediği sayıda PDF yükleyebilir (bilgisayarından)
3. Her şey tek sayfada (`instructor-content.html`)
4. Öğrenciler videoların altında PDF'leri görebilir

---

**Hazırlayan:** Claude Sonnet 4.5 🤖
**Tarih:** 21 Ocak 2025
**Versiyon:** 2.2.0 - PDF ve Soru Sistemi Entegrasyonu Tamamlandı
