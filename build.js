#!/usr/bin/env node

/**
 * Build script for Vercel
 * Environment variable'ları JavaScript dosyalarına inject eder
 */

const fs = require('fs');
const path = require('path');

// Environment variable'ları oku
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ OPENROUTER_API_KEY environment variable bulunamadı');
    console.warn('⚠️ Fallback key kullanılacak (sadece development)');
}

// groq-api.js dosyasını oku
const groqApiPath = path.join(__dirname, 'js', 'groq-api.js');
let groqApiContent = fs.readFileSync(groqApiPath, 'utf8');

// API key'i replace et
if (OPENROUTER_API_KEY) {
    // getAPIKey() fonksiyonunu güncelle
    const newGetAPIKey = `getAPIKey() {
        // Vercel environment variable'dan al
        if (typeof window !== 'undefined' && window.OPENROUTER_API_KEY) {
            console.log('🔑 API Key Vercel environment variable\\'dan alındı');
            return window.OPENROUTER_API_KEY;
        }
        
        // Build time'da inject edilen key
        const injectedKey = '${OPENROUTER_API_KEY}';
        if (injectedKey && injectedKey !== 'undefined') {
            console.log('🔑 API Key build time\\'da inject edildi');
            return injectedKey;
        }
        
        // Fallback: Development için
        const fallbackKey = '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';
        console.warn('⚠️ Environment variable bulunamadı, fallback key kullanılıyor (sadece development)');
        return fallbackKey;
    }`;
    
    groqApiContent = groqApiContent.replace(
        /getAPIKey\(\)\s*\{[\s\S]*?\n\s*return fallbackKey;\s*\n\s*\}/,
        newGetAPIKey
    );
    
    // Dosyayı kaydet
    fs.writeFileSync(groqApiPath, groqApiContent, 'utf8');
    console.log('✅ API Key build time\'da inject edildi');
} else {
    console.log('ℹ️ Environment variable yok, dosya değiştirilmedi');
}

console.log('✅ Build script tamamlandı');

