#!/usr/bin/env node

/**
 * OpenRouter API Key Test Script
 * API key'in geçerli olup olmadığını ve kredi durumunu kontrol eder
 */

const https = require('https');

// Test edilecek API key
const API_KEY = process.env.OPENROUTER_API_KEY || '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';

console.log('🔍 OpenRouter API Key Test Başlatılıyor...');
console.log('🔑 API Key (ilk 20 karakter):', API_KEY.substring(0, 20) + '...');
console.log('');

// Test request
const testData = JSON.stringify({
    model: 'meta-llama/llama-3.1-70b-instruct',
    messages: [{ role: 'user', content: 'Test' }],
    max_tokens: 10
});

const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cevik-lider.vercel.app',
        'X-Title': 'Cevik-Lider-Platform'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📊 Response Status:', res.statusCode);
        console.log('📊 Response Headers:', JSON.stringify(res.headers, null, 2));
        console.log('');

        if (res.statusCode === 200) {
            console.log('✅ API Key GEÇERLİ!');
            console.log('✅ Kredi mevcut, API çalışıyor');
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
            console.log('');
            console.log('🔧 ÇÖZÜM:');
            console.log('   1. OpenRouter Dashboard\'a gidin: https://openrouter.ai/keys');
            console.log('   2. API key\'in durumunu kontrol edin');
            console.log('   3. Kredi durumunu kontrol edin');
            console.log('   4. Gerekirse yeni API key oluşturun');
        } else if (res.statusCode === 429) {
            console.log('⚠️ RATE LIMIT!');
            console.log('⚠️ Çok fazla istek gönderilmiş');
            console.log('⚠️ Birkaç dakika bekleyip tekrar deneyin');
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

