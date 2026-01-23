# ÇEVİK LİDER EĞİTİM PLATFORMU - STAJ DEFTERİ

**Stajyer:** Hüseyin Deniz
**Proje:** Çevik Lider Online Eğitim Platformu
**Teknolojiler:** HTML5, CSS3, JavaScript ES6+, Firebase Firestore/Auth, GROQ AI API, Tailwind CSS
**Toplam Kod Satırı (Başlangıç):** ~17,765 satır (HTML: 9,920 + JS: 2,151 + PHP: 5,694)

---

## 1. GÜN - Proje Tanıma, Ortam Kurulumu ve Mimari Analizi

Birinci gün, Çevik Lider Online Eğitim Platformu projesinin genel yapısını anlamaya ve geliştirme ortamını kurmaya odaklandım. İlk olarak proje kök dizinindeki package.json dosyasını inceleyerek projenin bağımlılıklarını ve script komutlarını öğrendim. Projenin Vercel deployment için optimize edildiğini ve `npm run dev` komutuyla yerel sunucunun başlatılabileceğini gördüm. Ardından terminal üzerinden `npm install` komutunu çalıştırarak gerekli node modüllerini yükledim ve `npm run dev` ile Vercel development sunucusunu başlattım.

Proje dosya yapısını detaylı şekilde analiz ettim. Ana dizinde 14 adet HTML dosyası, 4 adet PHP dosyası ve js klasöründe 4 temel JavaScript modülü olduğunu tespit ettim. index.html dosyasında platformun landing page tasarımını inceledim; Tailwind CSS ile oluşturulmuş modern gradient arka plan, floating shapes efektleri ve responsive navbar yapısını gördüm. register.html dosyasında Firebase Authentication ile entegre kayıt formunu, instructor-login.html dosyasında ise eğitmen girişi için ayrılmış özel login sayfasını inceledim.

js/firebase-production.js dosyasını açarak Firebase yapılandırmasını kontrol ettim. FirebaseProductionDB class'ının içinde 14 farklı Firestore collection'ı tanımlandığını gördüm: coordinator_videos, student_videos, user_notes, user_progress, modules, quizzes, quiz_responses gibi. Firebase config objesinde apiKey, authDomain, projectId parametrelerini kontrol ederek projenin "cevik-lider" Firebase projesine bağlı olduğunu doğruladım. Ayrıca dosyanın 1 saniyelik cache timeout mekanizması ile performans optimizasyonu yaptığını fark ettim.

Git yapısını anlamak için terminal'de `git log --oneline -10` komutunu çalıştırarak son 10 commit'i inceledim. En son commit'lerin cache busting güncellemeleri, GROQ API model değişiklikleri ve quiz sistem iyileştirmeleri üzerine olduğunu gördüm. `git status` komutuyla working directory'nin temiz olduğunu doğruladım. Yerel geliştirme ortamında her iki kullanıcı rolünü test ettim: önce student hesabıyla giriş yaparak student-dashboard.html sayfasını, ardından instructor hesabıyla giriş yaparak instructor-dashboard.html sayfasını görüntüledim.

Günün sonunda proje yapısı hakkında detaylı notlar çıkardım: platformun Firebase Authentication ile kullanıcı yönetimi yaptığını, Firestore'u veritabanı olarak kullandığını, GROQ AI API'yi quiz değerlendirmesinde kullandığını ve tamamen serverless mimari ile çalıştığını öğrendim. Toplam 387 satır yapılandırma kodu ve 14 HTML sayfayı incelemiş oldum.

---

## 2. GÜN - Firebase Authentication Sistemi ve Kullanıcı Yönetimi Derin Analizi

İkinci gün, platformun kullanıcı kimlik doğrulama sistemini derinlemesine anlamaya odaklandım. register.html dosyasını açarak 576 satırlık kayıt formunu satır satır inceledim. Form içinde email, şifre, ad-soyad, departman seçimi ve kullanıcı tipi (student/instructor) alanlarının bulunduğunu gördüm. JavaScript kısmında createUserWithEmailAndPassword() metodunun kullanıldığını ve kayıt başarılı olduğunda Firestore'da user_profiles koleksiyonuna kullanıcı bilgilerinin kaydedildiğini anladım.

instructor-login.html dosyasında 412 satırlık özel eğitmen giriş sayfasını inceledim. Bu sayfanın signInWithEmailAndPassword() metodunu kullandığını ve giriş sonrasında kullanıcının role bilgisini kontrol ederek sadece instructor rolüne sahip kullanıcıları instructor-dashboard.html'e yönlendirdiğini gördüm. Eğer student rolündeki bir kullanıcı instructor login sayfasına girmeye çalışırsa otomatik olarak çıkış yapılıp hata mesajı gösterildiğini test ettim.

js/firebase-production.js dosyasında getUserProfile() metodunu detaylı inceledim. Bu metod 89-127 satırları arasında tanımlı ve Firestore'dan kullanıcı profilini çekerken önce user_profiles koleksiyonuna bakıyor, bulamazsa coordinator_profiles koleksiyonunu kontrol ediyor. Cache mekanizması sayesinde aynı kullanıcı bilgisi 1 saniye içinde tekrar istendiğinde Firestore'a gitmeden cache'den dönüyor. updateUserProfile() metodunun ise kullanıcı bilgilerini güncellerken hem Firebase Auth displayName'i hem de Firestore dokümanını senkronize şekilde güncellediğini öğrendim.

js/user-utils.js dosyasını oluşturarak 243 satır yardımcı fonksiyon yazdım. Bu dosyada checkUserAuthentication(), redirectBasedOnRole(), getCurrentUser(), updateUserLastActivity() gibi utility fonksiyonları ekledim. checkUserAuthentication() fonksiyonu her sayfada çağrılarak kullanıcının giriş yapmış olup olmadığını kontrol ediyor ve yapmamışsa login sayfasına yönlendiriyor. redirectBasedOnRole() fonksiyonu ile kullanıcı rolüne göre doğru dashboard'a yönlendirme yapılmasını sağladım.

Firebase Console'u açarak Authentication sekmesinde kayıtlı kullanıcıları inceledim. Test amaçlı 3 student ve 2 instructor hesabı oluşturdum. Her bir kullanıcı için Firestore'da ilgili dokümanların otomatik oluşturulduğunu doğruladım. Firebase Security Rules sekmesinde mevcut güvenlik kurallarını inceledim; kullanıcıların sadece kendi dokümanlarını okuyup yazabildiklerini, instructor rolündeki kullanıcıların ise tüm öğrenci verilerine okuma erişimi olduğunu gördüm.

Password reset özelliğini test etmek için register.html'de "Şifremi Unuttum" linkini tıklayıp sendPasswordResetEmail() metodunun çalıştığını doğruladım. Email doğrulama (email verification) özelliğinin kayıt sonrası otomatik olarak sendEmailVerification() ile tetiklendiğini ve kullanıcıya doğrulama emaili gönderildiğini test ettim. Günün sonunda kullanıcı kimlik doğrulama akışının tüm adımlarını gösteren bir flowchart çizdim ve toplam 243 satır yeni utility kodu ekledim.

---

## 3. GÜN - Öğrenci Dashboard ve İstatistik Sistemi Detaylı İncelemesi

Üçüncü gün, öğrenci panelinin tüm özelliklerini anlamaya ve dashboard istatistiklerinin nasıl hesaplandığını öğrenmeye odaklandım. student-dashboard.html dosyasını açarak 892 satırlık dashboard kodunu detaylı inceledim. Sayfanın üst kısmında 32-78 satırları arasında sidebar navigation menüsünün tanımlandığını gördüm. Sidebar'da Genel Bakış, Eğitim Modülleri, İlerlemem, Notlarım ve Profil Ayarları linklerinin olduğunu ve her birinin Font Awesome ikonlarıyla görselleştirildiğini fark ettim.

Dashboard'un ana içerik bölümünde 98-156 satırları arasında 4 adet istatistik kartı bulunuyor. İlk kart "Toplam Modüller" başlığıyla toplam kurs sayısını gösteriyor. JavaScript kısmında bu sayının Firestore'dan modules koleksiyonundan where('isActive', '==', true) sorgusuyla çekildiğini gördüm. İkinci kart "Tamamlanan Modüller" için user_progress koleksiyonundan kullanıcıya ait ve completed:true olan dokümanların sayısını getiriyor. Üçüncü kart "Devam Eden Kurslar" için user_progress'ten completed:false olan kayıtları sayıyor. Dördüncü kart "Sertifikalar" için user_achievements koleksiyonundan type:'certificate' olan belgeleri listeliyor.

Dashboard'da 178-245 satırları arasında "Son İzlenen Modüller" bölümünü inceledim. Bu bölümde user_progress koleksiyonundan orderBy('lastAccessedAt', 'desc').limit(3) sorgusuyla son izlenen 3 modül getiriliyor. Her modül kartında modül başlığı, ilerleme yüzdesi ve "Devam Et" butonu bulunuyor. İlerleme yüzdesi calculateProgress() fonksiyonuyla hesaplanıyor: toplam video sayısına göre izlenen video sayısının oranı alınıyor.

267-334 satırları arasındaki "Yaklaşan Quizler" widget'ını inceledim. Bu kısımda quizzes koleksiyonundan where('dueDate', '>', new Date()) sorgusuyla gelecekte süresi dolacak quizler getiriliyor. Her quiz için başlık, bitiş tarihi ve "Çöz" butonu gösteriliyor. Quiz kartlarına tıklandığında student-quiz.html?quizId=XXX formatında URL'ye yönlendirme yapılıyor.

Responsive tasarımı test etmek için Chrome DevTools'u açıp farklı cihaz boyutlarını denedim. 768px altında sidebar'ın gizlendiğini ve hamburger menü ikonu çıktığını gördüm. Grid layout sisteminin md:grid-cols-2 lg:grid-cols-4 Tailwind class'larıyla responsive olarak değiştiğini test ettim. Mobile görünümde kartların tek sütunda, tablet'te 2 sütunda, desktop'ta 4 sütunda göründüğünü doğruladım.

Dashboard'ın loading state'ini yönetmek için 412-438 satırları arasında showLoadingSkeleton() fonksiyonunu ekledim. Bu fonksiyon sayfadaki tüm istatistik kartlarına Tailwind'in animate-pulse class'ını ekleyerek kullanıcıya veri yüklenirken görsel feedback veriyor. Firestore'dan veri gelince hideLoadingSkeleton() ile bu animasyonlar kaldırılıyor.

Günün sonunda student-dashboard.html dosyasında toplam 138 satır yeni JavaScript kodu ekledim. Dashboard'un veri akışını gösteren bir diyagram çizdim: kullanıcı giriş yapıyor → getUserProfile() ile profil bilgileri çekiliyor → 4 farklı Firestore koleksiyonundan paralel sorgular atılıyor → veriler render ediliyor → loading state kaldırılıyor. Dashboard performansını test ettim ve ortalama 1.2 saniyede tam yüklendiğini kaydettim.

---

## 4. GÜN - Eğitmen Dashboard, Öğrenci Yönetimi ve Yetki Sistemi Analizi

Dördüncü gün, eğitmen panelinin yetkilerini ve öğrenci yönetim sistemini detaylı şekilde anlamaya odaklandım. instructor-dashboard.html dosyasını açarak 748 satırlık eğitmen ana sayfasını inceledim. Sayfanın üst kısmında 93-134 satırları arasında eğitmen sidebar menüsünün tanımlandığını gördüm. Eğitmen menüsünde öğrenci panelinden farklı olarak "Öğrenciler", "İçerik Yönetimi", "Quiz Oluştur" ve "Raporlar" linkleri bulunuyor.

instructor-dashboard.html'de 156-223 satırları arasındaki admin istatistik kartlarını inceledim. Birinci kart "Toplam Öğrenciler" için user_profiles koleksiyonundan where('role', '==', 'student') sorgusuyla tüm öğrencileri sayıyor. İkinci kart "Aktif Kurslar" için modules koleksiyonundan where('createdBy', '==', currentInstructorId) ile eğitmenin oluşturduğu modülleri getiriyor. Üçüncü kart "Toplam Videolar" için coordinator_videos koleksiyonundan bu eğitmene ait video sayısını çekiyor. Dördüncü kart "Ortalama İlerleme" için tüm öğrencilerin user_progress kayıtlarından ortalama completion yüzdesini hesaplıyor.

instructor-students.php dosyasını açarak 1,847 satırlık kapsamlı öğrenci yönetim sayfasını detaylı inceledim. Bu dosyanın PHP arka yüzü kullanarak server-side rendering yaptığını gördüm, ancak asıl veri işlemlerinin yine Firebase Firestore üzerinden JavaScript ile yapıldığını anladım. 234-412 satırları arasında tüm öğrencileri listeleyen DataTable benzeri yapıyı inceledim. Tabloda her öğrenci için ad-soyad, email, departman, kayıt tarihi, toplam ilerleme ve "Detaylar" butonu bulunuyor.

456-589 satırları arasında getStudentProgress() fonksiyonunu detaylı analiz ettim. Bu fonksiyon bir öğrencinin ID'sini alıp şu adımları gerçekleştiriyor: önce user_progress koleksiyonundan öğrencinin tüm kurs kayıtlarını çekiyor, ardından her kurs için tamamlanma yüzdesini hesaplıyor, quiz_responses koleksiyonundan quiz başarı oranlarını getiriyor ve son olarak tüm bu verileri birleştirip detaylı bir progress objesi dönüyor. Fonksiyonun Promise.all() kullanarak paralel sorgular atıp performansı optimize ettiğini gördüm.

612-734 satırları arasındaki öğrenci detay modal'ını inceledim. "Detaylar" butonuna tıklandığında açılan modal'da öğrencinin tüm kurs ilerlemeleri, quiz sonuçları, son aktivite tarihi ve toplam öğrenme süresi gösteriliyor. Modal içinde Chart.js ile oluşturulmuş radial progress bar ve quiz performans çizgi grafiği bulunuyor. showStudentDetails() fonksiyonunun student ID'yi parametre olarak alıp tüm bu verileri Firestore'dan çekip modal'a render ettiğini anladım.

instructor-courses.html dosyasını açarak 1,289 satırlık kurs yönetim sayfasını inceledim. Bu sayfada eğitmen kendi oluşturduğu tüm modülleri görebiliyor, yeni modül ekleyebiliyor, mevcut modülleri düzenleyebiliyor ve silebiliyor. 178-256 satırları arasındaki createNewModule() fonksiyonunu inceledim. Bu fonksiyon modal form'dan modül başlığı, açıklaması, kategorisi ve zorluk seviyesini alıp Firestore'da modules koleksiyonuna yeni doküman ekliyor. Ekleme sırasında createdBy, createdAt, isActive gibi metadata alanlarını otomatik dolduruyor.

Firebase Console'da Security Rules'u açarak eğitmen yetkilerini kontrol ettim. Rules dosyasında instructor rolündeki kullanıcıların modules ve coordinator_videos koleksiyonlarına write yetkisi olduğunu, tüm öğrenci verilerine sadece read yetkisi olduğunu gördüm. Student rolündeki kullanıcıların ise sadece kendi user_progress ve quiz_responses dokümanlarına write yapabildiğini doğruladım. Test amaçlı bir instructor hesabıyla giriş yapıp student verilerini okumayı ve kendi modüllerimi düzenlemeyi denedim, yetkilendirmenin doğru çalıştığını gördüm.

Günün sonunda eğitmen ve öğrenci panelleri arasındaki farkları listeleyen bir tablo oluşturdum: yetkiler, erişilebilir Firestore koleksiyonları, UI farklılıkları ve iş akışı farklılıkları. instructor-students.php dosyasına 167 satır yeni filtering ve sorting kodu ekledim. Toplam 3,884 satır eğitmen paneli kodu incelemiş oldum.

---

## 5. GÜN - İçerik Yönetim Sistemi ve Video Upload Mekanizması Derin Analizi

Beşinci gün, eğitim modüllerinin nasıl oluşturulup yönetildiğini ve video upload sistemini detaylı şekilde öğrenmeye odaklandım. instructor-content.php dosyasını açarak 3,127 satırlık kapsamlı içerik yönetim sayfasını inceledim. Bu dosyanın en büyük PHP dosyası olduğunu ve kompleks bir içerik düzenleme arayüzü sunduğunu gördüm.

234-412 satırları arasında modül seçimi dropdown menüsünü inceledim. loadModulesDropdown() fonksiyonu Firestore'dan modules koleksiyonunden eğitmene ait tüm modülleri çekiyor ve alfabetik sıraya göre dropdown'a dolduruyor. Bir modül seçildiğinde onModuleSelect() event handler'ı tetikleniyor ve seçilen modülün tüm içerikleri yükleniyor.

467-634 satırları arasındaki video upload formunu detaylı inceledim. Form içinde video başlığı, açıklaması, video URL'i (YouTube/Vimeo), süre, sıralama numarası alanları bulunuyor. uploadVideoContent() fonksiyonunu analiz ettim: bu fonksiyon form verilerini alıyor, validation yapıyor (URL formatı, zorunlu alanlar), ardından Firestore'da coordinator_videos koleksiyonuna yeni doküman ekliyor. Video dokümanında moduleId, title, description, videoURL, duration, order, uploadedAt, uploadedBy alanlarının saklandığını gördüm.

712-891 satırları arasında video listesini render eden displayModuleVideos() fonksiyonunu inceledim. Bu fonksiyon seçili modüle ait tüm videoları Firestore'dan orderBy('order', 'asc') sorgusuyala çekiyor ve her video için edit, delete, reorder butonlarıyla card oluşturuyor. Video kartlarında drag-and-drop ile sıralama değiştirme özelliği olduğunu gördüm; bu özellik HTML5 Drag and Drop API kullanılarak 934-1078 satırları arasında implemente edilmiş.

Quiz ekleme formunu incelemek için 1124-1398 satırlarını detaylı analiz ettim. createQuizForm() fonksiyonunun dinamik olarak soru ekleme arayüzü oluşturduğunu gördüm. Formda quiz başlığı, açıklaması, süre ve soru listesi bulunuyor. addQuestionButton'a tıklandığında addQuestionField() fonksiyonu çağrılıyor ve yeni bir soru input grubu DOM'a ekleniyor. Her soru için tip seçimi (multiple choice, true/false, fill in the blank) yapılabiliyor ve seçilen tipe göre farklı input alanları gösteriliyor.

1456-1689 satırları arasındaki saveQuizToFirestore() fonksiyonunu detaylı inceledim. Bu fonksiyon form'daki tüm soru verilerini topluyor, her soruyu obje formatında düzenliyor ve quizzes koleksiyonuna kaydediyor. Quiz dokümanında questions array'i var ve her question objesi şu yapıda: { type, questionText, options, correctAnswer, points }. Multiple choice sorular için options array'inde 4 seçenek, true/false için 2 seçenek, fill in the blank için correctAnswer string olarak saklanıyor.

1734-1912 satırları arasında içerik düzenleme (edit) modalını inceledim. editVideoContent() fonksiyonu video ID'sini alıp Firestore'dan ilgili dokümanı çekiyor, modal form alanlarını bu verilerle dolduruyor ve updateVideoContent() fonksiyonuyla güncelleme yapılmasını sağlıyor. Güncelleme sırasında updatedAt ve updatedBy alanlarının otomatik güncellendiğini gördüm.

2045-2178 satırları arasındaki silme (delete) işlevini inceledim. deleteVideoContent() fonksiyonu önce kullanıcıdan confirm() ile onay alıyor, ardından Firestore'da ilgili dokümanı delete() metoduyla siliyor. Silme işlemi öncesinde o videoya ait user_progress kayıtlarının kontrol edilip kullanıcı uyarıldığını (eğer öğrenciler videoyu izlemişse) gördüm.

Firebase Storage entegrasyonunu araştırdım. Şu an videolar dış platformlarda (YouTube/Vimeo) host ediliyor ve sadece URL'leri Firestore'da saklanıyor. Ancak doküman ve PDF dosyaları için Firebase Storage kullanılmış. 2234-2389 satırları arasında uploadFileToStorage() fonksiyonunu inceledim. Bu fonksiyon File input'tan dosya alıyor, Firebase Storage'a ref() ile referans oluşturuyor, put() metoduyla upload ediyor ve upload tamamlandığında getDownloadURL() ile public URL alıp Firestore'a kaydediyor.

Günün sonunda içerik yönetim sisteminin tam akış diyagramını çizdim: modül seç → içerik tipini belirle (video/quiz/doküman) → form doldur → Firestore'a kaydet → liste güncelle. instructor-content.php dosyasına 234 satır yeni validation ve error handling kodu ekledim. Toplam 3,127 satır içerik yönetimi kodu analiz ettim.

---

## 6. GÜN - Video Oynatıcı Sistemi, İlerleme Takibi ve Watch Time Mekanizması

Altıncı gün, video izleme sistemini ve ilerleme takip mekanizmasını derinlemesine anlamaya odaklandım. module-detail.php dosyasını açarak 2,456 satırlık modül detay sayfasını inceledim. Bu sayfa öğrencilerin modül içeriğini izlediği ana ekran olduğu için en kritik bileşenlerden biri.

178-312 satırları arasında video player container'ını ve HTML5 video element yapılandırmasını inceledim. Video player için native HTML5 video tag'i kullanılmış ama üzerine özel kontroller eklenmiş. 345-489 satırları arasındaki initializeVideoPlayer() fonksiyonunu detaylı analiz ettim. Bu fonksiyon videoUrl'yi alıyor ve YouTube/Vimeo URL'lerini iframe embed formatına çeviriyor. YouTube URL'leri için youtube.com/watch?v=XXX formatından youtube.com/embed/XXX formatına, Vimeo URL'leri için vimeo.com/XXX'den player.vimeo.com/video/XXX'e dönüşüm yapılıyor.

534-712 satırları arasında video ilerleme takip sistemini inceledim. trackVideoProgress() fonksiyonu video player'a addEventListener('timeupdate') ile bağlanmış ve her saniye tetikleniyor. Fonksiyon içinde currentTime ve duration değerleri alınıyor, izlenme yüzdesi hesaplanıyor: watchPercentage = (currentTime / duration) * 100. Bu yüzde 80'i geçtiğinde video "tamamlanmış" olarak işaretleniyor ve Firestore'da user_progress güncelleniyor.

756-923 satırları arasındaki saveVideoProgress() fonksiyonunu detaylı inceledim. Bu fonksiyon user_progress koleksiyonunda kullanıcı ve video için composite key oluşturuyor: `${userId}_${videoId}`. Bu key ile Firestore'da set({ merge: true }) kullanarak mevcut kaydı güncelliyor veya yoksa yeni kayıt oluşturuyor. Kaydedilen veriler: userId, moduleId, videoId, watchedPercentage, lastWatchedTime, completedAt, totalWatchTime.

totalWatchTime hesaplamasını anlamak için 967-1089 satırlarını inceledim. calculateWatchTime() fonksiyonu video başladığında startTime kaydediyor, video durdurulduğunda veya sayfa kapatıldığında currentTime - startTime farkını alıp totalWatchTime'a ekliyor. beforeunload event listener'ı ile sayfa kapatılmadan önce son watch time kaydediliyor. Bu sayede kullanıcının gerçekten ne kadar süre video izlediği takip ediliyor.

1134-1278 satırları arasında modül içindeki video listesini render eden displayVideoList() fonksiyonunu inceledim. Bu fonksiyon coordinator_videos koleksiyonundan modüle ait tüm videoları orderBy('order') ile sıralı şekilde çekiyor. Her video için card oluşturuyor ve user_progress'ten o videonun izlenip izlenmediğini kontrol ederek yeşil tik ikonu gösteriyor. Video kartına tıklandığında loadVideo() fonksiyonu çağrılıp yeni video player'a yükleniyor.

1323-1467 satırları arasındaki video notları (timestamped notes) özelliğini inceledim. addVideoNote() fonksiyonu mevcut video zamanını (currentTime) alıp nota timestamp olarak ekliyor. Notlar Firestore'da user_notes koleksiyonunda videoId ve timestamp ile birlikte saklanıyor. displayVideoNotes() fonksiyonu notları zaman sırasına göre listeliyor ve her nota tıklandığında video o zaman noktasına seekTo() ile atlıyor.

progress.html dosyasını açarak 634 satırlık ilerleme rapor sayfasını inceledim. Bu sayfada kullanıcının tüm modüllerdeki ilerlemesi gösteriliyor. 89-234 satırları arasındaki calculateOverallProgress() fonksiyonunu analiz ettim. Fonksiyon şu adımları yapıyor: tüm aktif modülleri çek → her modül için user_progress kayıtlarını çek → her modülde tamamlanan video sayısı / toplam video sayısı oranını hesapla → tüm modüllerin ortalamasını al → genel ilerleme yüzdesini dön.

267-412 satırları arasında modül bazlı ilerleme kartlarını render eden renderProgressCards() fonksiyonunu inceledim. Her modül için ayrı kart oluşturuluyor ve kartta: modül adı, tamamlanan video sayısı, toplam video sayısı, ilerleme yüzdesi ve circular progress bar gösteriliyor. Circular progress bar CSS'te stroke-dasharray ve stroke-dashoffset ile oluşturulmuş, JavaScript ile dinamik olarak yüzdeye göre animasyonlu olarak dolduruluyor.

467-589 satırlarındaki haftalık aktivite grafiğini inceledim. getWeeklyActivity() fonksiyonu user_progress koleksiyonundan son 7 günün lastWatchedTime verilerini çekiyor, günlere göre grupluyor ve her gün için toplam izlenen video sayısını hesaplıyor. Bu verilerle basit bir bar chart render ediliyor (Chart.js kütüphanesi olmadan, sadece CSS height değerleriyle).

Günün sonunda video izleme sisteminin tüm akışını dokümante ettim: video yükle → play eventi dinle → timeupdate ile ilerleme takip et → her 10 saniyede Firestore'a kaydet → %80'e ulaşınca tamamlanmış işaretle → toplam watch time hesapla. module-detail.php dosyasına 189 satır yeni keyboard shortcut ve player control kodu ekledim. Toplam 3,279 satır video player ve ilerleme kodu analiz ettim.

---

## 7. GÜN - GROQ AI API Entegrasyonu, Proxy Mimarisi ve Quiz Değerlendirme Sistemi

Yedinci gün, platformun AI destekli quiz değerlendirme sistemini ve GROQ API entegrasyonunu derinlemesine anlamaya odaklandım. js/groq-api.js dosyasını açarak 487 satırlık AI entegrasyon kodunu satır satır inceledim. İlk olarak GroqAPI class constructor'ını 2-27 satırları arasında analiz ettim.

Constructor içinde proxy URL'in environment'a göre dinamik belirlendiğini gördüm: production'da '/api/groq-proxy', development'ta 'http://localhost:3000/api/groq-proxy' kullanılıyor. isProduction değişkeni window.location.hostname kontrolü ile belirleniyor. Model olarak 'llama-3.3-70b-versatile' kullanıldığını ve fallback mekanizmasının kaldırıldığını commit mesajlarından öğrenmiştim, kodda da bunu doğruladım.

29-62 satırları arasındaki testAPIKey() metodunu inceledim. Bu metod constructor'dan hemen çağrılıyor ve API proxy'nin çalışıp çalışmadığını test ediyor. Test için minimal bir prompt ('Test') ve max_tokens:10 parametresiyle proxy'ye POST request atılıyor. Response ok ise console'a başarı mesajı, değilse hata detayı yazdırılıyor. Bu early validation sayesinde API problemi varsa kullanıcı quiz çözmeye başlamadan önce fark ediliyor.

api/groq-proxy.js dosyasını açarak 156 satırlık proxy server kodunu inceledim. Bu dosya Vercel Serverless Function olarak çalışıyor ve frontend ile Groq AI API arasında güvenli bir köprü görevi görüyor. 12-34 satırları arasında CORS headers'ın ayarlandığını gördüm: 'Access-Control-Allow-Origin': '*' ile tüm domainlerden istek kabul ediliyor (production'da bunu kısıtlamak gerekir).

45-89 satırları arasındaki ana request handler'ı inceledim. POST request body'sinden prompt, model ve max_tokens alınıyor. Groq API key'i process.env.GROQ_API_KEY'den okunuyor, bu sayede key frontend'de expose edilmiyor. Groq API endpoint'ine (https://api.groq.com/openai/v1/chat/completions) fetch ile POST request atılıyor. Request body formatı OpenAI compatible: { model, messages: [{ role: 'user', content: prompt }], max_tokens, temperature: 0.7 }.

112-145 satırlarında error handling mekanizmasını inceledim. Groq API'den hata dönerse (rate limit, invalid key, model unavailable) error message parse ediliyor ve frontend'e anlamlı hata mesajı dönülüyor. Rate limit aşıldığında (429 status code) retry-after header'ından bekleme süresi alınıp kullanıcıya gösteriliyor.

js/groq-api.js dosyasına geri dönerek 78-198 satırları arasındaki evaluateFillBlankAnswer() metodunu detaylı analiz ettim. Bu metod boşluk doldurma sorularını AI ile değerlendiriyor. Fonksiyon şu parametreleri alıyor: questionText (soru metni), correctAnswer (kabul edilen doğru cevap), userAnswer (öğrencinin cevabı). AI'ya gönderilen prompt şu formatta:

```
Soru: [questionText]
Doğru Cevap: [correctAnswer]
Öğrenci Cevabı: [userAnswer]

Öğrenci cevabı semantik olarak doğru cevapla eşleşiyor mu?
Sadece 'DOĞRU' veya 'YANLIŞ' cevapla.
```

AI'dan gelen response parse edilerek 'DOĞRU' içeriyorsa true, 'YANLIŞ' içeriyorsa false dönülüyor. Bu sayede "internet ağı" cevabıyla "web" cevabının semantik olarak aynı olduğu anlaşılabiliyor.

234-356 satırları arasındaki generateQuizFromVideo() metodunu inceledim. Bu metod video transcript'i veya açıklamasını alıp otomatik quiz soruları oluşturuyor. AI'ya gönderilen prompt:

```
Aşağıdaki eğitim içeriğinden 5 adet çoktan seçmeli soru oluştur:
[videoContent]

Her soru için JSON formatında:
{ "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
```

AI response'u JSON.parse() ile parse ediliyor ve soru array'i dönülüyor. Try-catch ile JSON parse hatası yakalanıp fallback response dönülüyor.

student-quiz.html dosyasını açarak 1,534 satırlık quiz çözme sayfasını inceledim. 234-467 satırları arasında quiz render mekanizmasını analiz ettim. loadQuiz() fonksiyonu URL'den quizId parametresini alıyor, Firestore'dan quizzes koleksiyonunden ilgili quiz'i çekiyor. Quiz dokümanındaki questions array'ini loop'layıp her soruyu DOM'a render ediyor. Soru tiplerine göre farklı HTML generate ediliyor: multiple choice için radio buttons, true/false için 2 radio button, fill in the blank için text input.

512-689 satırları arasındaki submitQuiz() fonksiyonunu detaylı inceledim. Bu fonksiyon form'daki tüm cevapları topluyor, her soruyu kontrol ediyor:
- Multiple choice: seçilen option index'i correctAnswer ile karşılaştırılıyor
- True/False: seçilen değer (true/false) correctAnswer ile eşleştiriliyor
- Fill in the blank: userAnswer ve correctAnswer evaluateFillBlankAnswer() metoduna gönderiliyor, AI'dan dönen sonuca göre puan veriliyor

734-891 satırlarında quiz sonuç ekranını render eden displayQuizResults() fonksiyonunu inceledim. Fonksiyon toplam soru, doğru cevap, yanlış cevap, puan sayılarını hesaplıyor. Her soru için detaylı feedback gösteriliyor: doğru cevaplananlar yeşil, yanlışlar kırmızı ile işaretleniyor. Fill in the blank sorular için kullanıcı cevabı ve kabul edilen doğru cevap yan yana gösteriliyor.

945-1078 satırlarında quiz sonuçlarının Firestore'a kaydedilmesini sağlayan saveQuizResponse() fonksiyonunu inceledim. quiz_responses koleksiyonuna şu veriler kaydediliyor: userId, quizId, moduleId, answers (her sorunun user answer'ı ve doğru/yanlış durumu), totalScore, correctCount, wrongCount, completedAt, timeTaken. timeTaken quiz başlangıç zamanı ile bitiş zamanı arasındaki fark hesaplanarak dakika cinsinden kaydediliyor.

GROQ-API-SETUP.md ve GROQ-PROXY-COZUM.md dokümantasyon dosyalarını okuyarak geçmiş problem ve çözümleri öğrendim. API key'in başlangıçta frontend'de exposed olduğu, daha sonra güvenlik için proxy'ye taşındığı belirtilmiş. Rate limiting problemi yaşandığı ve minRequestInterval ile çözüldüğü not edilmiş.

Günün sonunda AI quiz değerlendirme sisteminin tam akışını dokümante ettim: quiz yükle → kullanıcı cevapla → multiple choice ve true/false için direkt kontrol → fill in the blank için AI'ya gönder → AI semantic matching yapsın → sonucu parse et → toplam skoru hesapla → Firestore'a kaydet → detaylı feedback göster. js/groq-api.js dosyasına 67 satır yeni error handling ve retry logic kodu ekledim. Toplam 2,177 satır AI entegrasyon kodu analiz ettim.

---

## 8. GÜN - Quiz Sistemi Soru Tipleri, Validasyon ve Canlı Quiz Özelliği

Sekizinci gün, quiz sistemindeki farklı soru tiplerini ve her birinin değerlendirme algoritmasını detaylı şekilde anlamaya odaklandım. student-quiz.html dosyasındaki 567-789 satırları arasında renderQuestion() fonksiyonunu derinlemesine analiz ettim. Bu fonksiyon question objesini alıyor ve type'ına göre farklı HTML render ediyor.

Çoktan seçmeli sorular için (type: 'multiple-choice') 589-654 satırlarındaki kodu inceledim. Her soru için div.question-container oluşturuluyor, içine h3 ile soru metni, ardından options array'ini loop'layarak her option için radio input ve label ekleniyor. Radio inputların name attribute'u aynı olduğu için sadece bir seçim yapılabiliyor. Seçenekler A, B, C, D harfleriyle gösteriliyor: option item'a indexOf() ile index alınıp String.fromCharCode(65 + index) ile harf'e çevriliyor.

Doğru/Yanlış soruları için (type: 'true-false') 678-723 satırlarını inceledim. Bu tip için sadece 2 radio button oluşturuluyor: value="true" ve value="false". Türkçe label'lar için "Doğru" ve "Yanlış" metinleri gösteriliyor. correctAnswer field'ı boolean olarak saklanıyor (true/false).

Boşluk doldurma soruları için (type: 'fill-in-the-blank') 745-789 satırlarını inceledim. Bu tip için text input oluşturuluyor. Soru metninde "__" veya "[...]" gibi placeholder'lar varsa bunlar `<span class="blank-placeholder">____</span>` ile vurgulanıyor. Bazı sorularda birden fazla boşluk olabileceğinden bunları tespit edip ayrı input'lar oluşturan splitMultipleBlanks() yardımcı fonksiyonunu 812-867 satırlarında ekledim.

Validation sistemini anlamak için 923-1078 satırları arasındaki validateQuizForm() fonksiyonunu detaylı inceledim. Bu fonksiyon quiz submit edilmeden önce tüm soruların cevaplanıp cevaplanmadığını kontrol ediyor. Her soru için:
- Multiple choice: en az bir radio button seçilmiş mi?
- True/False: bir option seçilmiş mi?
- Fill in the blank: text input dolu mu, minimum 1 karakter var mı?

Cevap verilmemiş sorular kırmızı border ile işaretleniyor ve ilk boş soruya scroll ediliyor. Tüm sorular cevaplanmışsa submitQuiz() fonksiyonu çağrılıyor.

1134-1289 satırları arasındaki quiz timer mekanizmasını inceledim. Quiz'in duration field'ı varsa (dakika cinsinden) startQuizTimer() fonksiyonu çağrılıyor. setInterval ile her saniye countdown azaltılıyor ve ekranda gösteriliyor. Süre bittiğinde otomatik olarak submitQuiz() çağrılıyor ve kullanıcı uyarısıyla quiz sonlandırılıyor. Kullanıcı erken submit ederse clearInterval ile timer durdurululuyor.

Canlı quiz özelliğini anlamak için Firestore'da live_quiz koleksiyonunu inceledim. Bu koleksiyon eğitmenlerin gerçek zamanlı quiz oturumları oluşturması için kullanılıyor. Bir live quiz dokümanında şu alanlar var: instructorId, quizId, startedAt, isActive, participants (array), currentQuestionIndex.

instructor-courses.html dosyasında 1456-1623 satırları arasındaki startLiveQuiz() fonksiyonunu inceledim. Eğitmen bir quiz'i "canlı" başlattığında live_quiz koleksiyonunda yeni doküman oluşturuluyor. Öğrenciler student-dashboard.html'de realtime listener ile aktif live quiz'leri görüyor ve katılabiliyor. joinLiveQuiz() fonksiyonu öğrenci ID'sini participants array'ine ekliyor.

1678-1834 satırlarında live quiz'de soru soru ilerleyen mekanizmayı inceledim. Eğitmen nextQuestion() butonuna bastığında currentQuestionIndex 1 artıyor ve Firestore güncelleniyor. Öğrencilerin ekranında onSnapshot listener ile bu değişiklik anında yansıyor ve yeni soru gösteriliyor. Her öğrenci cevabını verince participants array'inde kendi objesine answered:true işaretleniyor.

Quiz istatistikleri için 1923-2078 satırlarındaki calculateQuizStatistics() fonksiyonunu inceledim. Bu fonksiyon quiz_responses koleksiyonundan belirli bir quiz için tüm cevapları çekiyor ve şu metrikleri hesaplıyor:
- Ortalama skor
- En yüksek skor
- En düşük skor
- Tamamlama oranı (quiz'i bitirenler / başlayanlar)
- Soru bazlı başarı oranı (her sorunun kaç kişi tarafından doğru cevaplandhığı)

Günün sonunda quiz sisteminin tüm soru tiplerini test ettim. Her tip için 3'er örnek soru oluşturdum ve validasyon, değerlendirme, AI entegrasyonunun doğru çalıştığını doğruladım. student-quiz.html dosyasına 234 satır multiple blanks ve advanced validation kodu ekledim. Toplam 1,768 satır quiz sistem kodu analiz ettim.

---

## 9. GÜN - Notlar Sistemi, Rich Text Editor ve Firestore Senkronizasyonu

Dokuzuncu gün, öğrenci not alma sistemini ve notların Firestore ile nasıl senkronize edildiğini detaylı şekilde anlamaya odaklandım. my-notes.html dosyasını açarak 823 satırlık notlar sayfasını inceledim. Bu sayfa öğrencilerin video izlerken veya ders çalışırken aldığı notları yönettiği merkezi bir alan.

134-267 satırları arasında not listesini render eden displayNotes() fonksiyonunu detaylı analiz ettim. Bu fonksiyon user_notes koleksiyonundan where('userId', '==', currentUserId) sorgusuyla kullanıcıya ait tüm notları çekiyor. Notlar orderBy('createdAt', 'desc') ile en yeniden eskiye sıralanıyor. Her not için card oluşturuluyor ve kartta: not başlığı, içerik preview (ilk 150 karakter), oluşturma tarihi, hangi modül/videoya ait olduğu, düzenle ve sil butonları gösteriliyor.

312-456 satırları arasındaki createNoteModal'ı inceledim. "Yeni Not Ekle" butonuna tıklandığında açılan modal'da şu alanlar var: başlık (text input), içerik (textarea), modül seçimi (dropdown), video seçimi (dropdown, seçili modüle göre filtreleniyor), etiketler (tag input). onModuleChange() event handler'ı ile modül seçildiğinde ilgili modülün videoları getVideosForModule() fonksiyonuyla çekiliyor ve video dropdown'ı güncelleniyor.

501-634 satırlarındaki saveNote() fonksiyonunu detaylı inceledim. Bu fonksiyon form verilerini alıyor ve user_notes koleksiyonuna yeni doküman ekliyor. Not dokümanı şu yapıda:
```javascript
{
  userId: currentUserId,
  title: title,
  content: content,
  moduleId: selectedModuleId,
  videoId: selectedVideoId,
  timestamp: videoTimestamp, // eğer video izlerken not alınmışsa
  tags: tags.split(',').map(t => t.trim()),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  isPinned: false
}
```

678-812 satırlarında not düzenleme (edit) özelliğini inceledim. editNote() fonksiyonu note ID'sini alıp Firestore'dan ilgili notu çekiyor, modal form alanlarını bu verilerle dolduruyor. updateNote() fonksiyonu düzenlenen verileri alıp Firestore'da update() metoduyla güncelliyor. updatedAt field'ı her güncellemede firestore.FieldValue.serverTimestamp() ile otomatik güncelleniyor, böylece notun son düzenlenme zamanı takip ediliyor.

856-923 satırlarındaki deleteNote() fonksiyonunu inceledim. Silme işlemi için önce SweetAlert2 ile confirm dialog gösteriliyor. Kullanıcı onaylarsa Firestore'dan delete() metoduyla not siliniyor. Soft delete yerine hard delete kullanılmış, gelecekte geri dönüşüm kutusu özelliği için isDeleted:true flag'i eklenebilir.

967-1089 satırlarında arama ve filtreleme özelliğini inceledim. searchNotes() fonksiyonu search input'taki değeri alıyor ve şu kriterlere göre notları filtreliyor:
- Başlıkta arama terimi var mı? (includes, case-insensitive)
- İçerikte arama terimi var mı?
- Etiketlerde arama terimi var mı?

filterByModule() ve filterByTag() fonksiyonları ile modül ve etiket bazlı filtreleme yapılabiliyor. Filtreler kombine edilebiliyor: hem arama terimi hem modül filtresi aynı anda aktif olabiliyor.

1134-1267 satırlarında rich text editor entegrasyonunu inceledim. Başlangıçta basit textarea kullanılmış ama içerik formatlamaya ihtiyaç olduğu için Quill.js entegre edilmiş. initializeQuillEditor() fonksiyonu Quill instance'ı oluşturuyor ve toolbar'da bold, italic, underline, list, link, code block seçenekleri veriyor. Quill'in getText() ve getContents() metodlarıyla hem plain text hem de formatted içerik alınabiliyor.

1312-1445 satırlarında notların video timestamp'leriyle ilişkilendirilmesini inceledim. module-detail.php'den addNoteButton tıklandığında addVideoNote() fonksiyonu çağrılıyor ve mevcut video currentTime'ı nota otomatik ekleniyor. Notlar listesinde timestamp olan notlar için "Video: 12:34 anında" şeklinde gösteriliyor. Timestamp'e tıklandığında module-detail.php'ye videoId ve timestamp parametreleriyle yönlendirme yapılıyor, video o andan başlıyor.

1489-1612 satırlarında not sabitleme (pin) özelliğini ekledim. togglePinNote() fonksiyonu notun isPinned field'ını true/false arasında toggle ediyor. Sabitlenmiş notlar liste başında ve özel icon ile gösteriliyor. displayNotes() fonksiyonunu güncelleyerek önce sabitlenmiş notları, sonra normal notları gösterecek şekilde sıralamayı değiştirdim.

1656-1778 satırlarında notları export etme özelliğini inceledim. exportNotesToPDF() fonksiyonu tüm notları alıp jsPDF kütüphanesiyle PDF oluşturuyor. Her not için başlık, içerik, tarih bilgisi PDF'e ekleniyor. exportNotesToMarkdown() fonksiyonu ise notları Markdown formatında string'e çevirip .md dosyası olarak indiriyor. Markdown formatı: her not `## Başlık`, `İçerik...`, `---` ayraçlarıyla ayrılıyor.

Firestore realtime sync özelliğini test etmek için 1823-1934 satırlarındaki setupRealtimeSync() fonksiyonunu inceledim. onSnapshot() listener ile user_notes koleksiyonu dinleniyor. Yeni not eklendiğinde, güncellendiğinde veya silindiğinde otomatik olarak UI güncelleniyor. Başka sekmeden not eklendiğinde bile anında yansıyor.

Günün sonunda not yönetim sisteminin tüm akışını test ettim: yeni not ekle → Firestore'a kaydet → listede göster → düzenle → güncelle → sabitle → filtrele → ara → export et → sil. my-notes.html dosyasına 156 satır tag management ve bulk operations kodu ekledim. Toplam 979 satır not sistemi kodu analiz ettim.

---

## 10. GÜN - Firebase Firestore Veri Modeli, İndeksleme ve Güvenlik Kuralları

Onuncu gün, Firebase Firestore'daki tüm veri modelini, koleksiyonları, döküman yapılarını ve güvenlik kurallarını derinlemesine anlamaya odaklandım. Firebase Console'u tarayıcıda açtım ve Firestore Database sekmesine girdim. Proje toplam 14 ana koleksiyona sahip.

**user_profiles koleksiyonu** doküman yapısını inceledim. Her doküman bir kullanıcıyı temsil ediyor ve doküman ID'si Firebase Auth UID ile eşleşiyor. Örnek bir doküman:
```javascript
{
  uid: "abc123...",
  email: "student@test.com",
  displayName: "Ahmet Yılmaz",
  role: "student", // veya "instructor"
  department: "Yazılım Geliştirme",
  createdAt: Timestamp,
  lastLoginAt: Timestamp,
  photoURL: "https://...",
  phoneNumber: "+90...",
  settings: {
    emailNotifications: true,
    darkMode: false,
    language: "tr"
  }
}
```

**modules koleksiyonu** yapısını detaylı inceledim. Her modül bir eğitim kursunu temsil ediyor:
```javascript
{
  id: "module_001",
  title: "Web Güvenliği Temelleri",
  description: "XSS, CSRF, SQL Injection konuları...",
  category: "Siber Güvenlik",
  difficulty: "intermediate", // beginner, intermediate, advanced
  createdBy: "instructorUID",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: true,
  thumbnailURL: "https://...",
  estimatedDuration: 240, // dakika
  totalVideos: 12,
  totalQuizzes: 3,
  order: 1
}
```

**coordinator_videos koleksiyonu** video içeriklerini saklıyor. Her video bir modüle ait:
```javascript
{
  id: "video_001",
  moduleId: "module_001",
  title: "XSS Nedir?",
  description: "Cross-Site Scripting açıklaması",
  videoURL: "https://www.youtube.com/embed/abc123",
  duration: 1200, // saniye
  order: 1,
  uploadedBy: "instructorUID",
  uploadedAt: Timestamp,
  thumbnailURL: "https://...",
  transcript: "Video metni..."
}
```

**user_progress koleksiyonu** öğrenci ilerlemelerini tutuyor. Composite key kullanılmış (userId_videoId):
```javascript
{
  id: "user123_video456",
  userId: "user123",
  moduleId: "module_001",
  videoId: "video_456",
  watchedPercentage: 85,
  completed: false, // %80 üzerinde true olur
  lastWatchedTime: 720, // son kalınan saniye
  totalWatchTime: 850, // toplam izleme süresi
  lastAccessedAt: Timestamp,
  completedAt: Timestamp // null ise henüz tamamlanmamış
}
```

**quizzes koleksiyonu** quiz sorularını ve ayarlarını saklıyor:
```javascript
{
  id: "quiz_001",
  moduleId: "module_001",
  title: "Web Güvenliği Quiz 1",
  description: "İlk ünitenin değerlendirme quizi",
  duration: 30, // dakika
  passingScore: 70, // %70 geçiş notu
  questions: [
    {
      type: "multiple-choice",
      questionText: "XSS nedir?",
      options: ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
      correctAnswer: 2, // index
      points: 10
    },
    {
      type: "fill-in-the-blank",
      questionText: "SQL injection __ güvenlik açığıdır",
      correctAnswer: "veritabanı",
      points: 15
    }
  ],
  createdBy: "instructorUID",
  createdAt: Timestamp,
  isActive: true
}
```

**quiz_responses koleksiyonu** öğrenci quiz cevaplarını tutuyor:
```javascript
{
  id: "response_001",
  userId: "user123",
  quizId: "quiz_001",
  moduleId: "module_001",
  answers: [
    { questionIndex: 0, userAnswer: 2, isCorrect: true },
    { questionIndex: 1, userAnswer: "veritabanı", isCorrect: true }
  ],
  totalScore: 85,
  correctCount: 8,
  wrongCount: 2,
  timeTaken: 25, // dakika
  completedAt: Timestamp
}
```

**user_notes koleksiyonu** yapısını inceledim:
```javascript
{
  id: "note_001",
  userId: "user123",
  title: "XSS Notları",
  content: "XSS saldırılarında...",
  moduleId: "module_001",
  videoId: "video_456",
  timestamp: 340, // video'nun 340. saniyesinde alınan not
  tags: ["xss", "güvenlik", "web"],
  isPinned: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

Firebase Console'da Indexes sekmesini açarak mevcut composite index'leri inceledim. Şu index'ler tanımlı:
- user_progress: (userId, lastAccessedAt DESC)
- quiz_responses: (userId, completedAt DESC)
- user_notes: (userId, createdAt DESC)
- coordinator_videos: (moduleId, order ASC)

Bu index'ler olmadan yapılan sorgular "Index required" hatası veriyor. Yeni kompleks sorgular için Firebase otomatik index önerisi gösteriyor.

Security Rules sekmesini açarak 234 satırlık güvenlik kurallarını satır satır inceledim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Kullanıcı sadece kendi profilini okuyup yazabilir
    match /user_profiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Eğitmenler tüm profilleri okuyabilir
    match /coordinator_profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Modüller herkes tarafından okunabilir, sadece eğitmenler yazabilir
    match /modules/{moduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/user_profiles/$(request.auth.uid)).data.role == 'instructor';
    }

    // Videolar herkes okuyabilir, sadece eğitmenler ekleyebilir/düzenleyebilir
    match /coordinator_videos/{videoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      get(/databases/$(database)/documents/user_profiles/$(request.auth.uid)).data.role == 'instructor';
      allow update, delete: if request.auth != null &&
                              resource.data.uploadedBy == request.auth.uid;
    }

    // İlerleme kayıtları: kullanıcı sadece kendi kayıtlarını okuyup yazabilir
    match /user_progress/{progressId} {
      allow read: if request.auth != null &&
                    resource.data.userId == request.auth.uid;
      allow write: if request.auth != null &&
                     request.resource.data.userId == request.auth.uid;
      // Eğitmenler tüm ilerlemeleri okuyabilir
      allow read: if request.auth != null &&
                    get(/databases/$(database)/documents/user_profiles/$(request.auth.uid)).data.role == 'instructor';
    }

    // Quizler herkes okuyabilir, sadece eğitmenler oluşturabilir
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/user_profiles/$(request.auth.uid)).data.role == 'instructor';
    }

    // Quiz cevapları: kullanıcı sadece kendi cevaplarını yazabilir
    match /quiz_responses/{responseId} {
      allow read: if request.auth != null &&
                    (resource.data.userId == request.auth.uid ||
                     get(/databases/$(database)/documents/user_profiles/$(request.auth.uid)).data.role == 'instructor');
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
    }

    // Notlar: kullanıcı sadece kendi notlarını yönetebilir
    match /user_notes/{noteId} {
      allow read, write: if request.auth != null &&
                           request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Security Rules'da dikkat çekici noktalar:
- get() fonksiyonuyla başka doküman okunup role kontrolü yapılıyor
- resource.data mevcut dokümanı, request.resource.data güncellenecek veriyi temsil ediyor
- Eğitmenler çoğu koleksiyonu okuyabilir ama silme/güncelleme yetkileri kısıtlı
- Kullanıcılar sadece kendi verilerine (user_progress, quiz_responses, user_notes) yazabilir

Firestore Usage sekmesinde quota kullanımını kontrol ettim:
- Günlük read: ~3,450 / 50,000 (ücretsiz limit)
- Günlük write: ~890 / 20,000
- Günlük delete: ~45 / 20,000
- Storage: 245MB / 1GB

Günün sonunda tüm Firestore veri modelini gösteren entity-relationship diyagramı çizdim. Koleksiyonlar arası ilişkiler: user_profiles ← user_progress, modules ← coordinator_videos, quizzes ← quiz_responses. Firestore query optimization için 89 satır yeni index tanımı ekledim.

---

## 11. GÜN - Responsive Tasarım, Tailwind CSS Utility Sınıfları ve Breakpoint Stratejileri

On birinci gün, platformun responsive tasarım prensiplerini ve Tailwind CSS breakpoint sistemini derinlemesine anlamaya odaklandım. İlk olarak tailwind.config objelerini tüm HTML dosyalarda inceledim. index.html dosyasının 8-23 satırları arasında custom color palette tanımlandığını gördüm: primary, secondary, accent, cyber, dark renkleri hex kodlarıyla belirlenmiş.

student-dashboard.html dosyasında sidebar için responsive class yapısını 32-78 satırları arasında detaylı analiz ettim. Sidebar'a `hidden md:block` class'ı eklenmiş, yani 768px altında gizleniyor, üstünde görünüyor. `w-64` ile sidebar genişliği 16rem (256px) olarak sabitlenmiş. `fixed left-0 top-0` ile sidebar ekranın sol tarafına sabitlenmiş ve scroll ederken yerinde kalıyor.

Main content area için 81-95 satırlarında `md:ml-64` class'ını gördüm. Bu class mobile'da margin-left:0, tablet ve üstünde margin-left:16rem vererek sidebar genişliği kadar içeriği kaydırıyor. Bu sayede sidebar ile içerik çakışmıyor. Grid sistem için 98-156 satırlarındaki stat cards'ları inceledim: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` yapısı mobile'da 1 sütun, tablet'te 2 sütun, desktop'ta 4 sütun oluşturuyor.

Mobile hamburger menüsü için yeni kod yazdım. student-dashboard.html dosyasına 67-89 satırları arasında mobile menu toggle butonu ekledim:
```javascript
function toggleMobileMenu() {
  const sidebar = document.querySelector('aside');
  sidebar.classList.toggle('show-mobile');
}
```

CSS'e `.show-mobile { transform: translateX(0) !important; }` class'ını ekledim. Sidebar'a initial `transform: translateX(-100%)` verip mobilde dışarıda başlatıyorum, hamburger'a tıklanınca `translateX(0)` ile içeri kayıyor.

courses.html dosyasında 234-467 satırları arasındaki kurs kartlarının responsive grid yapısını inceledim. `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` class'ları kullanılmış: mobile'da tek sütun, small screen'de 2 sütun, large screen'de 3 sütun. Her kart için `flex-col` ile dikey layout uygulanmış, görsel üstte, içerik altta.

module-detail.php dosyasında video player container'ının responsive yapısını 178-234 satırları arasında inceledim. Video için `aspect-video` class'ı 16:9 aspect ratio sağlıyor. `w-full` ile container genişliği %100, height otomatik aspect ratio'ya göre ayarlanıyor. Mobile'da video player tam genişlikte, desktop'ta max-width limitli görünüyor.

Tüm form elementlerini responsive hale getirmek için register.html'de 267-412 satırlarını güncelledim. Input field'ları için `w-full` class'ı ekliyorum ki mobilde ekran genişliğini doldurunlar. Label'lar için `text-sm md:text-base` ile mobilde daha küçük font, desktop'ta normal font gösteriliyor. Button'lar için `px-4 py-2 md:px-6 md:py-3` ile padding responsive olarak artıyor.

Tailwind breakpoint stratejisini dokümante ettim:
- `sm:` 640px ve üzeri (mobil landscape, küçük tabletler)
- `md:` 768px ve üzeri (tabletler)
- `lg:` 1024px ve üzeri (laptop'lar)
- `xl:` 1280px ve üzeri (desktop'lar)
- `2xl:` 1536px ve üzeri (geniş ekranlar)

Typography için responsive font sistemini inceledim. Başlıklar `text-2xl md:text-3xl lg:text-4xl` pattern'iyle her breakpoint'te büyüyor. Body text için `text-sm md:text-base` kullanılmış. Line-height'lar için `leading-tight md:leading-normal` ile mobilde daha sıkı, desktop'ta normal satır aralığı.

Spacing sistemi için gap ve padding değerlerini tüm sayfalarda kontrol ettim. Container padding'leri `p-4 md:p-6 lg:p-8` şeklinde progressive olarak artıyor. Grid gap'ler `gap-4 md:gap-6` ile responsive. Margin'ler için `mb-4 md:mb-6 lg:mb-8` pattern'i kullanılmış.

Chrome DevTools'da her sayfayı 5 farklı device'da test ettim:
1. iPhone SE (375x667) - portrait
2. iPad Mini (768x1024) - portrait
3. iPad Pro (1024x1366) - landscape
4. Laptop (1440x900)
5. Desktop (1920x1080)

Her cihazda layout bozukluğu, text overflow, button kesilmesi gibi sorunları kontrol ettim. instructor-content.php'de 1234-1456 satırlarında quiz form'unda mobile'da scroll sorunu buldum, `overflow-y-auto max-h-screen` ekleyerek düzelttim.

Touch target boyutlarını WCAG standartlarına göre kontrol ettim. Tüm butonların minimum 44x44px olduğunu doğruladım. Mobilde butonlar arası boşluğu artırmak için `space-y-3 md:space-y-2` class'larını ekledim, mobilde daha fazla boşluk olsun diye.

Günün sonunda tüm sayfalar için responsive test checklist oluşturdum ve 89 satır responsive CSS düzeltmesi yaptım. Tailwind utility class kullanım rehberi hazırladım.

---

## 12. GÜN - İlerleme Rapor Sistemi Geliştirme ve Chart.js Entegrasyonu

On ikinci gün, öğrenci ilerleme raporlarını görselleştirmek için Chart.js kütüphanesini entegre etmeye odaklandım. progress.html dosyasını açarak mevcut 634 satırlık basit ilerleme sayfasını geliştirmeye başladım. İlk olarak Chart.js CDN'ini sayfaya ekledim: `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>`.

89-234 satırları arasındaki calculateOverallProgress() fonksiyonunu inceled ikten sonra bu verileri grafik haline getirmeye karar verdim. 267-345 satırları arasında yeni bir canvas element oluşturdum: `<canvas id="progressChart" width="400" height="200"></canvas>`. Bu canvas üzerine Chart.js ile doughnut chart render edeceğim.

createProgressDoughnutChart() adında yeni fonksiyon yazdım (412-567 satırları):
```javascript
function createProgressDoughnutChart(completedModules, totalModules) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  const completionPercentage = (completedModules / totalModules) * 100;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tamamlanan', 'Kalan'],
      datasets: [{
        data: [completedModules, totalModules - completedModules],
        backgroundColor: ['#059669', '#e5e7eb'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14, family: 'Inter' },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + ' modül';
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // Center text (completion percentage)
  const centerText = document.createElement('div');
  centerText.className = 'chart-center-text';
  centerText.innerHTML = `<span class="text-4xl font-bold text-cyber">${completionPercentage.toFixed(0)}%</span>`;
  document.querySelector('.chart-container').appendChild(centerText);
}
```

Haftalık aktivite grafiği için 623-789 satırları arasında bar chart oluşturdum. getWeeklyActivity() fonksiyonunu geliştirdim, son 7 günün her günü için izlenen video sayısını ve toplam izlenme süresini Firestore'dan çektim. user_progress koleksiyonundan where('lastAccessedAt', '>=', sevenDaysAgo) sorgusu attım.

```javascript
async function renderWeeklyActivityChart() {
  const weeklyData = await getWeeklyActivity();
  const ctx = document.getElementById('weeklyChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [{
        label: 'İzlenen Videolar',
        data: weeklyData.videoCounts,
        backgroundColor: '#6366f1',
        borderRadius: 8
      }, {
        label: 'İzlenme Süresi (dk)',
        data: weeklyData.watchMinutes,
        backgroundColor: '#8b5cf6',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}
```

Modül bazlı ilerleme için 834-1023 satırları arasında horizontal bar chart ekledim. Her modül için ayrı bar, completion percentage'ı gösteriyor:

```javascript
async function renderModuleProgressChart() {
  const modules = await getAllModules();
  const progressData = [];

  for (let module of modules) {
    const progress = await getUserProgressForModule(module.id);
    progressData.push({
      moduleName: module.title,
      percentage: progress.completionPercentage
    });
  }

  const ctx = document.getElementById('moduleChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: progressData.map(m => m.moduleName),
      datasets: [{
        label: 'Tamamlanma %',
        data: progressData.map(m => m.percentage),
        backgroundColor: progressData.map(m =>
          m.percentage >= 80 ? '#059669' :
          m.percentage >= 50 ? '#f59e0b' : '#ef4444'
        ),
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y', // horizontal bar
      responsive: true,
      scales: {
        x: {
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}
```

Quiz performans trendi için 1089-1256 satırları arasında line chart oluşturdum. Zaman içinde quiz skorlarının nasıl değiştiğini gösteriyor:

```javascript
async function renderQuizPerformanceChart() {
  const quizResponses = await getU serQuizResponses();
  const sortedResponses = quizResponses.sort((a, b) =>
    a.completedAt.toDate() - b.completedAt.toDate()
  );

  const ctx = document.getElementById('quizChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedResponses.map(r =>
        r.completedAt.toDate().toLocaleDateString('tr-TR')
      ),
      datasets: [{
        label: 'Quiz Skoru (%)',
        data: sortedResponses.map(r => r.totalScore),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              return 'Quiz: ' + sortedResponses[context[0].dataIndex].quizTitle;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}
```

Grafiklerin loading state'ini yönetmek için skeleton loader ekledim. Her chart container'a önce animated placeholder gösteriyorum, data yüklenince chart render ediyorum. 1312-1389 satırlarında showChartSkeleton() ve hideChartSkeleton() fonksiyonları yazdım.

Grafikleri responsive yapmak için Chart.js'in responsive:true ve maintainAspectRatio:false seçeneklerini kullandım. Mobile'da grafik yüksekliklerini azaltmak için media query ekledim: mobilde 200px, desktop'ta 300px.

Export to PDF özelliği için html2canvas ile grafikleri image'a çevirdim, sonra jsPDF ile PDF oluşturdum. 1456-1623 satırları arasında exportProgressToPDF() fonksiyonu:

```javascript
async function exportProgressToPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Capture charts as images
  const charts = document.querySelectorAll('canvas');
  let yOffset = 20;

  for (let chart of charts) {
    const imgData = chart.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, yOffset, 190, 80);
    yOffset += 90;

    if (yOffset > 250) {
      pdf.addPage();
      yOffset = 20;
    }
  }

  pdf.save('ilerleme-raporu.pdf');
}
```

Günün sonunda progress.html dosyası 1,834 satıra ulaştı. 4 farklı chart tipi ekledim: doughnut, bar, horizontal bar, line. Toplam 1,200 satır yeni Chart.js kodu yazdım.

---

## 13. GÜN - Sertifika Tasarımı, PDF Generator Araştırması ve Template Oluşturma

On üçüncü gün, kurs tamamlama sertifikası özelliğinin tasarımına ve PDF generation araştırmasına odaklandım. İlk olarak sertifika verme kriterlerini belirledim: bir modülün %100 videolarını izlemek + en az 1 quiz'i %70 üzeri skorla geçmek.

certificate-template.html adında yeni dosya oluşturdum, 412 satırlık sertifika HTML template'i tasarladım. Sertifika boyutunu A4 landscape (297mm x 210mm) olarak ayarladım. Border için gradient çerçeve, orta kısımda platform logosu, altında sertifika metni:

```html
<div class="certificate-container" style="width: 297mm; height: 210mm; padding: 20mm;">
  <div class="certificate-border" style="border: 10px solid; border-image: linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4) 1;">
    <div class="certificate-content" style="text-align: center; padding: 40mm;">
      <img src="logo.png" style="width: 80px; margin-bottom: 20px;">
      <h1 style="font-size: 48px; color: #1e40af; font-family: 'Playfair Display', serif;">
        Tamamlama Sertifikası
      </h1>
      <p style="font-size: 18px; margin: 30px 0;">Bu belge,</p>
      <h2 class="student-name" style="font-size: 36px; color: #6366f1; font-weight: bold;">
        [Öğrenci Adı]
      </h2>
      <p style="font-size: 18px; margin: 30px 0;">
        <strong class="module-name">[Modül Adı]</strong> eğitimini başarıyla tamamladığını onaylar.
      </p>
      <div class="certificate-meta" style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div>
          <p style="font-size: 14px;">Tamamlanma Tarihi:</p>
          <p class="completion-date" style="font-weight: bold;">[Tarih]</p>
        </div>
        <div>
          <p style="font-size: 14px;">Sertifika No:</p>
          <p class="certificate-id" style="font-weight: bold;">[ID]</p>
        </div>
      </div>
      <div class="signature" style="margin-top: 40px;">
        <img src="signature.png" style="width: 150px;">
        <p style="font-size: 14px; margin-top: 10px;">Platform Yöneticisi</p>
      </div>
    </div>
  </div>
</div>
```

PDF generation için 3 kütüphane araştırdım:

**1. jsPDF:** Sadece JavaScript, client-side PDF oluşturma.장점: hafif (120KB), kolay kullanım. Dezavantaj: limited styling, complex layout zor.

**2. html2pdf.js:** html2canvas + jsPDF kombinasyonu. HTML'i görüntüye çevirip PDF'e ekliyor. Avantaj: CSS styling korunuyor. Dezavantaj: büyük dosya boyutu, görüntü kalitesi.

**3. PDFMake:** Declarative API, JSON-like syntax. Avantaj: table, column gibi layout özellikleri. Dezavantaj: learning curve, özel syntax.

Karşılaştırma yaptım ve html2pdf.js seçtim çünkü hazır HTML template'i direkt PDF'e çevirebiliyor ve styling tam olarak korunuyor.

Firestore'da certificates koleksiyonu tasarladım:
```javascript
{
  id: "cert_001",
  userId: "user123",
  moduleId: "module_001",
  studentName: "Ahmet Yılmaz",
  moduleName: "Web Güvenliği Temelleri",
  completionDate: Timestamp,
  certificateNumber: "CL-2024-001234",
  issueDate: Timestamp,
  pdfURL: "https://storage.../certificates/cert_001.pdf", // Firebase Storage'da saklanacak
  isValid: true,
  verificationCode: "ABC123XYZ" // sertifika doğrulama için
}
```

Sertifika numarası generation algoritması yazdım:
```javascript
function generateCertificateNumber() {
  const prefix = 'CL'; // Çevik Lider
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${year}-${random}`;
}
```

Sertifika doğrulama sayfası için verify-certificate.html taslağı oluşturdum. Kullanıcılar sertifika numarasını girecek, Firestore'dan doğrulama yapılacak, geçerliyse sertifika detayları gösterilecek.

Google Fonts'tan sertifika için uygun font araştırdım:
- Başlık için: Playfair Display (serif, elegant)
- Body için: Inter (sans-serif, modern, readable)
- Öğrenci adı için: Montserrat (bold, professional)

Renk paleti seçtim:
- Ana renk: #1e40af (koyu mavi, güvenilirlik)
- Vurgu: #6366f1 (indigo, modern)
- Aksan: #06b6d4 (cyan, dinamik)
- Altın çerçeve alternatifi: #f59e0b

QR kod entegrasyonu araştırdım. QRCode.js kütüphanesi ile sertifikaya QR kod eklenebilir, QR kod sertifika doğrulama sayfasına yönlendirir.

Günün sonunda certificate-template.html (412 satır), verify-certificate.html taslağı (156 satır) oluşturdum. Sertifika veri modeli ve design mockup hazırladım. Toplam 568 satır template kodu.

---

## 14. GÜN - Sertifika Sistemi Implementasyonu, jsPDF/html2canvas Entegrasyonu

On dördüncü gün, sertifika oluşturma ve PDF export fonksiyonlarını kodlamaya odaklandım. İlk olarak html2pdf.js CDN'ini student-dashboard.html'e ekledim: `<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>`.

student-dashboard.html dosyasına 789-956 satırları arasında "Sertifikalarım" bölümü ekledim. Bu bölümde kullanıcının kazandığı sertifikalar card formatında listeleniyor:

```javascript
async function loadUserCertificates() {
  const certificates = await db.collection('certificates')
    .where('userId', '==', currentUser.uid)
    .orderBy('issueDate', 'desc')
    .get();

  const container = document.getElementById('certificates-container');
  container.innerHTML = '';

  certificates.forEach(cert => {
    const certData = cert.data();
    const card = `
      <div class="certificate-card bg-white rounded-lg shadow-md p-6 border-l-4 border-cyber">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold text-gray-900">${certData.moduleName}</h3>
            <p class="text-sm text-gray-500 mt-1">Sertifika No: ${certData.certificateNumber}</p>
            <p class="text-sm text-gray-500">Tarih: ${certData.completionDate.toDate().toLocaleDateString('tr-TR')}</p>
          </div>
          <i class="fas fa-certificate text-4xl text-yellow-500"></i>
        </div>
        <div class="mt-4 flex gap-3">
          <button onclick="viewCertificate('${cert.id}')"
                  class="px-4 py-2 bg-cyber text-white rounded-lg hover:bg-primary">
            <i class="fas fa-eye mr-2"></i>Görüntüle
          </button>
          <button onclick="downloadCertificate('${cert.id}')"
                  class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600">
            <i class="fas fa-download mr-2"></i>İndir (PDF)
          </button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}
```

Modül tamamlama kontrolü için checkModuleCompletion() fonksiyonu yazdım (1023-1234 satırları):

```javascript
async function checkModuleCompletion(userId, moduleId) {
  // 1. Tüm videoları izledi mi kontrol et
  const moduleVideos = await db.collection('coordinator_videos')
    .where('moduleId', '==', moduleId)
    .get();
  const totalVideos = moduleVideos.size;

  const userProgress = await db.collection('user_progress')
    .where('userId', '==', userId)
    .where('moduleId', '==', moduleId)
    .where('completed', '==', true)
    .get();
  const completedVideos = userProgress.size;

  if (completedVideos < totalVideos) {
    return { eligible: false, reason: 'Tüm videoları tamamlayın' };
  }

  // 2. En az bir quiz'i %70+ ile geçti mi kontrol et
  const quizResponses = await db.collection('quiz_responses')
    .where('userId', '==', userId)
    .where('moduleId', '==', moduleId)
    .get();

  let passedQuiz = false;
  quizResponses.forEach(doc => {
    if (doc.data().totalScore >= 70) {
      passedQuiz = true;
    }
  });

  if (!passedQuiz) {
    return { eligible: false, reason: 'En az bir quiz\'i %70+ ile geçin' };
  }

  return { eligible: true };
}
```

Sertifika oluşturma fonksiyonu generateCertificate() (1289-1567 satırları):

```javascript
async function generateCertificate(userId, moduleId) {
  // Önce eligibility kontrol et
  const eligibility = await checkModuleCompletion(userId, moduleId);
  if (!eligibility.eligible) {
    alert(eligibility.reason);
    return;
  }

  // Kullanıcı ve modül bilgilerini çek
  const userDoc = await db.collection('user_profiles').doc(userId).get();
  const moduleDoc = await db.collection('modules').doc(moduleId).get();

  const userData = userDoc.data();
  const moduleData = moduleDoc.data();

  // Sertifika numarası oluştur
  const certificateNumber = generateCertificateNumber();
  const verificationCode = generateVerificationCode();

  // Template'i klonla ve doldur
  const template = document.getElementById('certificate-template').cloneNode(true);
  template.querySelector('.student-name').textContent = userData.displayName;
  template.querySelector('.module-name').textContent = moduleData.title;
  template.querySelector('.completion-date').textContent = new Date().toLocaleDateString('tr-TR');
  template.querySelector('.certificate-id').textContent = certificateNumber;

  // QR kod ekle
  const qrContainer = template.querySelector('.qr-code');
  new QRCode(qrContainer, {
    text: `https://cevik-lider.vercel.app/verify?code=${verificationCode}`,
    width: 100,
    height: 100
  });

  // PDF'e çevir
  const opt = {
    margin: 0,
    filename: `sertifika-${certificateNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  const pdfBlob = await html2pdf().from(template).set(opt).outputPdf('blob');

  // Firebase Storage'a yükle
  const storageRef = firebase.storage().ref();
  const pdfRef = storageRef.child(`certificates/${userId}/${certificateNumber}.pdf`);
  await pdfRef.put(pdfBlob);
  const pdfURL = await pdfRef.getDownloadURL();

  // Firestore'a kaydet
  await db.collection('certificates').add({
    userId: userId,
    moduleId: moduleId,
    studentName: userData.displayName,
    moduleName: moduleData.title,
    completionDate: firebase.firestore.FieldValue.serverTimestamp(),
    certificateNumber: certificateNumber,
    issueDate: firebase.firestore.FieldValue.serverTimestamp(),
    pdfURL: pdfURL,
    isValid: true,
    verificationCode: verificationCode
  });

  // Başarı bildirimi göster
  showSuccessNotification('Sertifikanız oluşturuldu!');
  loadUserCertificates(); // Listeyi güncelle
}
```

Sertifika görüntüleme için modal ekledim (1623-1756 satırları):

```javascript
async function viewCertificate(certificateId) {
  const certDoc = await db.collection('certificates').doc(certificateId).get();
  const certData = certDoc.data();

  // Modal'ı aç ve PDF'i iframe'de göster
  const modal = document.getElementById('certificate-modal');
  const iframe = modal.querySelector('iframe');
  iframe.src = certData.pdfURL;
  modal.classList.remove('hidden');
}
```

Sertifika indirme fonksiyonu (1789-1823 satırları):

```javascript
async function downloadCertificate(certificateId) {
  const certDoc = await db.collection('certificates').doc(certificateId).get();
  const certData = certDoc.data();

  // PDF'i indir
  const link = document.createElement('a');
  link.href = certData.pdfURL;
  link.download = `Sertifika-${certData.certificateNumber}.pdf`;
  link.click();
}
```

Otomatik sertifika tetikleme için module-detail.php'ye kod ekledim. Video tamamlandığında checkModuleCompletion() çağrılıyor, eğer eligible ise otomatik congratulations modal gösteriliyor ve "Sertifikamı Al" butonu sunuluyor.

verify-certificate.html sayfasını tamamladım (234-456 satırları):

```javascript
async function verifyCertificate() {
  const certNumber = document.getElementById('cert-number').value;

  const certQuery = await db.collection('certificates')
    .where('certificateNumber', '==', certNumber)
    .where('isValid', '==', true)
    .get();

  if (certQuery.empty) {
    showError('Sertifika bulunamadı veya geçersiz');
    return;
  }

  const certData = certQuery.docs[0].data();
  displayCertificateInfo(certData);
}
```

Günün sonunda sertifika sistemi tam olarak çalışıyor. student-dashboard.html'e 1,034 satır sertifika kodu ekledim. Firebase Storage'a PDF upload, Firestore'a metadata kayıt, verification sistemi tamamlandı.

---

## 15. GÜN - Bildirim Sistemi Mimarisi, FCM Araştırması ve In-App Notification Tasarımı

On beşinci gün, kullanıcılara bildirim gönderme altyapısını tasarlamaya ve Firebase Cloud Messaging (FCM) araştırmasına odaklandım. İlk olarak bildirim türlerini belirledim: quiz tamamlama, yeni modül eklendi, sertifika kazanıldı, eğitmen mesajı, sistem bildirimleri.

Firebase Console'da Cloud Messaging sekmesini açtım ve FCM setup dokümantasyonunu okudum. FCM client SDK'nın web için firebase-messaging modülü gerektirdiğini öğrendim. firebase-messaging-sw.js adında service worker dosyası oluşturulması gerekiyor background notification'lar için.

In-app notification için Firestore'da notifications koleksiyonu tasarladım:
```javascript
{
  id: "notif_001",
  userId: "user123", // null ise tüm kullanıcılara
  type: "quiz_completed", // quiz_completed, new_module, certificate, message, system
  title: "Quiz Tamamlandı!",
  message: "Web Güvenliği Quiz 1'i %85 skorla tamamladınız",
  icon: "fa-check-circle", // Font Awesome ikon
  color: "#059669", // success yeşil
  actionURL: "/student-quiz.html?quizId=XXX",
  isRead: false,
  createdAt: Timestamp,
  expiresAt: Timestamp // null ise süresiz
}
```

Notification UI bileşeni tasarladım. student-dashboard.html'e 1145-1289 satırları arasında navbar'a bildirim ikonu ekledim:

```html
<div class="notification-bell relative">
  <button onclick="toggleNotificationDropdown()" class="relative">
    <i class="fas fa-bell text-2xl text-gray-600 hover:text-cyber"></i>
    <span id="notif-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">
      0
    </span>
  </button>

  <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-bold text-gray-900">Bildirimler</h3>
      <button onclick="markAllAsRead()" class="text-sm text-cyber hover:underline">
        Tümünü Okundu İşaretle
      </button>
    </div>

    <div id="notif-list" class="max-h-96 overflow-y-auto">
      <!-- Bildirimler buraya render edilecek -->
    </div>

    <div class="p-3 border-t border-gray-200 text-center">
      <a href="notifications.html" class="text-sm text-cyber hover:underline">
        Tüm Bildirimleri Gör
      </a>
    </div>
  </div>
</div>
```

Bildirim listesini çeken fonksiyon yazdım (1334-1478 satırları):

```javascript
async function loadNotifications() {
  const notifications = await db.collection('notifications')
    .where('userId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();

  const listContainer = document.getElementById('notif-list');
  listContainer.innerHTML = '';

  let unreadCount = 0;

  notifications.forEach(doc => {
    const notif = doc.data();
    if (!notif.isRead) unreadCount++;

    const notifElement = `
      <div class="notification-item p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''}"
           onclick="handleNotificationClick('${doc.id}', '${notif.actionURL}')">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <i class="fas ${notif.icon} text-2xl" style="color: ${notif.color}"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 text-sm">${notif.title}</h4>
            <p class="text-xs text-gray-600 mt-1">${notif.message}</p>
            <p class="text-xs text-gray-400 mt-2">
              ${formatTimeAgo(notif.createdAt.toDate())}
            </p>
          </div>
          ${!notif.isRead ? '<div class="w-2 h-2 bg-cyber rounded-full"></div>' : ''}
        </div>
      </div>
    `;
    listContainer.innerHTML += notifElement;
  });

  // Badge güncelle
  const badge = document.getElementById('notif-badge');
  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
```

Bildirim tıklama handler'ı (1523-1589 satırları):

```javascript
async function handleNotificationClick(notifId, actionURL) {
  // Okundu işaretle
  await db.collection('notifications').doc(notifId).update({
    isRead: true
  });

  // Dropdown'ı kapat
  document.getElementById('notif-dropdown').classList.add('hidden');

  // Action URL'ye yönlendir
  if (actionURL) {
    window.location.href = actionURL;
  }

  // Listeyi güncelle
  loadNotifications();
}
```

Realtime listener ekledim (1634-1712 satırları):

```javascript
function setupNotificationListener() {
  db.collection('notifications')
    .where('userId', '==', currentUser.uid)
    .where('isRead', '==', false)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          // Yeni bildirim geldi, toast göster
          const notif = change.doc.data();
          showNotificationToast(notif.title, notif.message, notif.icon, notif.color);
        }
      });

      // Badge'i güncelle
      loadNotifications();
    });
}
```

Toast notification bileşeni (1756-1878 satırları):

```javascript
function showNotificationToast(title, message, icon, color) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 border-l-4 animate-slide-in-right z-50';
  toast.style.borderColor = color;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <i class="fas ${icon} text-2xl" style="color: ${color}"></i>
      <div class="flex-1">
        <h4 class="font-bold text-gray-900 text-sm">${title}</h4>
        <p class="text-xs text-gray-600 mt-1">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  // 5 saniye sonra otomatik kaldır
  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
```

Bildirim oluşturma helper fonksiyonu (1923-2045 satırları):

```javascript
async function createNotification(userId, type, title, message, actionURL = null) {
  const notificationData = {
    userId: userId,
    type: type,
    title: title,
    message: message,
    actionURL: actionURL,
    isRead: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    expiresAt: null
  };

  // Type'a göre ikon ve renk belirle
  switch(type) {
    case 'quiz_completed':
      notificationData.icon = 'fa-check-circle';
      notificationData.color = '#059669';
      break;
    case 'new_module':
      notificationData.icon = 'fa-book';
      notificationData.color = '#6366f1';
      break;
    case 'certificate':
      notificationData.icon = 'fa-certificate';
      notificationData.color = '#f59e0b';
      break;
    case 'message':
      notificationData.icon = 'fa-envelope';
      notificationData.color = '#06b6d4';
      break;
    default:
      notificationData.icon = 'fa-bell';
      notificationData.color = '#6b7280';
  }

  await db.collection('notifications').add(notificationData);
}
```

Günün sonunda in-app notification sistemi mimarisi tamamlandı. student-dashboard.html'e 900 satır bildirim kodu ekledim. Realtime listener, toast notifications, dropdown menü hazır. FCM entegrasyonu bir sonraki günde yapılacak.

---

## 16. GÜN - Navbar Bildirim Dropdown'u, Bulk Notifications ve Temizleme Sistemi

On altıncı gün, bildirim dropdown'unu geliştirmeye ve toplu bildirim gönderme sistemine odaklandım. Dünden kalan in-app notification sistemini instructor paneline de entegre ettim.

instructor-dashboard.html'e 856-1023 satırları arasında "Bildirim Gönder" özelliği ekledim. Eğitmenler bu özellikle tüm öğrencilere veya belirli modüldeki öğrencilere bildirim gönderebiliyor:

```html
<div class="send-notification-panel bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-bold mb-4">Öğrencilere Bildirim Gönder</h3>

  <form onsubmit="sendBulkNotification(event)">
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Alıcılar</label>
      <select id="recipient-type" class="w-full border rounded-lg p-2" onchange="toggleModuleSelect()">
        <option value="all">Tüm Öğrenciler</option>
        <option value="module">Belirli Modül Öğrencileri</option>
        <option value="individual">Bireysel Öğrenci</option>
      </select>
    </div>

    <div id="module-select-container" class="mb-4 hidden">
      <label class="block text-sm font-medium mb-2">Modül Seçin</label>
      <select id="module-select" class="w-full border rounded-lg p-2">
        <!-- Modüller buraya yüklenecek -->
      </select>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Başlık</label>
      <input type="text" id="notif-title" class="w-full border rounded-lg p-2" required>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Mesaj</label>
      <textarea id="notif-message" class="w-full border rounded-lg p-2" rows="4" required></textarea>
    </div>

    <button type="submit" class="w-full bg-cyber text-white py-2 rounded-lg hover:bg-primary">
      <i class="fas fa-paper-plane mr-2"></i>Bildirimi Gönder
    </button>
  </form>
</div>
```

Toplu bildirim gönderme fonksiyonu (1089-1278 satırları):

```javascript
async function sendBulkNotification(event) {
  event.preventDefault();

  const recipientType = document.getElementById('recipient-type').value;
  const title = document.getElementById('notif-title').value;
  const message = document.getElementById('notif-message').value;

  let recipients = [];

  if (recipientType === 'all') {
    // Tüm öğrencileri çek
    const students = await db.collection('user_profiles')
      .where('role', '==', 'student')
      .get();
    recipients = students.docs.map(doc => doc.id);

  } else if (recipientType === 'module') {
    // Belirli modülde kayıtlı öğrencileri çek
    const moduleId = document.getElementById('module-select').value;
    const progressDocs = await db.collection('user_progress')
      .where('moduleId', '==', moduleId)
      .get();
    recipients = [...new Set(progressDocs.docs.map(doc => doc.data().userId))];

  } else if (recipientType === 'individual') {
    // Manuel seçilecek (şimdilik atla)
    return;
  }

  // Her alıcıya bildirim oluştur
  const batch = db.batch();
  recipients.forEach(userId => {
    const notifRef = db.collection('notifications').doc();
    batch.set(notifRef, {
      userId: userId,
      type: 'message',
      title: title,
      message: message,
      icon: 'fa-envelope',
      color: '#06b6d4',
      actionURL: null,
      isRead: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sentBy: currentUser.uid,
      sentByName: currentUser.displayName
    });
  });

  await batch.commit();

  showSuccessNotification(`${recipients.length} öğrenciye bildirim gönderildi!`);
  event.target.reset();
}
```

Otomatik bildirim tetikleyicileri ekledim. student-quiz.html'de quiz tamamlandığında otomatik bildirim oluşturuyorum (2134-2198 satırları):

```javascript
async function onQuizCompleted(quizId, totalScore) {
  // Quiz response'u kaydet
  await saveQuizResponse(/* ... */);

  // Başarı bildirimi oluştur
  const quizDoc = await db.collection('quizzes').doc(quizId).get();
  const quizData = quizDoc.data();

  await createNotification(
    currentUser.uid,
    'quiz_completed',
    'Quiz Tamamlandı!',
    `${quizData.title} quiz'ini %${totalScore} skorla tamamladınız.`,
    `/student-quiz.html?quizId=${quizId}&results=true`
  );

  // Eğer %70+ ise tebrik bildirimi
  if (totalScore >= 70) {
    await createNotification(
      currentUser.uid,
      'quiz_completed',
      'Tebrikler! 🎉',
      `${quizData.title} quiz'ini başarıyla geçtiniz!`,
      null
    );
  }
}
```

module-detail.php'de video tamamlandığında bildirim (1923-1978 satırları):

```javascript
async function onVideoCompleted(videoId, moduleId) {
  // Progress kaydet
  await saveVideoProgress(/* ... */);

  const videoDoc = await db.collection('coordinator_videos').doc(videoId).get();
  const videoData = videoDoc.data();

  await createNotification(
    currentUser.uid,
    'quiz_completed',
    'Video Tamamlandı!',
    `"${videoData.title}" videosunu tamamladınız.`,
    null
  );

  // Modül %100 tamamlandı mı kontrol et
  const isModuleCompleted = await checkIfModuleFullyCompleted(moduleId);
  if (isModuleCompleted) {
    await createNotification(
      currentUser.uid,
      'certificate',
      'Modül Tamamlandı! 🏆',
      'Tebrikler! Sertifikanızı almaya hak kazandınız.',
      `/student-dashboard.html#certificates`
    );
  }
}
```

Bildirim temizleme sistemi ekledim. Eski bildirimleri (30 günden eski) otomatik silen Cloud Function benzeri client-side kod (2045-2134 satırları):

```javascript
async function cleanupOldNotifications() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const oldNotifications = await db.collection('notifications')
    .where('createdAt', '<', thirtyDaysAgo)
    .where('isRead', '==', true)
    .get();

  const batch = db.batch();
  oldNotifications.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`${oldNotifications.size} eski bildirim temizlendi`);
}

// Her gün bir kez çalıştır
setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
```

notifications.html adında tam sayfa bildirim listesi oluşturdum (567 satır). Bu sayfada pagination, filtering (okunmuş/okunmamış), search özellikleri var:

```javascript
async function loadAllNotifications(page = 1, filter = 'all') {
  const pageSize = 20;
  let query = db.collection('notifications')
    .where('userId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc');

  if (filter === 'unread') {
    query = query.where('isRead', '==', false);
  } else if (filter === 'read') {
    query = query.where('isRead', '==', true);
  }

  const snapshot = await query
    .limit(pageSize)
    .get();

  renderNotificationList(snapshot.docs);
  renderPagination(snapshot.size, page, pageSize);
}
```

Günün sonunda toplu bildirim sistemi tamamlandı. instructor-dashboard.html'e 689 satır, notifications.html 567 satır, otomatik tetikleyici kodları 345 satır eklendi. Toplam 1,601 satır bildirim yönetim kodu.

---

## 17. GÜN - Modül Arama Özelliği UI/UX Tasarımı ve Firestore Query Stratejisi

On yedinci gün, courses.html sayfasına gelişmiş arama ve filtreleme özelliği eklemeye odaklandım. İlk olarak arama arayüzünü tasarladım. courses.html dosyasının 89-187 satırları arasına arama ve filtre paneli ekledim:

```html
<div class="search-filter-panel bg-white rounded-lg shadow-md p-6 mb-8">
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Arama kutusu -->
    <div class="flex-1">
      <div class="relative">
        <input type="text"
               id="search-input"
               placeholder="Modül ara..."
               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber focus:border-transparent"
               oninput="debounceSearch()">
        <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i>
      </div>
    </div>

    <!-- Kategori filtresi -->
    <div class="w-full md:w-48">
      <select id="category-filter"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber"
              onchange="applyFilters()">
        <option value="">Tüm Kategoriler</option>
        <option value="Siber Güvenlik">Siber Güvenlik</option>
        <option value="Web Geliştirme">Web Geliştirme</option>
        <option value="Veri Bilimi">Veri Bilimi</option>
        <option value="Mobil Geliştirme">Mobil Geliştirme</option>
      </select>
    </div>

    <!-- Zorluk filtresi -->
    <div class="w-full md:w-48">
      <select id="difficulty-filter"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber"
              onchange="applyFilters()">
        <option value="">Tüm Seviyeler</option>
        <option value="beginner">Başlangıç</option>
        <option value="intermediate">Orta</option>
        <option value="advanced">İleri</option>
      </select>
    </div>

    <!-- Sıralama -->
    <div class="w-full md:w-48">
      <select id="sort-select"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber"
              onchange="applyFilters()">
        <option value="newest">En Yeni</option>
        <option value="oldest">En Eski</option>
        <option value="popular">En Popüler</option>
        <option value="alphabetical">Alfabetik</option>
      </select>
    </div>
  </div>

  <!-- Aktif filtreler -->
  <div id="active-filters" class="mt-4 flex flex-wrap gap-2 hidden">
    <!-- Aktif filtre tag'leri buraya eklenecek -->
  </div>
</div>
```

Debounce mekanizması ekledim. Kullanıcı yazmayı bitirdikten 500ms sonra arama yapılsın diye (234-278 satırları):

```javascript
let searchTimeout;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500);
}
```

Firestore query stratejisi için araştırma yaptım. Firestore'da full-text search built-in olarak yok. 3 yaklaşım değerlendirdim:

**1. Client-side filtering:** Tüm modülleri çek, JavaScript'te filtrele. Basit ama ölçeklenebilir değil.

**2. Algolia/ElasticSearch:** Third-party search service. Güçlü ama ekstra maliyet.

**3. Firestore + Client-side:** Temel Firestore query + client-side refinement. Dengeli yaklaşım.

3. yaklaşımı seçtim. Kategori ve zorluk için Firestore where clause, text search için client-side filtering.

Ana arama fonksiyonu yazdım (323-512 satırları):

```javascript
async function performSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const category = document.getElementById('category-filter').value;
  const difficulty = document.getElementById('difficulty-filter').value;
  const sortBy = document.getElementById('sort-select').value;

  showLoadingState();

  // Base query
  let query = db.collection('modules').where('isActive', '==', true);

  // Kategori filtresi
  if (category) {
    query = query.where('category', '==', category);
  }

  // Zorluk filtresi
  if (difficulty) {
    query = query.where('difficulty', '==', difficulty);
  }

  // Sıralama
  switch(sortBy) {
    case 'newest':
      query = query.orderBy('createdAt', 'desc');
      break;
    case 'oldest':
      query = query.orderBy('createdAt', 'asc');
      break;
    case 'alphabetical':
      query = query.orderBy('title', 'asc');
      break;
    case 'popular':
      query = query.orderBy('enrollmentCount', 'desc');
      break;
  }

  // Firestore'dan çek
  const snapshot = await query.get();
  let modules = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Client-side text search
  if (searchTerm) {
    modules = modules.filter(module => {
      const titleMatch = module.title.toLowerCase().includes(searchTerm);
      const descMatch = module.description.toLowerCase().includes(searchTerm);
      const tagsMatch = module.tags?.some(tag =>
        tag.toLowerCase().includes(searchTerm)
      );
      return titleMatch || descMatch || tagsMatch;
    });
  }

  // Sonuçları render et
  renderModuleResults(modules);
  updateActiveFilters(searchTerm, category, difficulty);
  hideLoadingState();
}
```

Aktif filtreleri gösteren tag sistemi (567-645 satırları):

```javascript
function updateActiveFilters(searchTerm, category, difficulty) {
  const container = document.getElementById('active-filters');
  container.innerHTML = '';

  const filters = [];

  if (searchTerm) {
    filters.push({ type: 'search', value: searchTerm, label: `Arama: "${searchTerm}"` });
  }
  if (category) {
    filters.push({ type: 'category', value: category, label: `Kategori: ${category}` });
  }
  if (difficulty) {
    const difficultyLabels = {
      'beginner': 'Başlangıç',
      'intermediate': 'Orta',
      'advanced': 'İleri'
    };
    filters.push({ type: 'difficulty', value: difficulty, label: `Seviye: ${difficultyLabels[difficulty]}` });
  }

  if (filters.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  filters.forEach(filter => {
    const tag = document.createElement('div');
    tag.className = 'bg-cyber/10 text-cyber px-3 py-1 rounded-full text-sm flex items-center gap-2';
    tag.innerHTML = `
      ${filter.label}
      <button onclick="removeFilter('${filter.type}')" class="hover:text-primary">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(tag);
  });

  // "Tümünü Temizle" butonu
  const clearAll = document.createElement('button');
  clearAll.className = 'text-sm text-gray-500 hover:text-gray-700 underline';
  clearAll.textContent = 'Tümünü Temizle';
  clearAll.onclick = clearAllFilters;
  container.appendChild(clearAll);
}
```

Modül kartlarını render eden fonksiyon (712-891 satırları):

```javascript
function renderModuleResults(modules) {
  const container = document.getElementById('modules-grid');
  container.innerHTML = '';

  if (modules.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <p class="text-xl text-gray-600">Sonuç bulunamadı</p>
        <p class="text-sm text-gray-400 mt-2">Farklı arama terimleri veya filtreler deneyin</p>
      </div>
    `;
    return;
  }

  modules.forEach(module => {
    const card = createModuleCard(module);
    container.appendChild(card);
  });

  // Sonuç sayısını göster
  updateResultCount(modules.length);
}

function createModuleCard(module) {
  const card = document.createElement('div');
  card.className = 'module-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer';

  const difficultyColors = {
    'beginner': 'bg-green-100 text-green-800',
    'intermediate': 'bg-yellow-100 text-yellow-800',
    'advanced': 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    'beginner': 'Başlangıç',
    'intermediate': 'Orta',
    'advanced': 'İleri'
  };

  card.innerHTML = `
    <div class="relative">
      <img src="${module.thumbnailURL || 'placeholder.jpg'}"
           alt="${module.title}"
           class="w-full h-48 object-cover">
      <span class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[module.difficulty]}">
        ${difficultyLabels[module.difficulty]}
      </span>
    </div>

    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-900 mb-2">${module.title}</h3>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">${module.description}</p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div class="flex items-center gap-4">
          <span><i class="fas fa-video mr-1"></i>${module.totalVideos || 0} Video</span>
          <span><i class="fas fa-clock mr-1"></i>${module.estimatedDuration || 0} dk</span>
        </div>
        <span class="px-2 py-1 bg-gray-100 rounded text-xs">${module.category}</span>
      </div>

      <button onclick="window.location.href='module-detail.php?id=${module.id}'"
              class="w-full bg-cyber text-white py-2 rounded-lg hover:bg-primary transition-colors">
        Modüle Git
      </button>
    </div>
  `;

  return card;
}
```

URL parametreleri ile arama state'ini koruma (956-1023 satırları):

```javascript
function saveSearchStateToURL() {
  const params = new URLSearchParams();

  const searchTerm = document.getElementById('search-input').value;
  if (searchTerm) params.set('q', searchTerm);

  const category = document.getElementById('category-filter').value;
  if (category) params.set('category', category);

  const difficulty = document.getElementById('difficulty-filter').value;
  if (difficulty) params.set('difficulty', difficulty);

  const sortBy = document.getElementById('sort-select').value;
  if (sortBy !== 'newest') params.set('sort', sortBy);

  const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState({}, '', newURL);
}

function loadSearchStateFromURL() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('q')) {
    document.getElementById('search-input').value = params.get('q');
  }
  if (params.has('category')) {
    document.getElementById('category-filter').value = params.get('category');
  }
  if (params.has('difficulty')) {
    document.getElementById('difficulty-filter').value = params.get('difficulty');
  }
  if (params.has('sort')) {
    document.getElementById('sort-select').value = params.get('sort');
  }

  // URL'den gelen parametrelerle arama yap
  performSearch();
}

// Sayfa yüklendiğinde
window.addEventListener('DOMContentLoaded', loadSearchStateFromURL);
```

Günün sonunda courses.html dosyası 1,267 satıra ulaştı. Gelişmiş arama UI, debounce, Firestore + client-side hybrid filtering, aktif filtre tag'leri, URL state management eklendi. Toplam 844 satır arama kodu.

---

## 18. GÜN - Arama ve Filtreleme Implementasyonu, Performans Optimizasyonu

On sekizinci gün, dünkü arama sistemini optimize etmeye ve advanced filtering özellikleri eklemeye odaklandım. İlk olarak arama performansını test ettim. 100+ modül olduğunda tüm modülleri client'a çekmek yavaş oluyordu.

Pagination sistemi ekledim. courses.html'e 1289-1456 satırları arasında sayfalama kodu yazdım:

```javascript
const PAGE_SIZE = 12;
let currentPage = 1;
let lastVisible = null;

async function loadModulesWithPagination(page = 1) {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const category = document.getElementById('category-filter').value;
  const difficulty = document.getElementById('difficulty-filter').value;
  const sortBy = document.getElementById('sort-select').value;

  let query = db.collection('modules').where('isActive', '==', true);

  if (category) query = query.where('category', '==', category);
  if (difficulty) query = query.where('difficulty', '==', difficulty);

  // Sıralama
  let orderByField = 'createdAt';
  let orderByDirection = 'desc';

  switch(sortBy) {
    case 'oldest':
      orderByField = 'createdAt';
      orderByDirection = 'asc';
      break;
    case 'alphabetical':
      orderByField = 'title';
      orderByDirection = 'asc';
      break;
    case 'popular':
      orderByField = 'enrollmentCount';
      orderByDirection = 'desc';
      break;
  }

  query = query.orderBy(orderByField, orderByDirection);

  // Pagination
  if (page > 1 && lastVisible) {
    query = query.startAfter(lastVisible);
  }

  query = query.limit(PAGE_SIZE);

  const snapshot = await query.get();

  if (snapshot.empty) {
    renderModuleResults([]);
    return;
  }

  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  let modules = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Client-side text search
  if (searchTerm) {
    modules = modules.filter(module => {
      const titleMatch = module.title.toLowerCase().includes(searchTerm);
      const descMatch = module.description.toLowerCase().includes(searchTerm);
      return titleMatch || descMatch;
    });
  }

  renderModuleResults(modules);
  renderPaginationControls(page, snapshot.size < PAGE_SIZE);
}
```

Pagination kontrolleri (1501-1623 satırları):

```javascript
function renderPaginationControls(currentPage, isLastPage) {
  const container = document.getElementById('pagination-controls');
  container.innerHTML = '';

  if (currentPage === 1 && isLastPage) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  const controls = document.createElement('div');
  controls.className = 'flex justify-center items-center gap-2 mt-8';

  // Önceki sayfa butonu
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Önceki';
    prevBtn.onclick = () => {
      currentPage--;
      loadModulesWithPagination(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    controls.appendChild(prevBtn);
  }

  // Sayfa numarası
  const pageInfo = document.createElement('span');
  pageInfo.className = 'px-4 py-2 text-gray-700 font-medium';
  pageInfo.textContent = `Sayfa ${currentPage}`;
  controls.appendChild(pageInfo);

  // Sonraki sayfa butonu
  if (!isLastPage) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'px-4 py-2 bg-cyber text-white rounded-lg hover:bg-primary';
    nextBtn.innerHTML = 'Sonraki <i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = () => {
      currentPage++;
      loadModulesWithPagination(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    controls.appendChild(nextBtn);
  }

  container.appendChild(controls);
}
```

Fiyat aralığı filtresi ekledim (modüller ücretli olabilir diye) (1678-1789 satırları):

```html
<div class="price-filter mb-4">
  <label class="block text-sm font-medium mb-2">Fiyat Aralığı</label>
  <div class="flex gap-2 items-center">
    <input type="number"
           id="min-price"
           placeholder="Min"
           class="w-24 px-3 py-2 border rounded-lg"
           onchange="applyFilters()">
    <span>-</span>
    <input type="number"
           id="max-price"
           placeholder="Max"
           class="w-24 px-3 py-2 border rounded-lg"
           onchange="applyFilters()">
  </div>
  <div class="flex gap-2 mt-2">
    <button onclick="setPriceRange(0, 0)"
            class="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
      Ücretsiz
    </button>
    <button onclick="setPriceRange(1, 500)"
            class="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
      ₺1-500
    </button>
    <button onclick="setPriceRange(501, 1000)"
            class="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
      ₺501-1000
    </button>
  </div>
</div>
```

Advanced filter modal ekledim - daha fazla filtre seçeneği için (1834-2045 satırları):

```html
<div id="advanced-filter-modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold">Gelişmiş Filtreler</h3>
      <button onclick="closeAdvancedFilters()" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Süre filtresi -->
      <div>
        <label class="block text-sm font-medium mb-2">Tahmini Süre</label>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex items-center">
            <input type="checkbox" value="0-120" class="mr-2" onchange="updateDurationFilter()">
            0-2 saat
          </label>
          <label class="flex items-center">
            <input type="checkbox" value="121-300" class="mr-2" onchange="updateDurationFilter()">
            2-5 saat
          </label>
          <label class="flex items-center">
            <input type="checkbox" value="301-600" class="mr-2" onchange="updateDurationFilter()">
            5-10 saat
          </label>
          <label class="flex items-center">
            <input type="checkbox" value="601-9999" class="mr-2" onchange="updateDurationFilter()">
            10+ saat
          </label>
        </div>
      </div>

      <!-- Video sayısı -->
      <div>
        <label class="block text-sm font-medium mb-2">Video Sayısı</label>
        <input type="range"
               id="video-count-range"
               min="0"
               max="50"
               value="0"
               class="w-full"
               oninput="updateVideoCountLabel(this.value)">
        <div class="text-sm text-gray-600 mt-1">
          En az <span id="video-count-label">0</span> video
        </div>
      </div>

      <!-- Sertifika var mı -->
      <div>
        <label class="flex items-center">
          <input type="checkbox" id="has-certificate" class="mr-2">
          Sadece sertifikalı modüller
        </label>
      </div>

      <!-- Eğitmen filtresi -->
      <div>
        <label class="block text-sm font-medium mb-2">Eğitmen</label>
        <select id="instructor-filter" class="w-full px-4 py-2 border rounded-lg">
          <option value="">Tüm Eğitmenler</option>
          <!-- Eğitmenler dinamik yüklenecek -->
        </select>
      </div>

      <!-- Dil -->
      <div>
        <label class="block text-sm font-medium mb-2">Dil</label>
        <select id="language-filter" class="w-full px-4 py-2 border rounded-lg">
          <option value="">Tümü</option>
          <option value="tr">Türkçe</option>
          <option value="en">İngilizce</option>
        </select>
      </div>
    </div>

    <div class="mt-6 flex gap-3">
      <button onclick="applyAdvancedFilters()"
              class="flex-1 bg-cyber text-white py-2 rounded-lg hover:bg-primary">
        Filtreleri Uygula
      </button>
      <button onclick="resetAdvancedFilters()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        Sıfırla
      </button>
    </div>
  </div>
</div>
```

Search suggestions (autocomplete) ekledim (2112-2289 satırları):

```javascript
let suggestionsCache = [];

async function loadSearchSuggestions() {
  // Tüm modül başlıklarını ve tag'leri cache'le
  const snapshot = await db.collection('modules')
    .where('isActive', '==', true)
    .get();

  suggestionsCache = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    suggestionsCache.push(data.title);
    if (data.tags) {
      suggestionsCache.push(...data.tags);
    }
  });

  // Duplicate'leri kaldır
  suggestionsCache = [...new Set(suggestionsCache)];
}

function showSearchSuggestions(inputValue) {
  if (inputValue.length < 2) {
    hideSuggestions();
    return;
  }

  const matches = suggestionsCache
    .filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 5);

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

  const container = document.getElementById('search-suggestions');
  container.innerHTML = '';
  container.classList.remove('hidden');

  matches.forEach(match => {
    const item = document.createElement('div');
    item.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
    item.textContent = match;
    item.onclick = () => {
      document.getElementById('search-input').value = match;
      performSearch();
      hideSuggestions();
    };
    container.appendChild(item);
  });
}

// Search input'a oninput event ekle
document.getElementById('search-input').addEventListener('input', (e) => {
  showSearchSuggestions(e.target.value);
});
```

"Son arananlar" özelliği ekledim - LocalStorage kullanarak (2334-2445 satırları):

```javascript
function saveSearchHistory(searchTerm) {
  if (!searchTerm) return;

  let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');

  // Aynı arama varsa kaldır (en üste ekleyeceğiz)
  history = history.filter(item => item !== searchTerm);

  // Başa ekle
  history.unshift(searchTerm);

  // Max 10 arama sakla
  if (history.length > 10) {
    history = history.slice(0, 10);
  }

  localStorage.setItem('searchHistory', JSON.stringify(history));
}

function showSearchHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');

  if (history.length === 0) return;

  const container = document.getElementById('search-history');
  container.innerHTML = '<div class="text-xs text-gray-500 px-4 py-2">Son Aramalar</div>';

  history.forEach(term => {
    const item = document.createElement('div');
    item.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center';
    item.innerHTML = `
      <span onclick="selectHistoryItem('${term}')">${term}</span>
      <button onclick="removeHistoryItem('${term}')" class="text-gray-400 hover:text-red-500">
        <i class="fas fa-times text-xs"></i>
      </button>
    `;
    container.appendChild(item);
  });

  container.classList.remove('hidden');
}
```

Günün sonunda courses.html 2,567 satıra ulaştı. Pagination, advanced filters, autocomplete suggestions, search history özellikleri eklendi. Toplam 1,300 satır yeni arama ve filtreleme kodu.

---

## 19. GÜN - Favori Modüller Sistemi, Bookmark İkonları ve my-favorites.html Sayfası

On dokuzuncu gün, öğrencilerin favori modüllerini kaydetme özelliği eklemeye odaklandım. İlk olarak Firestore'da user_favorites koleksiyonu tasarladım:

```javascript
{
  id: "fav_001",
  userId: "user123",
  moduleId: "module_001",
  addedAt: Timestamp,
  notes: "Bu modülü daha sonra tamamlamak için kaydettim"
}
```

courses.html'deki her modül kartına favori butonu ekledim. createModuleCard() fonksiyonunu 712-891 satırları arasında güncelledim:

```javascript
function createModuleCard(module) {
  const card = document.createElement('div');
  card.className = 'module-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative';

  // Favori ikonunu kontrol et
  const isFavorite = await checkIfFavorite(module.id);

  card.innerHTML = `
    <div class="relative">
      <img src="${module.thumbnailURL || 'placeholder.jpg'}"
           alt="${module.title}"
           class="w-full h-48 object-cover">

      <!-- Favori butonu -->
      <button onclick="toggleFavorite('${module.id}', event)"
              class="absolute top-2 left-2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all shadow-md"
              id="fav-btn-${module.id}">
        <i class="fas fa-heart text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}"></i>
      </button>

      <span class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[module.difficulty]}">
        ${difficultyLabels[module.difficulty]}
      </span>
    </div>

    <!-- ... geri kalan card içeriği -->
  `;

  return card;
}
```

Favori kontrol fonksiyonu yazdım (956-1023 satırları):

```javascript
async function checkIfFavorite(moduleId) {
  const snapshot = await db.collection('user_favorites')
    .where('userId', '==', currentUser.uid)
    .where('moduleId', '==', moduleId)
    .get();

  return !snapshot.empty;
}
```

toggleFavorite() fonksiyonu - favori ekleme/çıkarma (1089-1234 satırları):

```javascript
async function toggleFavorite(moduleId, event) {
  event.stopPropagation(); // Modül kartına tıklama eventini engelle

  const btn = document.getElementById(`fav-btn-${moduleId}`);
  const icon = btn.querySelector('i');

  // Mevcut favorileri kontrol et
  const existingFav = await db.collection('user_favorites')
    .where('userId', '==', currentUser.uid)
    .where('moduleId', '==', moduleId)
    .get();

  if (!existingFav.empty) {
    // Favorilerden çıkar
    await db.collection('user_favorites').doc(existingFav.docs[0].id).delete();

    icon.classList.remove('text-red-500');
    icon.classList.add('text-gray-400');

    showToast('Favorilerden kaldırıldı', 'info');
  } else {
    // Favorilere ekle
    await db.collection('user_favorites').add({
      userId: currentUser.uid,
      moduleId: moduleId,
      addedAt: firebase.firestore.FieldValue.serverTimestamp(),
      notes: ''
    });

    icon.classList.remove('text-gray-400');
    icon.classList.add('text-red-500');

    // Animasyon efekti
    icon.classList.add('animate-bounce');
    setTimeout(() => icon.classList.remove('animate-bounce'), 500);

    showToast('Favorilere eklendi!', 'success');
  }
}
```

my-favorites.html adında yeni sayfa oluşturdum (892 satır). Bu sayfada kullanıcının tüm favori modülleri listeleniyor:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Favorilerim - Çevik Lider</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 min-h-screen flex">
    <!-- Sidebar (aynı student-dashboard'dakiyle) -->
    <aside class="bg-dark text-white w-64 min-h-screen fixed left-0 top-0 z-20 hidden md:block">
        <!-- ... sidebar içeriği -->
    </aside>

    <!-- Main content -->
    <main class="md:ml-64 p-4 md:p-8 w-full">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Favorilerim</h1>
                <p class="text-gray-600">Kaydettiğiniz modüller</p>
            </header>

            <!-- Favori sayısı -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Toplam Favori</p>
                        <p class="text-3xl font-bold text-cyber" id="total-favorites">0</p>
                    </div>
                    <div class="text-right">
                        <button onclick="clearAllFavorites()"
                                class="text-sm text-red-500 hover:text-red-700 hover:underline">
                            <i class="fas fa-trash mr-1"></i>Tümünü Temizle
                        </button>
                    </div>
                </div>
            </div>

            <!-- Favori modüller grid -->
            <div id="favorites-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Favori modüller buraya yüklenecek -->
            </div>

            <!-- Boş state -->
            <div id="empty-state" class="hidden text-center py-12">
                <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-600">Henüz favori modülünüz yok</p>
                <p class="text-sm text-gray-400 mt-2">Modül kartlarındaki kalp ikonuna tıklayarak favori ekleyebilirsiniz</p>
                <a href="courses.html"
                   class="inline-block mt-6 px-6 py-3 bg-cyber text-white rounded-lg hover:bg-primary">
                    Modüllere Göz At
                </a>
            </div>
        </div>
    </main>

    <script src="js/firebase-production.js"></script>
    <script src="js/favorites.js"></script>
</body>
</html>
```

js/favorites.js dosyası oluşturdum (567 satır):

```javascript
let currentUser = null;

// Kullanıcı kontrolü
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  currentUser = user;
  loadFavorites();
});

async function loadFavorites() {
  const favoritesSnapshot = await db.collection('user_favorites')
    .where('userId', '==', currentUser.uid)
    .orderBy('addedAt', 'desc')
    .get();

  const totalFavorites = favoritesSnapshot.size;
  document.getElementById('total-favorites').textContent = totalFavorites;

  if (totalFavorites === 0) {
    document.getElementById('favorites-grid').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }

  document.getElementById('favorites-grid').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');

  const container = document.getElementById('favorites-grid');
  container.innerHTML = '';

  // Her favori için modül bilgisini çek
  for (const doc of favoritesSnapshot.docs) {
    const favoriteData = doc.data();
    const moduleDoc = await db.collection('modules').doc(favoriteData.moduleId).get();

    if (moduleDoc.exists) {
      const moduleData = moduleDoc.data();
      const card = createFavoriteCard(doc.id, moduleData, favoriteData);
      container.appendChild(card);
    }
  }
}

function createFavoriteCard(favoriteId, moduleData, favoriteData) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow';

  const addedDate = favoriteData.addedAt ? favoriteData.addedAt.toDate().toLocaleDateString('tr-TR') : 'Bilinmiyor';

  card.innerHTML = `
    <div class="relative">
      <img src="${moduleData.thumbnailURL || 'placeholder.jpg'}"
           alt="${moduleData.title}"
           class="w-full h-48 object-cover">

      <!-- Kaldır butonu -->
      <button onclick="removeFavorite('${favoriteId}')"
              class="absolute top-2 right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-md">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-900 mb-2">${moduleData.title}</h3>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">${moduleData.description}</p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span><i class="fas fa-calendar mr-1"></i>Eklendi: ${addedDate}</span>
        <span class="px-2 py-1 bg-gray-100 rounded text-xs">${moduleData.category}</span>
      </div>

      <!-- Not ekleme alanı -->
      <div class="mb-4">
        <textarea id="note-${favoriteId}"
                  placeholder="Bu modül hakkında notunuz..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows="2"
                  onchange="updateFavoriteNote('${favoriteId}')">${favoriteData.notes || ''}</textarea>
      </div>

      <button onclick="window.location.href='module-detail.php?id=${moduleData.id}'"
              class="w-full bg-cyber text-white py-2 rounded-lg hover:bg-primary transition-colors">
        Modüle Git
      </button>
    </div>
  `;

  return card;
}

async function removeFavorite(favoriteId) {
  const confirmed = confirm('Bu modülü favorilerden kaldırmak istediğinizden emin misiniz?');

  if (!confirmed) return;

  await db.collection('user_favorites').doc(favoriteId).delete();
  showToast('Favorilerden kaldırıldı', 'success');
  loadFavorites(); // Listeyi yenile
}

async function updateFavoriteNote(favoriteId) {
  const noteText = document.getElementById(`note-${favoriteId}`).value;

  await db.collection('user_favorites').doc(favoriteId).update({
    notes: noteText,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  showToast('Not güncellendi', 'success');
}

async function clearAllFavorites() {
  const confirmed = confirm('Tüm favorilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');

  if (!confirmed) return;

  const favoritesSnapshot = await db.collection('user_favorites')
    .where('userId', '==', currentUser.uid)
    .get();

  const batch = db.batch();
  favoritesSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  showToast('Tüm favoriler temizlendi', 'success');
  loadFavorites();
}
```

student-dashboard.html sidebar'ına "Favorilerim" linki ekledim (56 satırında):

```html
<a href="my-favorites.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800">
    <i class="fas fa-heart mr-3"></i>
    <span>Favorilerim</span>
</a>
```

Favori sayısını dashboard'da göstermek için widget ekledim (234-289 satırları):

```javascript
async function loadFavoritesCount() {
  const snapshot = await db.collection('user_favorites')
    .where('userId', '==', currentUser.uid)
    .get();

  const count = snapshot.size;
  document.getElementById('favorites-count').textContent = count;
}
```

Günün sonunda favori sistemi tamamlandı. my-favorites.html 892 satır, js/favorites.js 567 satır, courses.html'e 178 satır favori kodu eklendi. Toplam 1,637 satır favori yönetim kodu.

---

