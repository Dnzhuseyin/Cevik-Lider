#!/usr/bin/env node

/**
 * Build script for Vercel
 * Environment variable'ları JavaScript dosyalarına inject eder
 */

const fs = require('fs');
const path = require('path');

// Environment variable'ları oku
const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('🔧 Build script başlatılıyor...');
console.log('🔑 GROQ_API_KEY var mı?', GROQ_API_KEY ? 'EVET (ilk 20 karakter: ' + GROQ_API_KEY.substring(0, 20) + '...)' : 'HAYIR');

// groq-api.js dosyasını oku
const groqApiPath = path.join(__dirname, 'js', 'groq-api.js');

if (!fs.existsSync(groqApiPath)) {
    console.error('❌ groq-api.js dosyası bulunamadı:', groqApiPath);
    process.exit(1);
}

let groqApiContent = fs.readFileSync(groqApiPath, 'utf8');

// API key'i replace et
if (GROQ_API_KEY && GROQ_API_KEY.trim() !== '') {
    console.log('✅ Environment variable bulundu, inject ediliyor...');
    
    // getAPIKey() fonksiyonunu tamamen değiştir
    const newGetAPIKey = `    getAPIKey() {
        // Build time'da inject edilen key (Vercel environment variable)
        const injectedKey = '${GROQ_API_KEY}';
        if (injectedKey && injectedKey !== 'undefined' && injectedKey.trim() !== '') {
            console.log('🔑 API Key build time\\'da inject edildi (Vercel)');
            console.log('🔑 Injected Key (ilk 30 karakter):', injectedKey.substring(0, 30) + '...');
            console.log('🔑 Injected Key (son 10 karakter):', '...' + injectedKey.substring(injectedKey.length - 10));
            return injectedKey;
        }
        
        // Fallback: Development için (sadece local)
        const fallbackKey = 'FALLBACK_KEY_PLACEHOLDER';
        console.warn('⚠️ Environment variable bulunamadı, fallback key kullanılıyor (sadece development)');
        console.warn('⚠️ Bu key muhtemelen geçersiz! Vercel\\'de GROQ_API_KEY environment variable ekleyin!');
        return fallbackKey;
    }`;
    
    // Mevcut getAPIKey fonksiyonunu bul ve değiştir
    const getAPIKeyRegex = /getAPIKey\(\)\s*\{[\s\S]*?\n\s*return fallbackKey;\s*\n\s*\}/;
    
    if (getAPIKeyRegex.test(groqApiContent)) {
        groqApiContent = groqApiContent.replace(getAPIKeyRegex, newGetAPIKey);
        fs.writeFileSync(groqApiPath, groqApiContent, 'utf8');
        console.log('✅ API Key build time\'da inject edildi');
        console.log('✅ groq-api.js dosyası güncellendi');
    } else {
        console.error('❌ getAPIKey() fonksiyonu bulunamadı, manuel kontrol gerekli');
        process.exit(1);
    }
} else {
    console.warn('⚠️ GROQ_API_KEY environment variable bulunamadı');
    console.warn('⚠️ Fallback key kullanılacak (sadece development için)');
    console.warn('⚠️ Vercel\'de GROQ_API_KEY environment variable eklemeyi unutmayın!');
}

console.log('✅ Build script tamamlandı');
