# 🔑 Groq API - Vercel Environment Variable Kurulum Rehberi

## ✅ Groq API Key

**NOT:** API key'i Vercel Dashboard'da environment variable olarak ekleyeceksiniz.  
**Test Sonucu:** ✅ API Key geçerli (200 OK)

---

## 📋 VERCEL'E EKLEME ADIMLARI

### ADIM 1: Vercel Dashboard'a Giriş

1. **https://vercel.com/dashboard** adresine gidin
2. **Projenizi seçin:** `Cevik-Lider`

### ADIM 2: Environment Variables

1. **Settings** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın

### ADIM 3: Yeni Key Ekleme veya Güncelleme

#### Eğer `GROQ_API_KEY` zaten varsa:
1. **`GROQ_API_KEY`** satırını bulun
2. **"Edit"** (kalem ikonu) butonuna tıklayın
3. **Value** alanını tamamen silin
4. **Groq API key'inizi yapıştırın** (Vercel Dashboard'da ekleyeceksiniz)
5. **⚠️ DİKKAT:** Başında/sonunda boşluk olmamalı!
6. **"Save"** butonuna tıklayın

#### Eğer `GROQ_API_KEY` yoksa:
1. **"Add New"** butonuna tıklayın
2. **Name:** `GROQ_API_KEY`
3. **Value:** Groq API key'inizi yapıştırın (Vercel Dashboard'da ekleyeceksiniz)
4. **Environment'ları seçin:**
   - ✅ **Production** (işaretleyin)
   - ✅ **Preview** (işaretleyin)
   - ✅ **Development** (işaretleyin)
5. **"Save"** butonuna tıklayın

### ADIM 4: Redeploy

1. **Deployments** sekmesine gidin
2. **Son deployment'ın yanındaki "..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. **"Redeploy"** butonuna tıklayın

VEYA

1. **GitHub'a yeni bir commit push edin**
2. Vercel otomatik olarak yeni deploy başlatacak

---

## 🔍 KONTROL ADIMLARI

### 1. Build Logs Kontrolü

1. **Deployments** → Son deployment → **Build Logs**
2. Şu mesajları arayın:
   ```
   🔧 Build script başlatılıyor...
   🔑 GROQ_API_KEY var mı? EVET (ilk 20 karakter: gsk_5alDDzRkDGd2X63t...)
   ✅ Environment variable bulundu, inject ediliyor...
   ✅ API Key build time'da inject edildi
   ✅ groq-api.js dosyası güncellendi
   ```

**Eğer "HAYIR" görüyorsanız:**
- Environment variable eklenmemiş demektir
- Tekrar ekleyin

### 2. Browser Console Kontrolü

Deploy sonrası:

1. **F12** → **Console**
2. Sayfayı yenileyin (Ctrl+Shift+R - cache temizle)
3. Şu mesajları arayın:
   ```
   🚀 GroqAPI constructor başlatılıyor...
   🔑 API Key build time'da inject edildi (Vercel)
   🔑 Injected Key (ilk 30 karakter): gsk_5alDDzRkDGd2X63tcVwSWGdyb3...
   🔑 Groq API key test ediliyor...
   ✅ Groq API key geçerli!
   ✅ Groq API entegrasyonu hazır!
   ```

**Eğer "fallback key" görüyorsanız:**
- Build script çalışmamış demektir
- Build logs kontrol edin
- Redeploy yapın

### 3. API Test

Sayfada bir AI özelliği kullanın (örneğin video önerisi):
- Hata olmamalı
- Console'da 401 hatası görünmemeli
- AI yanıtı gelmeli

---

## 🚨 YAYGIN HATALAR

### Hata 1: "HAYIR" Build Logs'da
**Sebep:** Environment variable eklenmemiş  
**Çözüm:** Tekrar ekleyin, Production/Preview/Development hepsini işaretleyin

### Hata 2: "fallback key" Console'da
**Sebep:** Build script çalışmamış  
**Çözüm:** Redeploy yapın, build logs kontrol edin

### Hata 3: Hala 401 Hatası
**Sebep:** Key'de boşluk var veya yanlış key  
**Çözüm:** Key'i tekrar kopyalayın, başında/sonunda boşluk olmadığından emin olun

---

## ✅ BAŞARI KONTROL LİSTESİ

- [ ] Vercel'de `GROQ_API_KEY` environment variable var
- [ ] Value doğru (Groq key, boşluk yok)
- [ ] Production, Preview, Development hepsi işaretli
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "inject edildi" mesajı var mı?
- [ ] Browser console'da "fallback key" YOK mu?
- [ ] 401 hatası gitti mi?

---

## 📝 ÖZET

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ `GROQ_API_KEY` ekleyin/güncelleyin
3. ✅ Yeni key'i yapıştırın (boşluk olmadan)
4. ✅ Production/Preview/Development işaretleyin
5. ✅ Save
6. ✅ Redeploy
7. ✅ Test edin

---

**✅ Hazır! Artık Groq API kullanılıyor!**

