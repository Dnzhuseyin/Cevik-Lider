/**
 * Local Development Server
 * Firebase + Static Files + Groq API Proxy
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env file
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                }
            });
            console.log('✅ .env dosyası yüklendi');
        } else {
            console.warn('⚠️  .env dosyası bulunamadı');
        }
    } catch (error) {
        console.error('❌ .env yükleme hatası:', error.message);
    }
}

loadEnv();

const PORT = 8080;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Groq API Proxy Handler
async function handleGroqProxy(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
        try {
            const { prompt, context, model, temperature, max_tokens } = JSON.parse(body);

            if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
                throw new Error('GROQ_API_KEY tanımlı değil. Lütfen .env dosyasını kontrol edin.');
            }

            console.log('🔍 Groq API isteği:', {
                model: model || 'llama-3.3-70b-versatile',
                promptLength: prompt?.length || 0
            });

            const groqRequest = {
                model: model || 'llama-3.3-70b-versatile',
                messages: [
                    ...(context ? [{ role: 'system', content: context }] : []),
                    { role: 'user', content: prompt }
                ],
                temperature: temperature || 0.7,
                max_tokens: max_tokens || 2048
            };

            // Make request to Groq API
            const https = require('https');
            const options = {
                hostname: 'api.groq.com',
                path: '/openai/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            };

            const groqReq = https.request(options, (groqRes) => {
                let data = '';
                groqRes.on('data', chunk => data += chunk);
                groqRes.on('end', () => {
                    if (groqRes.statusCode === 200) {
                        const result = JSON.parse(data);
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({
                            success: true,
                            data: result
                        }));
                        console.log('✅ Groq API yanıt başarılı');
                    } else {
                        console.error('❌ Groq API hatası:', groqRes.statusCode, data);
                        res.writeHead(groqRes.statusCode, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({
                            error: 'Groq API error',
                            status: groqRes.statusCode,
                            message: data
                        }));
                    }
                });
            });

            groqReq.on('error', (error) => {
                console.error('❌ Groq API bağlantı hatası:', error);
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({
                    error: 'Connection error',
                    message: error.message
                }));
            });

            groqReq.write(JSON.stringify(groqRequest));
            groqReq.end();

        } catch (error) {
            console.error('❌ Proxy hatası:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }));
        }
    });
}

// Static file server
function serveStaticFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Dosya Bulunamadı</h1>');
            } else {
                res.writeHead(500);
                res.end('Server hatası');
            }
        } else {
            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Groq API Proxy
    if (pathname === '/api/groq-proxy') {
        handleGroqProxy(req, res);
        return;
    }

    // Static files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        // Try adding .html extension
        if (!path.extname(filePath)) {
            filePath += '.html';
        }
    }

    serveStaticFile(filePath, res);
});

server.listen(PORT, () => {
    console.log('\n🚀 Çevik Lider - Local Development Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server çalışıyor: http://localhost:${PORT}`);
    console.log(`🔗 Ana sayfa: http://localhost:${PORT}/index.html`);
    console.log(`🔗 Koordinatör: http://localhost:${PORT}/instructor-dashboard.html`);
    console.log(`🔗 Öğrenci: http://localhost:${PORT}/student-dashboard.html`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
        console.log('⚠️  UYARI: GROQ_API_KEY tanımlı değil!');
        console.log('   .env dosyasına API key ekleyin:');
        console.log('   GROQ_API_KEY=your_actual_api_key');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
        console.log('✅ Groq API Key: ' + GROQ_API_KEY.substring(0, 10) + '...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n💡 İpucu: Ctrl+C ile durdurun\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Server kapatılıyor...');
    server.close(() => {
        console.log('✅ Server başarıyla kapatıldı');
        process.exit(0);
    });
});
