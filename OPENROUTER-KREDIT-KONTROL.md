# 💳 OpenRouter API Kredi Kontrol Rehberi

## ❌ 401: User not found Hatası

Bu hata genellikle şu sebeplerden kaynaklanır:

### 1. 🔑 API Key Geçersiz
- API key yanlış yazılmış
- API key silinmiş/deaktive edilmiş

### 2. 💳 Kredi Bitmiş
- OpenRouter hesabınızda kredi kalmamış
- Ücretsiz kredi limiti dolmuş

### 3. 🚫 API Key Kullanılamaz Durumda
- API key süresi dolmuş
- Hesap askıya alınmış

---

## ✅ KONTROL ADIMLARI

### ADIM 1: OpenRouter Dashboard Kontrolü

1. **OpenRouter Dashboard'a gidin:**
   - https://openrouter.ai/keys
   - Giriş yapın

2. **API Keys sekmesine gidin:**
   - Mevcut API key'lerinizi görün
   - Key'inizin durumunu kontrol edin

3. **Kredi Durumunu Kontrol Edin:**
   - Dashboard'da kredi bakiyenizi görün
   - Kredi bitmişse yeni kredi ekleyin

### ADIM 2: API Key Test

Local'de test etmek için:

```bash
# Terminal'de
export OPENROUTER_API_KEY="sk-or-v1-..."
node test-openrouter-key.js
```

**Beklenen Sonuç:**
- ✅ `200 OK` → API key geçerli, kredi var
- ❌ `401 Unauthorized` → API key geçersiz veya kredi yok
- ⚠️ `429 Rate Limit` → Çok fazla istek

### ADIM 3: Yeni API Key Oluşturma (Gerekirse)

1. **OpenRouter Dashboard** → **Keys**
2. **"Create Key"** butonuna tıklayın
3. **Key adı verin:** `Cevik-Lider-Production`
4. **Oluşturun**
5. **Yeni key'i kopyalayın**

### ADIM 4: Vercel'de Güncelleme

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **`OPENROUTER_API_KEY`** bulun
3. **Value'yu güncelleyin** (yeni key ile)
4. **Save**
5. **Redeploy yapın**

---

## 💰 Kredi Ekleme

### Ücretsiz Kredi:
- OpenRouter bazı modeller için ücretsiz kredi verir
- Dashboard'da "Credits" bölümünden kontrol edin

### Ücretli Kredi:
1. **OpenRouter Dashboard** → **Credits**
2. **"Add Credits"** butonuna tıklayın
3. **Miktar seçin**
4. **Ödeme yapın**

---

## 🔍 DETAYLI KONTROL

### API Key Durumu Kontrolü:

```bash
# Test script'i çalıştır
node test-openrouter-key.js
```

**Çıktıları kontrol edin:**
- `200 OK` → ✅ Çalışıyor
- `401 Unauthorized` → ❌ Key geçersiz veya kredi yok
- `429 Rate Limit` → ⚠️ Çok fazla istek

### Vercel Build Logs Kontrolü:

1. **Vercel Dashboard** → **Deployments**
2. **Son deployment** → **Build Logs**
3. Şu mesajları arayın:
   ```
   🔑 OPENROUTER_API_KEY var mı? EVET
   ✅ API Key build time'da inject edildi
   ```

---

## 🚨 YAYGIN SORUNLAR VE ÇÖZÜMLERİ

### Sorun 1: "User not found" (401)
**Sebep:** API key geçersiz veya kredi bitmiş  
**Çözüm:** 
- OpenRouter dashboard'da key'i kontrol edin
- Kredi durumunu kontrol edin
- Gerekirse yeni key oluşturun

### Sorun 2: "Rate limit" (429)
**Sebep:** Çok fazla istek  
**Çözüm:** 
- Birkaç dakika bekleyin
- Rate limit'i artırın (ücretli plan)

### Sorun 3: "Model not found" (404)
**Sebep:** Model adı yanlış  
**Çözüm:** 
- `groq-api.js` dosyasında model adını kontrol edin
- OpenRouter'da mevcut modelleri kontrol edin

---

## 📝 HIZLI KONTROL LİSTESİ

- [ ] OpenRouter dashboard'a giriş yaptınız mı?
- [ ] API key'iniz aktif mi?
- [ ] Kredi bakiyeniz var mı?
- [ ] API key test script'i çalıştırdınız mı?
- [ ] Vercel'de environment variable doğru mu?
- [ ] Redeploy yaptınız mı?

---

## 🔗 FAYDALI LİNKLER

- **OpenRouter Dashboard:** https://openrouter.ai/keys
- **API Documentation:** https://openrouter.ai/docs
- **Credits:** https://openrouter.ai/credits
- **Models:** https://openrouter.ai/models

---

**Sorun devam ederse:** OpenRouter dashboard'da key ve kredi durumunu kontrol edin, sonra test script'i çalıştırın.

