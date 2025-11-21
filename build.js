#!/usr/bin/env node

/**
 * Build script for Vercel
 * Environment variable'ları JavaScript dosyalarına inject eder
 */

const fs = require('fs');
const path = require('path');

// Environment variable'ları oku
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log('🔧 Build script başlatılıyor...');
console.log('🔑 OPENROUTER_API_KEY var mı?', OPENROUTER_API_KEY ? 'EVET (ilk 20 karakter: ' + OPENROUTER_API_KEY.substring(0, 20) + '...)' : 'HAYIR');

// groq-api.js dosyasını oku
const groqApiPath = path.join(__dirname, 'js', 'groq-api.js');

if (!fs.existsSync(groqApiPath)) {
    console.error('❌ groq-api.js dosyası bulunamadı:', groqApiPath);
    process.exit(1);
}

let groqApiContent = fs.readFileSync(groqApiPath, 'utf8');

// API key'i replace et
if (OPENROUTER_API_KEY && OPENROUTER_API_KEY.trim() !== '') {
    console.log('✅ Environment variable bulundu, inject ediliyor...');
    
    // getAPIKey() fonksiyonunu tamamen değiştir
    const newGetAPIKey = `    getAPIKey() {
        // Build time'da inject edilen key (Vercel environment variable)
        const injectedKey = '${OPENROUTER_API_KEY}';
        if (injectedKey && injectedKey !== 'undefined' && injectedKey.trim() !== '') {
            console.log('🔑 API Key build time\\'da inject edildi (Vercel)');
            return injectedKey;
        }
        
        // Fallback: Development için (sadece local)
        const fallbackKey = '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';
        console.warn('⚠️ Environment variable bulunamadı, fallback key kullanılıyor (sadece development)');
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
    console.warn('⚠️ OPENROUTER_API_KEY environment variable bulunamadı');
    console.warn('⚠️ Fallback key kullanılacak (sadece development için)');
    console.warn('⚠️ Vercel\'de OPENROUTER_API_KEY environment variable eklemeyi unutmayın!');
}

console.log('✅ Build script tamamlandı');
