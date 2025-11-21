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
    
    // Escape special characters in API key for safe string replacement
    // Escape single quotes, backslashes, and dollar signs
    const escapedKey = GROQ_API_KEY
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/'/g, "\\'")    // Escape single quotes
        .replace(/\$/g, "\\$");   // Escape dollar signs
    
    // Placeholder'ı gerçek key ile değiştir (hem tek hem çift tırnak versiyonlarını kontrol et)
    const placeholder1 = "'INJECTED_BY_BUILD_SCRIPT'";
    const placeholder2 = '"INJECTED_BY_BUILD_SCRIPT"';
    const replacement = `'${escapedKey}'`;
    
    let replaced = false;
    if (groqApiContent.includes(placeholder1)) {
        groqApiContent = groqApiContent.replace(placeholder1, replacement);
        replaced = true;
    } else if (groqApiContent.includes(placeholder2)) {
        groqApiContent = groqApiContent.replace(placeholder2, replacement);
        replaced = true;
    }
    
    if (replaced) {
        fs.writeFileSync(groqApiPath, groqApiContent, 'utf8');
        console.log('✅ API Key build time\'da inject edildi');
        console.log('✅ groq-api.js dosyası güncellendi');
        console.log('🔑 Injected Key (ilk 20 karakter):', GROQ_API_KEY.substring(0, 20) + '...');
        console.log('🔑 Injected Key (son 10 karakter):', '...' + GROQ_API_KEY.substring(GROQ_API_KEY.length - 10));
    } else {
        console.error('❌ Placeholder "INJECTED_BY_BUILD_SCRIPT" bulunamadı!');
        console.error('❌ groq-api.js dosyasında getAPIKey() fonksiyonunu kontrol edin');
        console.error('❌ Aranan placeholder:', placeholder1);
        console.error('❌ Dosya içeriği (ilk 500 karakter):', groqApiContent.substring(0, 500));
        process.exit(1);
    }
} else {
    console.warn('⚠️ GROQ_API_KEY environment variable bulunamadı');
    console.warn('⚠️ Fallback key kullanılacak (sadece development için)');
    console.warn('⚠️ Vercel\'de GROQ_API_KEY environment variable eklemeyi unutmayın!');
}

console.log('✅ Build script tamamlandı');
