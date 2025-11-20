const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5555;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`📡 ${req.method} ${req.url}`);
    
    // Parse URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>404 - Dosya Bulunamadı</h1>
                    <p>Aranan dosya: ${req.url}</p>
                    <p><a href="/">Ana Sayfaya Dön</a></p>
                `);
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 EduPlatform Server başlatıldı!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📁 Dizin: ${process.cwd()}`);
    console.log(`⏰ Başlatma zamanı: ${new Date().toLocaleString('tr-TR')}`);
    console.log(`🔄 Cache devre dışı - Her zaman güncel dosyalar`);
});

server.on('error', (err) => {
    console.error(`❌ Server hatası:`, err);
});
