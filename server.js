const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 8000;

// Load API key from .env
const envPath = path.join(__dirname, '.env');
let GROQ_API_KEY = null;

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('GROQ_API_KEY=')) {
            GROQ_API_KEY = line.substring('GROQ_API_KEY='.length).trim();
            console.log('✅ Groq API Key loaded');
            break;
        }
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Log all requests
    console.log(`${req.method} ${pathname}`);

    // Handle Groq API Proxy
    if (pathname === '/api/groq-proxy') {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
        }

        if (!GROQ_API_KEY) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'API key not configured' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                if (!data.prompt) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Prompt required' }));
                    return;
                }

                const groqPayload = JSON.stringify({
                    model: data.model || 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: data.prompt }],
                    temperature: data.temperature || 0.7,
                    max_tokens: data.max_tokens || 2048
                });

                const options = {
                    hostname: 'api.groq.com',
                    port: 443,
                    path: '/openai/v1/chat/completions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Length': Buffer.byteLength(groqPayload)
                    }
                };

                const groqReq = https.request(options, (groqRes) => {
                    let responseBody = '';

                    groqRes.on('data', (chunk) => {
                        responseBody += chunk;
                    });

                    groqRes.on('end', () => {
                        if (groqRes.statusCode !== 200) {
                            res.writeHead(groqRes.statusCode);
                            res.end(responseBody);
                            return;
                        }

                        const groqData = JSON.parse(responseBody);
                        res.writeHead(200);
                        res.end(JSON.stringify({
                            success: true,
                            data: groqData
                        }));
                    });
                });

                groqReq.on('error', (error) => {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Groq API request failed' }));
                });

                groqReq.write(groqPayload);
                groqReq.end();

            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

        return;
    }

    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content || '404 - Page Not Found', 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 Server çalışıyor: http://localhost:${port}`);
    console.log(`📁 Dizin: ${__dirname}`);
    console.log(`🔑 Groq API Proxy: http://localhost:${port}/api/groq-proxy`);
    console.log(`⏹️  Durdurmak için Ctrl+C`);
});
