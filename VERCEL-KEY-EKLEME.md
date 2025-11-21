# 🔑 Yeni OpenRouter API Key Vercel'e Ekleme Rehberi

## ✅ Yeni API Key
```
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
```

---

## 📋 VERCEL'E EKLEME ADIMLARI

### ADIM 1: Vercel Dashboard'a Giriş

1. **https://vercel.com/dashboard** adresine gidin
2. **Projenizi seçin:** `Cevik-Lider`

### ADIM 2: Environment Variables

1. **Settings** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın

### ADIM 3: Yeni Key Ekleme veya Güncelleme

#### Eğer `OPENROUTER_API_KEY` zaten varsa:
1. **`OPENROUTER_API_KEY`** satırını bulun
2. **"Edit"** (kalem ikonu) butonuna tıklayın
3. **Value** alanını tamamen silin
4. **Yeni key'i yapıştırın:**
   ```
   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
   ```
5. **⚠️ DİKKAT:** Başında/sonunda boşluk olmamalı!
6. **"Save"** butonuna tıklayın

#### Eğer `OPENROUTER_API_KEY` yoksa:
1. **"Add New"** butonuna tıklayın
2. **Name:** `OPENROUTER_API_KEY`
3. **Value:** Yeni key'i yapıştırın:
   ```
   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
   ```
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
   🔑 OPENROUTER_API_KEY var mı? EVET (ilk 20 karakter: sk-or-v1-68ff7bc1bf...)
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
   🔑 API Key build time'da inject edildi (Vercel)
   ✅ OpenRouter API key geçerli!
   ✅ OpenRouter API entegrasyonu hazır!
   ```

**Eğer "fallback key" görüyorsanız:**
- Build script çalışmamış demektir
- Environment variable'ı kontrol edin
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

- [ ] Vercel'de `OPENROUTER_API_KEY` environment variable eklendi/güncellendi
- [ ] Value doğru mu? (tam key, boşluk yok)
- [ ] Production, Preview, Development hepsi işaretli mi?
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "inject edildi" mesajı var mı?
- [ ] 401 hatası gitti mi?
- [ ] AI özellikleri çalışıyor mu?

---

## 📝 ÖZET

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ `OPENROUTER_API_KEY` ekleyin/güncelleyin
3. ✅ Yeni key'i yapıştırın (boşluk olmadan)
4. ✅ Production/Preview/Development işaretleyin
5. ✅ Save
6. ✅ Redeploy
7. ✅ Test edin

---

**✅ Hazır! Artık yeni API key kullanılıyor olmalı!**

