# 🔑 Vercel Environment Variables Kurulum Rehberi

## 📋 OpenRouter API Key Ekleme Adımları

### AŞAMA 1: Vercel Dashboard'a Giriş

1. **Vercel Dashboard'a gidin:**
   - https://vercel.com/dashboard
   - Projenizi seçin: `Cevik-Lider`

### AŞAMA 2: Environment Variables Ekleme

1. **Settings'e gidin:**
   - Proje sayfasında → **"Settings"** sekmesine tıklayın
   - Sol menüden **"Environment Variables"** seçeneğine tıklayın

2. **Yeni Variable Ekle:**
   - **"Add New"** butonuna tıklayın
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** OpenRouter API key'inizi yapıştırın
     ```
     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
     ```

3. **Environment'ları Seçin:**
   - ✅ **Production** (işaretleyin)
   - ✅ **Preview** (işaretleyin)
   - ✅ **Development** (işaretleyin)

4. **"Save" butonuna tıklayın**

### AŞAMA 3: Redeploy

1. **Deployments sekmesine gidin**
2. **Son deployment'ın yanındaki "..." menüsüne tıklayın**
3. **"Redeploy" seçeneğini seçin**
4. **"Redeploy" butonuna tıklayın**

VEYA

1. **GitHub'a yeni bir commit push edin**
2. Vercel otomatik olarak yeni deploy başlatacak

---

## 🔍 Kontrol

Deploy sonrası:

1. **Browser Console'u açın (F12)**
2. **Şu mesajı görmelisiniz:**
   ```
   ✅ OpenRouter API key geçerli!
   ✅ OpenRouter API entegrasyonu hazır!
   ```

3. **Eğer hata görürseniz:**
   - Environment variable'ın doğru eklendiğini kontrol edin
   - Redeploy yaptığınızdan emin olun
   - Browser cache'i temizleyin (Ctrl+Shift+R)

---

## 📝 Notlar

- ✅ Environment variable'lar build time'da inject edilir
- ✅ Production, Preview ve Development için ayrı ayrı ayarlanabilir
- ✅ API key artık kodda hardcoded değil, güvenli şekilde saklanıyor
- ✅ Her environment için farklı API key kullanabilirsiniz

---

## 🚨 Güvenlik

- ❌ API key'i asla GitHub'a commit etmeyin
- ✅ `.gitignore` dosyasında `.env` dosyaları zaten ignore ediliyor
- ✅ Environment variable'lar Vercel'de şifrelenmiş olarak saklanır
- ✅ Sadece authorized kullanıcılar görebilir

---

**✅ Hazır! Artık API key güvenli şekilde Vercel'de saklanıyor.**

