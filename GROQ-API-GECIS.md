# 🔄 OpenRouter'dan Groq API'ye Geçiş Rehberi

## ✅ Yapılan Değişiklikler

### 1. API Endpoint Değişti
- **Eski:** `https://openrouter.ai/api/v1/chat/completions`
- **Yeni:** `https://api.groq.com/openai/v1/chat/completions`

### 2. Model Değişti
- **Eski:** `meta-llama/llama-3.1-70b-instruct` (OpenRouter)
- **Yeni:** `llama-3.3-70b-versatile` (Groq)

### 3. API Key Formatı Değişti
- **Eski:** `sk-or-v1-...` (OpenRouter)
- **Yeni:** `gsk_...` (Groq)

### 4. Headers Değişti
- **Eski:** `HTTP-Referer`, `X-Title` header'ları vardı
- **Yeni:** Sadece `Authorization` ve `Content-Type` (Groq daha basit)

### 5. Environment Variable Adı Değişti
- **Eski:** `OPENROUTER_API_KEY`
- **Yeni:** `GROQ_API_KEY`

---

## 🔑 Groq API Key
```
Vercel Dashboard'da GROQ_API_KEY environment variable olarak ekleyin
API key'i buraya yazmayın (güvenlik için)
```

---

## 📋 VERCEL'E EKLEME ADIMLARI

### ADIM 1: Eski Environment Variable'ı Silin

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **`OPENROUTER_API_KEY`** bulun
3. **"Delete"** butonuna tıklayın (veya Edit → Value'yu silin)

### ADIM 2: Yeni Environment Variable Ekleyin

1. **"Add New"** butonuna tıklayın
2. **Name:** `GROQ_API_KEY`
3. **Value:** Groq API key'inizi yapıştırın (Vercel Dashboard'da ekleyeceksiniz)
4. **⚠️ DİKKAT:** 
   - Başında/sonunda boşluk olmamalı!
   - Tam key'i kopyalayın
5. **Environment'ları seçin:**
   - ✅ **Production** (işaretleyin)
   - ✅ **Preview** (işaretleyin)
   - ✅ **Development** (işaretleyin)
6. **"Save"** butonuna tıklayın

### ADIM 3: Redeploy

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
   🔑 GROQ_API_KEY var mı? EVET (ilk 20 karakter: gsk_KJfu7OeT3BgkMvD5...)
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
   🔑 Injected Key (ilk 30 karakter): gsk_KJfu7OeT3BgkMvD5cziVWGdyb3...
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

### Hata 4: Model Decommissioned
**Sebep:** Eski model kullanılıyor  
**Çözüm:** Kod güncellendi, yeni model: `llama-3.3-70b-versatile`

---

## ✅ BAŞARI KONTROL LİSTESİ

- [ ] Eski `OPENROUTER_API_KEY` silindi
- [ ] Yeni `GROQ_API_KEY` eklendi
- [ ] Value doğru (Groq key, boşluk yok)
- [ ] Production, Preview, Development hepsi işaretli
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "Groq API" mesajları var mı?
- [ ] Browser console'da "fallback key" YOK mu?
- [ ] 401 hatası gitti mi?

---

## 📝 ÖZET

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ Eski `OPENROUTER_API_KEY` silin
3. ✅ Yeni `GROQ_API_KEY` ekleyin
4. ✅ Groq API key'i yapıştırın (boşluk olmadan)
5. ✅ Production/Preview/Development işaretleyin
6. ✅ Save
7. ✅ Redeploy
8. ✅ Test edin

---

## 🔄 DEĞİŞİKLİKLER ÖZETİ

| Özellik | OpenRouter | Groq |
|---------|-----------|------|
| Endpoint | `openrouter.ai/api/v1/chat/completions` | `api.groq.com/openai/v1/chat/completions` |
| Model | `meta-llama/llama-3.1-70b-instruct` | `llama-3.3-70b-versatile` |
| Key Format | `sk-or-v1-...` | `gsk_...` |
| Headers | `HTTP-Referer`, `X-Title` | Sadece `Authorization` |
| Env Variable | `OPENROUTER_API_KEY` | `GROQ_API_KEY` |

---

**✅ Hazır! Artık Groq API kullanılıyor!**

