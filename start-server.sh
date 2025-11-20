#!/bin/bash

echo "🚀 Çevik Lider Server Başlatılıyor..."
echo "📁 Dizin: $(pwd)"
echo ""

# Port listesi
PORTS=(3001 5500 8080 9090 7777)

# Mevcut sunucuları kapat
echo "🔄 Mevcut sunucular kapatılıyor..."
pkill -f "python3 -m http.server" 2>/dev/null || true
pkill -f "php -S" 2>/dev/null || true

echo ""
echo "🎯 Sunucular başlatılıyor..."

# Her port için sunucu başlat
for PORT in "${PORTS[@]}"; do
    echo "   Port $PORT başlatılıyor..."
    python3 -m http.server $PORT > /dev/null 2>&1 &
    sleep 1
done

echo ""
echo "✅ Sunucular başlatıldı!"
echo ""
echo "🌐 Erişilebilir URL'ler:"
for PORT in "${PORTS[@]}"; do
    echo "   📍 http://localhost:$PORT"
done

echo ""
echo "🎯 Tarayıcınızda yukarıdaki URL'lerden birini açın!"
echo "⏹️  Durdurmak için: pkill -f 'python3 -m http.server'"
echo ""
