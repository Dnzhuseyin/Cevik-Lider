# 🔧 OpenRouter API Key 401 Hatası Çözümü

## ❌ Hata
```
401: User not found
OpenRouter API Hatası (401)
```

## 🔍 Sorun
Vercel'de environment variable eklenmiş ama build script çalışmıyor veya API key inject edilmiyor.

## ✅ ÇÖZÜM ADIMLARI

### 1. Vercel'de Environment Variable Kontrolü

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. **`OPENROUTER_API_KEY`** var mı kontrol edin
3. **Value** doğru mu kontrol edin (tam key'i yapıştırın)
4. **Production, Preview, Development** hepsi işaretli mi?

### 2. Build Script Kontrolü

Vercel'de deploy loglarını kontrol edin:

1. **Deployments** → Son deployment → **Build Logs**
2. Şu mesajları arayın:
   ```
   🔧 Build script başlatılıyor...
   🔑 OPENROUTER_API_KEY var mı? EVET
   ✅ API Key build time'da inject edildi
   ```

3. **Eğer "HAYIR" görüyorsanız:**
   - Environment variable eklenmemiş demektir
   - Tekrar ekleyin ve redeploy yapın

### 3. Manuel Test (Local)

Local'de test etmek için:

```bash
# Terminal'de
export OPENROUTER_API_KEY="sk-or-v1-..."
node build.js

# groq-api.js dosyasını kontrol edin
grep "injectedKey" js/groq-api.js
```

### 4. Vercel'de Redeploy

1. **Settings** → **Environment Variables** → `OPENROUTER_API_KEY` kontrol edin
2. **Deployments** → Son deployment → **"..."** → **"Redeploy"**
3. **Build Logs**'u izleyin

### 5. Browser Console Kontrolü

Deploy sonrası:

1. **F12** → **Console**
2. Şu mesajları arayın:
   ```
   🔑 API Key build time'da inject edildi (Vercel)
   ✅ OpenRouter API key geçerli!
   ```

3. **Eğer "fallback key" görüyorsanız:**
   - Build script çalışmamış demektir
   - Environment variable kontrol edin

## 🚨 YAYGIN SORUNLAR

### Sorun 1: Environment Variable Eklenmemiş
**Çözüm:** Vercel Dashboard'da ekleyin

### Sorun 2: Build Script Çalışmıyor
**Çözüm:** `vercel.json` dosyasında `buildCommand` kontrol edin

### Sorun 3: API Key Yanlış
**Çözüm:** OpenRouter'dan yeni key alın

### Sorun 4: Cache Sorunu
**Çözüm:** Browser cache temizleyin (Ctrl+Shift+R)

## 📝 HIZLI KONTROL LİSTESİ

- [ ] Vercel'de `OPENROUTER_API_KEY` environment variable var mı?
- [ ] Value doğru mu? (tam key)
- [ ] Production, Preview, Development işaretli mi?
- [ ] Redeploy yaptınız mı?
- [ ] Build logs'da "EVET" görüyor musunuz?
- [ ] Browser console'da "inject edildi" mesajı var mı?

## 🔄 YENİDEN DENEME

1. **Vercel Dashboard** → **Environment Variables**
2. `OPENROUTER_API_KEY` silin (varsa)
3. Tekrar ekleyin (doğru key ile)
4. **Save**
5. **Deployments** → **Redeploy**
6. **Build Logs** kontrol edin
7. Test edin

---

**Sorun devam ederse:** Build logs'u paylaşın, birlikte çözelim!

