#!/bin/bash

# 🚀 Hostinger Deployment Script
# Bu script Hostinger'a yüklenecek dosyaları hazırlar

echo "🔧 Hostinger Deployment Hazırlığı Başlıyor..."

# Yüklenecek dosyaların listesi
DEPLOY_FILES=(
    ".htaccess"
    "index.html"
    "account.html"
    "courses.html"
    "courses.php"
    "instructor-content.html"
    "instructor-content.php"
    "instructor-courses.html"
    "instructor-dashboard.html"
    "instructor-login.html"
    "instructor-students.html"
    "instructor-students.php"
    "module-detail.html"
    "module-detail.php"
    "my-notes.html"
    "progress.html"
    "register.html"
    "student-dashboard.html"
    "student-quiz.html"
    "css/styles.css"
    "js/firebase-production.js"
    "js/groq-api.js"
    "js/main.js"
    "js/user-utils.js"
)

# Deployment klasörü oluştur
DEPLOY_DIR="hostinger-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/css"
mkdir -p "$DEPLOY_DIR/js"

echo "📁 Dosyalar kopyalanıyor..."

# Dosyaları kopyala
for file in "${DEPLOY_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Klasör yapısını koru
        dir=$(dirname "$file")
        if [ "$dir" != "." ]; then
            mkdir -p "$DEPLOY_DIR/$dir"
        fi
        cp "$file" "$DEPLOY_DIR/$file"
        echo "✅ $file kopyalandı"
    else
        echo "⚠️  $file bulunamadı!"
    fi
done

# İzinleri ayarla (simülasyon)
echo ""
echo "📋 Dosya İzinleri (Hostinger'da manuel ayarlayın):"
echo "   - Tüm dosyalar: 644"
echo "   - Tüm klasörler: 755"
echo ""

# Özet
echo "✅ Deployment hazır!"
echo "📦 Klasör: $DEPLOY_DIR"
echo ""
echo "🚀 Sonraki Adımlar:"
echo "   1. '$DEPLOY_DIR' klasöründeki tüm dosyaları"
echo "   2. Hostinger File Manager'da 'public_html/' klasörüne yükleyin"
echo "   3. Dosya izinlerini ayarlayın (644 ve 755)"
echo "   4. Test edin: https://ceviklider.com"
echo ""

# Dosya sayısı
FILE_COUNT=$(find "$DEPLOY_DIR" -type f | wc -l)
echo "📊 Toplam $FILE_COUNT dosya hazır!"

