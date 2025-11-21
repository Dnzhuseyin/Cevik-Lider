# 🔍 API Key 401 Hatası Debug Rehberi

## ❌ Sorun
Kredi var ama hala 401 hatası alınıyor: "User not found"

## 🔍 Olası Sebepler

### 1. API Key Yanlış/Geçersiz
- Key'in tamamı doğru mu?
- Key'de boşluk var mı?
- Key'in başında/sonunda görünmeyen karakterler var mı?

### 2. API Key Vercel'de Inject Edilmemiş
- Build script çalışmamış olabilir
- Environment variable yanlış yazılmış olabilir

### 3. API Key Formatı Yanlış
- OpenRouter key'leri `sk-or-v1-` ile başlar
- Key'in tam formatı doğru mu?

### 4. OpenRouter'da Key Durumu
- Key aktif mi?
- Key silinmiş/deaktive edilmiş olabilir mi?

---

## ✅ ÇÖZÜM ADIMLARI

### ADIM 1: OpenRouter'da Yeni Key Oluşturun

1. **OpenRouter Dashboard:** https://openrouter.ai/keys
2. **"Create Key"** butonuna tıklayın
3. **Key Name:** `Cevik-Lider-Production-v2`
4. **Oluşturun**
5. **YENİ KEY'İ KOPYALAYIN** (tam olarak, başında/sonunda boşluk olmadan)

### ADIM 2: Yeni Key'i Test Edin

Local'de test edin:

```bash
export OPENROUTER_API_KEY="YENİ-KEY-BURAYA"
node test-openrouter-key.js
```

**Beklenen Sonuç:**
- ✅ `200 OK` → Key geçerli!
- ❌ `401` → Hala geçersiz, başka bir key deneyin

### ADIM 3: Vercel'de Güncelleyin

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **`OPENROUTER_API_KEY`** bulun
3. **"Edit"** butonuna tıklayın
4. **Value'yu SİLİN ve YENİ KEY'İ YAPIŞTIRIN**
   - ⚠️ DİKKAT: Başında/sonunda boşluk olmamalı!
   - ⚠️ DİKKAT: Tüm key'i kopyalayın (sk-or-v1-... ile başlayan)
5. **Save**
6. **Deployments** → **Redeploy**

### ADIM 4: Build Logs Kontrolü

1. **Deployments** → Son deployment → **Build Logs**
2. Şu mesajları arayın:
   ```
   🔑 OPENROUTER_API_KEY var mı? EVET (ilk 20 karakter: sk-or-v1-...)
   ✅ API Key build time'da inject edildi
   ```

### ADIM 5: Browser Console Kontrolü

Deploy sonrası:

1. **F12** → **Console**
2. Sayfayı yenileyin
3. Şu mesajları arayın:
   ```
   🔑 API Key build time'da inject edildi (Vercel)
   ✅ OpenRouter API key geçerli!
   ```

---

## 🚨 YAYGIN HATALAR

### Hata 1: Key'de Boşluk Var
**Sebep:** Key kopyalarken başında/sonunda boşluk kalmış  
**Çözüm:** Key'i tekrar kopyalayın, başında/sonunda boşluk olmadığından emin olun

### Hata 2: Key Eksik
**Sebep:** Key'in sonu kesilmiş  
**Çözüm:** Key'in tamamını kopyalayın (genellikle 50+ karakter)

### Hata 3: Eski Key Kullanılıyor
**Sebep:** Vercel cache'i eski key'i kullanıyor  
**Çözüm:** Redeploy yapın, browser cache temizleyin (Ctrl+Shift+R)

### Hata 4: Build Script Çalışmıyor
**Sebep:** `build.js` script'i çalışmamış  
**Çözüm:** `vercel.json` dosyasında `buildCommand` kontrol edin

---

## 🔧 MANUEL KONTROL

### Key Formatı Kontrolü:

Doğru format:
```
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
```

Yanlış formatlar:
```
 sk-or-v1-... (başında boşluk)
sk-or-v1-... (sonunda boşluk)
sk-or-v1-...\n (sonunda newline)
```

### Vercel Environment Variable Kontrolü:

1. **Settings** → **Environment Variables**
2. **`OPENROUTER_API_KEY`** tıklayın
3. **Value'yu kontrol edin:**
   - Başında boşluk var mı?
   - Sonunda boşluk var mı?
   - Key'in tamamı var mı?

---

## 📝 HIZLI KONTROL LİSTESİ

- [ ] OpenRouter'da yeni key oluşturdunuz mu?
- [ ] Yeni key'i local'de test ettiniz mi? (200 OK aldınız mı?)
- [ ] Vercel'de environment variable'ı güncellediniz mi?
- [ ] Key'de boşluk olmadığından emin oldunuz mu?
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "inject edildi" mesajı var mı?

---

## 🆘 HALA ÇALIŞMIYORSA

1. **OpenRouter Support'a yazın:**
   - https://openrouter.ai/docs
   - Key'in neden çalışmadığını sorun

2. **Alternatif API Key deneyin:**
   - OpenRouter'da başka bir key oluşturun
   - Test edin

3. **Build script'i manuel çalıştırın:**
   ```bash
   export OPENROUTER_API_KEY="YENİ-KEY"
   node build.js
   cat js/groq-api.js | grep "injectedKey"
   ```

---

**ÖNEMLİ:** Yeni key oluşturduktan sonra mutlaka local'de test edin, çalışıyorsa Vercel'de güncelleyin!

