# 🔑 Vercel'de GROQ_API_KEY Environment Variable Ekleme

## ❌ Hata

```
❌ Groq API Proxy Hatası (500): 
{"error":"API key not configured","message":"GROQ_API_KEY environment variable is missing"}
```

**Sebep:** Vercel'de `GROQ_API_KEY` environment variable eklenmemiş veya yanlış yapılandırılmış.

---

## ✅ Çözüm: Vercel'de Environment Variable Ekleme

### ADIM 1: Vercel Dashboard'a Giriş

1. **https://vercel.com/dashboard** adresine gidin
2. **Projenizi seçin:** `Cevik-Lider` (veya proje adınız)

### ADIM 2: Settings'e Gidin

1. Proje sayfasında **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın

### ADIM 3: Yeni Environment Variable Ekleme

1. **"Add New"** butonuna tıklayın

2. **Name:** 
   ```
   GROQ_API_KEY
   ```
   ⚠️ **DİKKAT:** Tam olarak bu şekilde yazın, büyük/küçük harf duyarlı!

3. **Value:** 
   Groq API key'inizi yapıştırın (Vercel Dashboard'da ekleyeceksiniz)
   ⚠️ **DİKKAT:** 
   - Başında/sonunda boşluk olmamalı
   - Tam key'i kopyalayın
   - Tek tırnak veya çift tırnak kullanmayın

4. **Environments:** 
   ✅ **Production** (işaretleyin)
   ✅ **Preview** (işaretleyin)
   ✅ **Development** (işaretleyin)
   
   ⚠️ **ÖNEMLİ:** Hepsini işaretleyin, aksi halde bazı ortamlarda çalışmaz!

5. **"Save"** butonuna tıklayın

### ADIM 4: Redeploy

Environment variable ekledikten sonra **mutlaka redeploy yapmalısınız!**

#### Yöntem 1: Otomatik Redeploy
- Yeni bir commit push edin
- Vercel otomatik olarak deploy edecek

#### Yöntem 2: Manuel Redeploy
1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. **"Redeploy"** butonuna tıklayın

---

## 🔍 Kontrol

### 1. Environment Variable Kontrolü

Vercel Dashboard → Settings → Environment Variables:
- ✅ `GROQ_API_KEY` var mı?
- ✅ Value doğru mu? (Groq API key formatında: `gsk_...` ile başlamalı)
- ✅ Production, Preview, Development hepsi işaretli mi?

### 2. Build Logs Kontrolü

Deployments → Son deployment → Build Logs:
- ✅ Build başarılı mı?
- ✅ "Compiling groq-proxy.js" mesajı var mı?
- ❌ "GROQ_API_KEY environment variable is missing" hatası YOK mu?

### 3. Browser Console Kontrolü

Deploy sonrası browser console'da:
```
🚀 GroqAPI constructor başlatılıyor...
🔒 Güvenli API Proxy kullanılıyor (API key backend'de)
🔗 Proxy URL: /api/groq-proxy
🔑 Groq API proxy test ediliyor...
✅ Groq API proxy çalışıyor!
✅ API bağlantısı başarılı
```

**Eğer hala 500 hatası görüyorsanız:**
- ❌ Environment variable eklenmemiş veya yanlış
- ❌ Redeploy yapılmamış
- ❌ Environment variable'da boşluk var

---

## 🚨 Yaygın Hatalar

### Hata 1: "GROQ_API_KEY environment variable is missing"
**Sebep:** Environment variable eklenmemiş  
**Çözüm:** Yukarıdaki adımları takip edin

### Hata 2: "Invalid API Key" (401)
**Sebep:** Environment variable'da yanlış key var  
**Çözüm:** Key'i tekrar kopyalayın, başında/sonunda boşluk olmadığından emin olun

### Hata 3: Hala 500 hatası (redeploy sonrası)
**Sebep:** Environment variable sadece bir environment'a eklenmiş  
**Çözüm:** Production, Preview, Development hepsini işaretleyin

### Hata 4: Environment variable var ama çalışmıyor
**Sebep:** Redeploy yapılmamış  
**Çözüm:** Mutlaka redeploy yapın!

---

## ✅ Başarı Kontrol Listesi

- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] `GROQ_API_KEY` eklendi
- [ ] Value doğru (Groq API key)
- [ ] Production, Preview, Development hepsi işaretli
- [ ] Save butonuna tıklandı
- [ ] Redeploy yapıldı
- [ ] Build logs'da hata yok
- [ ] Browser console'da "✅ Groq API proxy çalışıyor!" mesajı var
- [ ] 500 hatası gitti mi?

---

## 📝 Özet

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ `GROQ_API_KEY` ekleyin
3. ✅ Groq API key'inizi yapıştırın
4. ✅ Production, Preview, Development hepsini işaretleyin
5. ✅ Save
6. ✅ Redeploy yapın
7. ✅ Test edin

---

**✅ Hazır! Artık API Proxy çalışacak!**

