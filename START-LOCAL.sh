#!/bin/bash

# Çevik Lider - Local Development Server Başlatma Scripti

echo "🚀 Çevik Lider Platformu Başlatılıyor..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env dosyası bulunamadı!"
    echo ""
    echo "📝 .env dosyası oluşturuluyor..."
    cat > .env << 'EOF'
# Groq API Key - https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here
EOF
    echo "✅ .env dosyası oluşturuldu"
    echo ""
    echo "⚠️  ÖNEMLI: .env dosyasını açıp GROQ_API_KEY değerini güncelleyin!"
    echo "   1. https://console.groq.com/keys adresinden API key alın"
    echo "   2. .env dosyasını düzenleyin"
    echo "   3. Bu scripti tekrar çalıştırın"
    echo ""
    exit 1
fi

# Check if API key is set
GROQ_KEY=$(grep "GROQ_API_KEY" .env | cut -d '=' -f2)
if [ "$GROQ_KEY" == "your_groq_api_key_here" ] || [ -z "$GROQ_KEY" ]; then
    echo "❌ GROQ_API_KEY henüz ayarlanmamış!"
    echo ""
    echo "📝 Lütfen şu adımları takip edin:"
    echo "   1. https://console.groq.com/keys adresinden API key alın"
    echo "   2. .env dosyasını açın"
    echo "   3. GROQ_API_KEY=your_actual_key_here şeklinde güncelleyin"
    echo "   4. Bu scripti tekrar çalıştırın"
    echo ""
    exit 1
fi

echo "✅ Konfigürasyon kontrol edildi"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js kurulu değil!"
    echo "   Lütfen https://nodejs.org/ adresinden Node.js kurun"
    exit 1
fi

echo "✅ Node.js bulundu: $(node --version)"
echo ""

# Start the server
echo "🚀 Server başlatılıyor..."
echo ""

node local-server.js
