# ÇEVİK LİDER EĞİTİM PLATFORMU - 40 GÜNLÜK STAJ PLANI

**Stajyer:** Hüseyin Deniz
**Proje:** Çevik Lider Online Eğitim Platformu
**Başlangıç Tarihi:** [Staj başlangıç tarihinizi yazın]
**Bitiş Tarihi:** [40 gün sonrası]
**Teknolojiler:** HTML, CSS, JavaScript, Firebase, GROQ AI API, Tailwind CSS

---

## 1. GÜN - Proje Tanıma ve Ortam Kurulumu
**Hedef:** Projenin genel yapısını anlamak ve geliştirme ortamını kurmak
**Yapılacaklar:**
- Proje dosya yapısını incelemek (HTML, JS, CSS dosyaları)
- Firebase yapılandırmasını kontrol etmek
- Yerel sunucuyu başlatmak (`npm run dev`)
- Mevcut özellikleri test etmek (öğrenci/eğitmen girişi)
- Git repository yapısını anlamak
**Çıktı:** Çalışan yerel geliştirme ortamı ve proje yapısı hakkında not

---

## 2. GÜN - Kullanıcı Kimlik Doğrulama Sistemi İncelemesi
**Hedef:** Firebase Authentication sistemini anlamak
**Yapılacaklar:**
- `register.html` ve kayıt işlevlerini incelemek
- `instructor-login.html` ve giriş mekanizmalarını anlamak
- Firebase Auth yapılandırmasını kontrol etmek (`js/firebase-production.js`)
- Kullanıcı rollerinin (student/instructor) nasıl yönetildiğini anlamak
**Çıktı:** Kimlik doğrulama akış şeması ve kullanıcı yönetimi dokümantasyonu

---

## 3. GÜN - Öğrenci Dashboard Analizi
**Hedef:** Öğrenci panelinin tüm özelliklerini anlamak
**Yapılacaklar:**
- `student-dashboard.html` dosyasını detaylı incelemek
- İstatistik kartlarının (tamamlanan modüller, sertifikalar) veri kaynağını bulmak
- Sidebar navigasyon yapısını anlamak
- Responsive tasarımı farklı ekran boyutlarında test etmek
**Çıktı:** Öğrenci dashboard özellik listesi ve veri akış diyagramı

---

## 4. GÜN - Eğitmen Dashboard Analizi
**Hedef:** Eğitmen panelinin yetkilerini ve özelliklerini anlamak
**Yapılacaklar:**
- `instructor-dashboard.html` dosyasını incelemek
- `instructor-courses.html` ile kurs yönetimi akışını anlamak
- `instructor-students.php` ile öğrenci takip sistemini incelemek
- Eğitmen ve öğrenci panelleri arasındaki farkları belgelemek
**Çıktı:** Eğitmen yetkileri ve öğrenci yönetimi işlevleri raporu

---

## 5. GÜN - Modül ve İçerik Yönetim Sistemi
**Hedef:** Eğitim modüllerinin nasıl oluşturulup yönetildiğini öğrenmek
**Yapılacaklar:**
- `instructor-content.php` dosyasını analiz etmek
- Video, quiz ve içerik ekleme formlarını incelemek
- Firebase Firestore'da modül veri yapısını anlamak
- `module-detail.php` ile öğrenci tarafında modül görüntülemeyi test etmek
**Çıktı:** Modül veri modeli şeması ve içerik yönetimi iş akışı

---

## 6. GÜN - Video Oynatıcı ve İlerleme Takibi
**Hedef:** Video izleme sistemini ve ilerleme takibini anlamak
**Yapılacaklar:**
- `module-detail.php` içindeki video oynatıcı kodunu incelemek
- Video izleme durumunun nasıl kaydedildiğini araştırmak
- İlerleme yüzdesi hesaplama mantığını anlamak
- `progress.html` sayfasında ilerleme görselleştirmesini test etmek
**Çıktı:** Video izleme ve ilerleme takip sistemi dokümantasyonu

---

## 7. GÜN - GROQ AI API Entegrasyonu İncelemesi
**Hedef:** AI destekli quiz sistemi altyapısını anlamak
**Yapılacaklar:**
- `js/groq-api.js` dosyasını detaylı incelemek
- API proxy yapılandırmasını (`api/groq-proxy.php`) anlamak
- GROQ API dokümantasyonunu okumak
- Test quiz oluşturarak API yanıtlarını gözlemlemek
**Çıktı:** GROQ AI entegrasyon mimarisi ve API kullanım kılavuzu

---

## 8. GÜN - Quiz Sistemi - Soru Tipleri Analizi
**Hedef:** Farklı quiz soru tiplerini ve değerlendirme sistemini anlamak
**Yapılacaklar:**
- Çoktan seçmeli soru yapısını incelemek
- Doğru/Yanlış soru formatını test etmek
- Boşluk doldurma sorularının AI ile nasıl değerlendirildiğini anlamak
- `student-quiz.html` ve quiz render mekanizmasını incelemek
**Çıktı:** Quiz soru tipleri ve değerlendirme algoritması dokümantasyonu

---

## 9. GÜN - Notlar Sistemi (My Notes)
**Hedef:** Öğrenci not alma özelliğini anlamak
**Yapılacaklar:**
- `my-notes.html` sayfasını incelemek
- Firebase Firestore'da notların nasıl saklandığını araştırmak
- Not ekleme, düzenleme ve silme işlevlerini test etmek
- Notların modüllerle ilişkilendirilmesini anlamak
**Çıktı:** Not yönetim sistemi veri akışı ve kullanıcı senaryoları

---

## 10. GÜN - Firebase Firestore Veri Yapısı
**Hedef:** Veritabanı şemasını ve koleksiyonları detaylı anlamak
**Yapılacaklar:**
- Firebase Console'dan tüm koleksiyonları incelemek
- Kullanıcı, modül, quiz, ilerleme koleksiyonlarını analiz etmek
- Veri ilişkilerini (relationships) belgelemek
- Güvenlik kurallarını (Security Rules) gözden geçirmek
**Çıktı:** Tam veritabanı şeması diyagramı ve güvenlik kuralları raporu

---

## 11. GÜN - Responsive Tasarım ve Tailwind CSS
**Hedef:** Platformun responsive tasarım prensiplerini öğrenmek
**Yapılacaklar:**
- Tailwind CSS yapılandırmasını incelemek
- Mobil, tablet ve desktop görünümlerini test etmek
- Sidebar menü davranışlarını farklı ekranlarda kontrol etmek
- Breakpoint stratejilerini anlamak
**Çıktı:** Responsive tasarım stratejisi ve Tailwind utility kullanım rehberi

---

## 12. GÜN - Öğrenci İlerleme Raporu Geliştirme
**Hedef:** İlerleme görselleştirmesini iyileştirmek
**Yapılacaklar:**
- Mevcut `progress.html` sayfasını analiz etmek
- Grafik kütüphanesi araştırması yapmak (Chart.js, ApexCharts)
- Basit bir ilerleme grafiği eklemek
- Modül bazlı tamamlanma oranlarını göstermek
**Çıktı:** Geliştirilmiş ilerleme rapor sayfası ve görselleştirme

---

## 13. GÜN - Sertifika Sistemi Tasarımı
**Hedef:** Kurs tamamlama sertifikası özelliği tasarlamak
**Yapılacaklar:**
- Sertifika verme kriterlerini belirlemek
- Basit bir sertifika HTML şablonu oluşturmak
- Sertifika veri modelini Firestore'da tasarlamak
- PDF export için araştırma yapmak (html2pdf, jsPDF)
**Çıktı:** Sertifika tasarımı ve veri modeli dokümantasyonu

---

## 14. GÜN - Sertifika Sistemi Implementasyonu
**Hedef:** Sertifika oluşturma ve görüntüleme özelliğini kodlamak
**Yapılacaklar:**
- Sertifika oluşturma fonksiyonunu yazmak
- Öğrenci dashboard'a sertifikalar bölümü eklemek
- Modül tamamlama kontrolü ile sertifika tetikleme
- Test kullanıcısı ile sertifika oluşturmayı test etmek
**Çıktı:** Çalışan sertifika oluşturma ve görüntüleme sistemi

---

## 15. GÜN - Bildirim Sistemi Tasarımı
**Hedef:** Kullanıcılara bildirim gönderme altyapısını tasarlamak
**Yapılacaklar:**
- Firebase Cloud Messaging (FCM) araştırması yapmak
- Bildirim türlerini belirlemek (quiz başarısı, yeni modül, vb.)
- Basit bir in-app notification UI tasarlamak
- Bildirim veri modelini oluşturmak
**Çıktı:** Bildirim sistemi mimari tasarımı ve UI mockup

---

## 16. GÜN - Basit Bildirim Özelliği Ekleme
**Hedef:** Temel bildirim gösterim özelliğini eklemek
**Yapılacaklar:**
- Navbar'a bildirim ikonu eklemek
- Basit bir notification dropdown oluşturmak
- Firestore'da notifications koleksiyonu oluşturmak
- Quiz tamamlama sonrası otomatik bildirim eklemek
**Çıktı:** Çalışan temel bildirim sistemi

---

## 17. GÜN - Arama Özelliği Tasarımı
**Hedef:** Modüllerde arama yapabilme özelliği tasarlamak
**Yapılacaklar:**
- Arama arayüzü tasarımı oluşturmak
- Firestore sorgu stratejisi belirlemek
- `courses.html` sayfasına arama kutusu eklemek
- Filtreleme seçeneklerini planlamak (kategori, zorluk)
**Çıktı:** Arama özelliği UI tasarımı ve sorgu stratejisi

---

## 18. GÜN - Arama Özelliği Implementasyonu
**Hedef:** Modül arama ve filtreleme özelliğini kodlamak
**Yapılacaklar:**
- Arama inputu için JavaScript fonksiyonu yazmak
- Firestore'dan modülleri filtreleyerek getirmek
- Gerçek zamanlı arama sonuçları göstermek
- Kategori ve zorluk bazlı filtreleme eklemek
**Çıktı:** Çalışan arama ve filtreleme sistemi

---

## 19. GÜN - Favoriler Özelliği
**Hedef:** Öğrencilerin favori modülleri kaydetmesini sağlamak
**Yapılacaklar:**
- Modül kartlarına favori ikonu eklemek
- Firestore'da favori modülleri kaydetme sistemi oluşturmak
- `my-favorites.html` sayfası tasarlamak
- Favori ekleme/çıkarma fonksiyonlarını yazmak
**Çıktı:** Favori modül yönetim sistemi

---

## 20. GÜN - Dashboard Analitik Geliştirmeleri
**Hedef:** Öğrenci dashboard'a daha fazla istatistik eklemek
**Yapılacaklar:**
- Haftalık öğrenme süresi grafiği eklemek
- En çok izlenen modüller listesi göstermek
- Quiz başarı oranı widget'ı oluşturmak
- Aktivite takvimi (heatmap) eklemek
**Çıktı:** Zenginleştirilmiş analytics dashboard

---

## 21. GÜN - Eğitmen İçin İstatistik Paneli
**Hedef:** Eğitmen dashboard'a analitik özellikler eklemek
**Yapılacaklar:**
- Toplam öğrenci sayısı ve aktif kullanıcı istatistiği
- En popüler modüller listesi
- Ortalama quiz başarı oranları grafiği
- Haftalık kayıt trendi grafiği
**Çıktı:** Eğitmen analitik dashboard

---

## 22. GÜN - Profil Sayfası Geliştirmeleri
**Hedef:** `account.html` sayfasını zenginleştirmek
**Yapılacaklar:**
- Profil fotoğrafı yükleme özelliği eklemek
- Firebase Storage entegrasyonu yapmak
- Şifre değiştirme fonksiyonu eklemek
- Kullanıcı bilgilerini güncelleme formunu iyileştirmek
**Çıktı:** Gelişmiş profil yönetim sayfası

---

## 23. GÜN - Dark Mode Özelliği
**Hedef:** Platformda karanlık tema desteği eklemek
**Yapılacaklar:**
- Tailwind dark mode yapılandırması yapmak
- Tema değiştirme toggle butonu eklemek
- LocalStorage'da tema tercihini kaydetmek
- Tüm sayfalarda dark mode stillerini uygulamak
**Çıktı:** Çalışan dark/light mode geçiş sistemi

---

## 24. GÜN - Quiz Performans Detayları
**Hedef:** Quiz sonuçlarını daha detaylı göstermek
**Yapılacaklar:**
- Quiz geçmişi sayfası oluşturmak
- Soru bazlı doğru/yanlış analizi göstermek
- Güçlü ve zayıf alanları belirleme algoritması
- Zamana göre performans grafiği eklemek
**Çıktı:** Detaylı quiz performans analiz sayfası

---

## 25. GÜN - Video İzleme Hızı Kontrolü
**Hedef:** Video oynatıcıya gelişmiş kontroller eklemek
**Yapılacaklar:**
- Oynatma hızı seçenekleri eklemek (0.5x, 1x, 1.5x, 2x)
- Kalite ayarı ekleme araştırması (video bağlantı türüne göre)
- Tam ekran modu iyileştirmeleri
- Klavye kısayolları eklemek (Space, Arrow keys)
**Çıktı:** Gelişmiş video oynatıcı kontrolleri

---

## 26. GÜN - Alt Yazı (Subtitle) Desteği
**Hedef:** Videolara altyazı ekleme özelliği geliştirmek
**Yapılacaklar:**
- WebVTT formatı araştırması yapmak
- Eğitmen paneline altyazı yükleme özelliği eklemek
- Video oynatıcıda altyazı gösterim seçeneği eklemek
- Test altyazı dosyası ile denemeler yapmak
**Çıktı:** Video altyazı yönetim sistemi

---

## 27. GÜN - Toplu Quiz Oluşturma (Bulk Quiz)
**Hedef:** Eğitmenlerin toplu quiz eklemesini kolaylaştırmak
**Yapılacaklar:**
- CSV veya JSON formatında quiz import özelliği tasarlamak
- Dosya yükleme arayüzü oluşturmak
- Parse ve validasyon fonksiyonları yazmak
- Örnek quiz template'i hazırlamak
**Çıktı:** Toplu quiz import sistemi

---

## 28. GÜN - Öğrenci Geri Bildirim Sistemi
**Hedef:** Modüller için değerlendirme ve yorum sistemi
**Yapılacaklar:**
- Yıldız rating sistemi eklemek
- Yorum yazma ve okuma arayüzü oluşturmak
- Firestore'da reviews koleksiyonu tasarlamak
- Modül detay sayfasına değerlendirmeleri entegre etmek
**Çıktı:** Çalışan değerlendirme ve yorum sistemi

---

## 29. GÜN - Leaderboard (Lider Tablosu)
**Hedef:** Öğrenciler arası sıralama sistemi oluşturmak
**Yapılacaklar:**
- Puan hesaplama sistemini tasarlamak
- Lider tablosu sayfası (`leaderboard.html`) oluşturmak
- Haftalık/aylık/tüm zamanlar sekmeli görünüm eklemek
- Kullanıcının kendi sıralamasını vurgulamak
**Çıktı:** Gamifikasyon lider tablosu

---

## 30. GÜN - Rozet (Badge) Sistemi
**Hedef:** Başarı rozetleri sistemi geliştirmek
**Yapılacaklar:**
- Rozet türlerini tasarlamak (ilk modül, 10 quiz, vb.)
- Rozet görsellerini hazırlamak veya bulmak
- Profil sayfasına rozet vitrinini eklemek
- Otomatik rozet kazanma kontrolü yazmak
**Çıktı:** Gamifikasyon rozet sistemi

---

## 31. GÜN - Öğrenme Streaks (Seri)
**Hedef:** Günlük aktivite serisi özelliği eklemek
**Yapılacaklar:**
- Günlük aktivite takip algoritması yazmak
- Dashboard'da streak sayacı göstermek
- Seri kırıldığında bildirim göstermek
- Longest streak istatistiğini tutmak
**Çıktı:** Motivasyon artırıcı streak sistemi

---

## 32. GÜN - Forum/Tartışma Alanı Tasarımı
**Hedef:** Basit bir Q&A/tartışma sistemi tasarlamak
**Yapılacaklar:**
- Forum yapısını planlamak (konu, mesaj yapısı)
- Firestore veri modelini tasarlamak
- Forum ana sayfa mockup'ını oluşturmak
- Moderasyon özellikleri planlamak
**Çıktı:** Forum sistemi mimari tasarımı

---

## 33. GÜN - Forum Implementasyonu
**Hedef:** Basit forum özelliğini kodlamak
**Yapılacaklar:**
- `forum.html` sayfasını oluşturmak
- Yeni konu açma formunu eklemek
- Konuları listeleme ve mesaj gönderme
- Eğitmen/admin cevap vurgulama özelliği
**Çıktı:** Çalışan temel forum sistemi

---

## 34. GÜN - E-posta Bildirimleri
**Hedef:** Önemli olaylarda e-posta gönderme özelliği
**Yapılacaklar:**
- Firebase Cloud Functions araştırması
- Sendgrid veya Nodemailer entegrasyonu
- Yeni modül, quiz sonucu için e-posta şablonları
- E-posta tercihleri ayarları sayfası
**Çıktı:** E-posta bildirim sistemi

---

## 35. GÜN - İndirme Merkezi
**Hedef:** Ek materyalleri indirme sistemi oluşturmak
**Yapılacaklar:**
- Eğitmen paneline dosya yükleme özelliği eklemek
- Firebase Storage entegrasyonu yapmak
- Modül detay sayfasında indirilebilir dosyaları göstermek
- Dosya tipi ikonları ve boyut gösterimi eklemek
**Çıktı:** Dosya paylaşım ve indirme sistemi

---

## 36. GÜN - Mobil Uygulama Hazırlığı - PWA
**Hedef:** Progressive Web App özelliklerini eklemek
**Yapılacaklar:**
- `manifest.json` dosyası oluşturmak
- Service Worker eklemek (offline desteği için)
- App ikonları ve splash screen hazırlamak
- Mobilde "Ana ekrana ekle" özelliğini test etmek
**Çıktı:** PWA özellikli platform

---

## 37. GÜN - Performans Optimizasyonu
**Hedef:** Platform hızını ve performansını artırmak
**Yapılacaklar:**
- Lazy loading uygular (görseller, videolar)
- Firestore sorgu optimizasyonları yapmak
- Gereksiz kod ve CSS temizliği
- Lighthouse skorunu ölçmek ve iyileştirmek
**Çıktı:** Optimize edilmiş platform performansı

---

## 38. GÜN - Güvenlik İyileştirmeleri
**Hedef:** Güvenlik açıklarını kapatmak ve güvenliği artırmak
**Yapılacaklar:**
- Firebase Security Rules'ı gözden geçirmek ve sıkılaştırmak
- XSS ve injection saldırılarına karşı koruma eklemek
- API anahtarlarının güvenliğini kontrol etmek
- Rate limiting araştırması yapmak
**Çıktı:** Güvenlik audit raporu ve iyileştirmeler

---

## 39. GÜN - Kullanıcı Testleri ve Hata Düzeltme
**Hedef:** Tüm özellikleri test etmek ve hataları düzeltmek
**Yapılacaklar:**
- Tüm kullanıcı akışlarını (user flows) test etmek
- Bulunan hataları kaydetmek ve önceliklendirmek
- Kritik hataları düzeltmek
- Responsive tasarım son kontrolleri yapmak
**Çıktı:** Test raporu ve bug fix listesi

---

## 40. GÜN - Dokümantasyon ve Proje Teslimi
**Hedef:** Kapsamlı dokümantasyon oluşturmak ve projeyi teslim etmek
**Yapılacaklar:**
- Teknik dokümantasyon yazmak (kurulum, mimari)
- Kullanıcı kılavuzu hazırlamak
- README.md dosyasını detaylandırmak
- Gelecek geliştirmeler için öneriler listesi oluşturmak
- Staj raporu ve sunum hazırlamak
**Çıktı:** Tam dokümantasyon paketi ve final sunum

---

## NOTLAR
- Her günün sonunda yapılan işleri git commit ile kaydedin
- Karşılaşılan sorunları ve çözümleri dokümante edin
- Öğrendiğiniz yeni teknolojileri not alın
- Eğitmeninizle düzenli olarak ilerleme paylaşın

**Başarılar! 🚀**
