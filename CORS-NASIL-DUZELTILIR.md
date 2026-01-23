# Firebase Storage CORS Hatası Çözümü

## Sorun
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...'
from origin 'http://localhost:5500' has been blocked by CORS policy
```

PDF yükleme çalışıyor ama Firebase Storage localhost'a izin vermiyor.

---

## Çözüm 1: Firebase Storage Security Rules (ÖNCELİKLE BU)

### Adım 1: Firebase Console'a Git
```
https://console.firebase.google.com/project/cevik-lider/storage
```

### Adım 2: "Rules" Sekmesine Tıkla

### Adım 3: Rules'ı Güncelle

**Mevcut rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Yeni rules (pdfs klasörü için upload izni):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // PDF klasörü - herkes yükleyebilir (koordinatörler için)
    match /pdfs/{allPaths=**} {
      allow read: if true;
      allow write: if true;  // ← BU SATIR EKLENDİ
    }

    // Diğer dosyalar - sadece giriş yapmış kullanıcılar
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Adım 4: "Publish" Butonuna Tıkla

### Adım 5: Test Et

Sayfayı yenileyin ve PDF yüklemeyi tekrar deneyin.

---

## Çözüm 2: CORS Ayarlarını Güncelle (Gerekirse)

Eğer rules güncellemesi yeterli olmazsa, CORS ayarlarını da güncellemeliyiz.

### Yöntem A: Google Cloud Console (Web - Kolay)

1. **Google Cloud Console'a gidin:**
   ```
   https://console.cloud.google.com/storage/browser/cevik-lider.firebasestorage.app
   ```

2. **Bucket'a tıklayın** (cevik-lider.firebasestorage.app)

3. **"Permissions" sekmesine gidin**

4. **"CORS" başlığını bulun**

5. **"Edit CORS Configuration" tıklayın**

6. **Şu JSON'u yapıştırın:**
   ```json
   [
     {
       "origin": ["http://localhost:3000", "http://localhost:5500", "http://localhost:8080", "https://cevik-lider.vercel.app"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

7. **Save**

### Yöntem B: Google Cloud SDK (Terminal - İleri Seviye)

#### 1. Google Cloud SDK Yükle

**Mac (Homebrew):**
```bash
brew install google-cloud-sdk
```

**Windows:**
```
https://cloud.google.com/sdk/docs/install#windows
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

#### 2. Giriş Yap
```bash
gcloud auth login
```

Tarayıcıda Google hesabınızla giriş yapın.

#### 3. Projeyi Seç
```bash
gcloud config set project cevik-lider
```

#### 4. CORS Ayarlarını Uygula

Proje klasöründe `cors.json` dosyası var. Şunu çalıştırın:

```bash
cd "/Users/huseyindeniz/Desktop/yeniWeb - Kopya"
gsutil cors set cors.json gs://cevik-lider.firebasestorage.app
```

#### 5. CORS Ayarlarını Kontrol Et
```bash
gsutil cors get gs://cevik-lider.firebasestorage.app
```

Output:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:5500", ...],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

---

## Çözüm 3: Geçici Workaround (Test için)

Eğer yukarıdaki çözümler hemen çalışmazsa, test için şu yolu deneyebilirsiniz:

### Firebase Hosting Üzerinden Test

1. **Firebase Hosting'e Deploy Edin:**
   ```bash
   cd "/Users/huseyindeniz/Desktop/yeniWeb - Kopya"
   firebase deploy --only hosting
   ```

2. **Deploy edilen URL'yi açın:**
   ```
   https://cevik-lider.web.app
   ```

3. **Bu URL'de PDF yükleme çalışacaktır** çünkü aynı Firebase domain'i.

---

## Test Senaryosu

### 1. Rules Güncellemesi Sonrası Test

```bash
# Tarayıcıda:
http://localhost:5500/instructor-login.html

# Giriş → Modüller → Videolar → PDF Ekle
# Console'da:
📤 PDF yükleniyor: test.pdf
📊 Upload ilerleme: 100%
✅ test.pdf başarıyla yüklendi!

# CORS hatası YOKSA ✅ çalışıyor!
```

### 2. CORS Güncellemesi Sonrası Test

CORS ayarlarının yayılması **5-10 dakika** sürebilir. Bekleyin ve tekrar deneyin.

```bash
# Cache temizle
Cmd+Shift+Delete (Mac) veya Ctrl+Shift+Delete (Windows)

# Sayfayı yenileyin
Cmd+Shift+R veya Ctrl+Shift+R

# PDF yükleyin
# Console'da CORS hatası olmamalı
```

---

## Hata Ayıklama

### Hata 1: "Permission denied"
**Çözüm:** Firebase Storage Rules'da `allow write: if true;` ekleyin

### Hata 2: "CORS policy"
**Çözüm:** CORS ayarlarını güncelleyin (yukarıda)

### Hata 3: "gsutil: command not found"
**Çözüm:** Google Cloud SDK yükleyin:
```bash
brew install google-cloud-sdk  # Mac
```

### Hata 4: "You do not have permission"
**Çözüm:** Firebase projesinde Owner veya Editor rolünüz olduğundan emin olun:
```
https://console.firebase.google.com/project/cevik-lider/settings/iam
```

---

## Önemli Notlar

1. **Security Rules her zaman hemen yayılır** (1-2 saniye)
2. **CORS ayarları yayılması 5-10 dakika sürebilir**
3. **Tarayıcı cache'i temizleyin** her testten sonra
4. **Private/Incognito mode** test için idealdir

---

## Başarı Kriterleri

✅ Console'da CORS hatası YOK
✅ `📊 Upload ilerleme: 100%` görünüyor
✅ `✅ ... başarıyla yüklendi!` mesajı
✅ PDF listede kırmızı kart olarak görünüyor
✅ Kaydettiğinizde `📄 PDF sayısı: 1`
✅ Firebase Storage'da `pdfs/` klasöründe dosya var
✅ Öğrenci tarafında PDF görünüyor

---

**Hazırlayan:** Claude Sonnet 4.5 🤖
**Tarih:** 21 Ocak 2025
**Sorun:** Firebase Storage CORS Hatası
**Çözüm:** Security Rules + CORS Ayarları
