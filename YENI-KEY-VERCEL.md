# 🔑 Yeni OpenRouter API Key - Vercel'e Ekleme

## ✅ Yeni API Key
```
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
```

---

## 📋 VERCEL'E EKLEME ADIMLARI

### ADIM 1: Vercel Dashboard

1. **https://vercel.com/dashboard** → Projeniz: `Cevik-Lider`
2. **Settings** → **Environment Variables**

### ADIM 2: Environment Variable Güncelleme

1. **`OPENROUTER_API_KEY`** satırını bulun
2. **"Edit"** (kalem ikonu) butonuna tıklayın
3. **Value** alanını tamamen silin
4. **Yeni key'i yapıştırın:**
   ```
   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
   ```
5. **⚠️ DİKKAT:** 
   - Başında/sonunda boşluk olmamalı!
   - Tam key'i kopyalayın (68 karakter)
6. **Environment'ları kontrol edin:**
   - ✅ **Production** (işaretli olmalı)
   - ✅ **Preview** (işaretli olmalı)
   - ✅ **Development** (işaretli olmalı)
7. **"Save"** butonuna tıklayın

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
   🔑 OPENROUTER_API_KEY var mı? EVET (ilk 20 karakter: sk-or-v1-c5a05f0847...)
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
   🔑 Injected Key (ilk 30 karakter): sk-or-v1-c5a05f0847d0e43f8e0d4c39e...
   🔑 API Key alındı, uzunluk: 68
   🔑 API Key başlangıcı: sk-or-v1-c5a05f0847d0e43f8e0d4c39e...
   ✅ OpenRouter API key geçerli!
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

- [ ] Vercel'de `OPENROUTER_API_KEY` environment variable güncellendi
- [ ] Value doğru (yeni key, boşluk yok)
- [ ] Production, Preview, Development hepsi işaretli
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "inject edildi" mesajı var mı?
- [ ] Browser console'da "fallback key" YOK mu?
- [ ] 401 hatası gitti mi?

---

## 📝 ÖZET

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ `OPENROUTER_API_KEY` güncelleyin
3. ✅ Yeni key'i yapıştırın (boşluk olmadan)
4. ✅ Production/Preview/Development işaretleyin
5. ✅ Save
6. ✅ Redeploy
7. ✅ Test edin

---

**✅ Hazır! Artık yeni API key kullanılıyor olmalı!**

