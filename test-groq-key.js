#!/usr/bin/env node

/**
 * Groq API Key Test Script
 * API key'in geçerli olup olmadığını ve kredi durumunu kontrol eder
 */

const https = require('https');

// Test edilecek API key
// NOT: API key environment variable'dan alınmalı, kod içinde hardcode edilmemeli
const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
    console.error('❌ GROQ_API_KEY environment variable bulunamadı!');
    console.error('❌ Kullanım: export GROQ_API_KEY="your-key" && node test-groq-key.js');
    process.exit(1);
}

console.log('🔍 Groq API Key Test Başlatılıyor...');
console.log('🔑 API Key (ilk 20 karakter):', API_KEY.substring(0, 20) + '...');
console.log('');

// Test request - Groq'un güncel modelleri
const testData = JSON.stringify({
    model: 'llama-3.3-70b-versatile', // Güncel model
    messages: [{ role: 'user', content: 'Test' }],
    max_tokens: 10
});

const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📊 Response Status:', res.statusCode);
        console.log('');

        if (res.statusCode === 200) {
            console.log('✅ API Key GEÇERLİ!');
            console.log('✅ API çalışıyor');
            try {
                const response = JSON.parse(data);
                console.log('📥 Response:', JSON.stringify(response, null, 2));
            } catch (e) {
                console.log('📥 Response (raw):', data);
            }
        } else if (res.statusCode === 401) {
            console.log('❌ API Key GEÇERSİZ veya KULLANILAMAZ!');
            console.log('❌ Olası sebepler:');
            console.log('   1. API key yanlış/geçersiz');
            console.log('   2. API key\'in kredisi bitmiş');
            console.log('   3. API key deaktive edilmiş');
            console.log('');
            try {
                const error = JSON.parse(data);
                console.log('❌ Hata Detayı:', JSON.stringify(error, null, 2));
            } catch (e) {
                console.log('❌ Hata (raw):', data);
            }
        } else {
            console.log('⚠️ Beklenmeyen durum:', res.statusCode);
            console.log('📥 Response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request Hatası:', error.message);
});

req.write(testData);
req.end();

