<?php
/**
 * Groq API Proxy - Hostinger PHP Backend
 * API anahtarını güvenli şekilde saklayıp istemciye açığa çıkarmaz
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// OPTIONS request için hemen dön
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Sadece POST isteklerine izin ver
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// .env dosyasından API key oku
$envFile = __DIR__ . '/../.env';
$apiKey = null;

if (file_exists($envFile)) {
    $envContent = file_get_contents($envFile);
    $lines = explode("\n", $envContent);
    foreach ($lines as $line) {
        if (strpos($line, 'GROQ_API_KEY=') === 0) {
            $apiKey = trim(substr($line, strlen('GROQ_API_KEY=')));
            break;
        }
    }
}

// Alternatif: Environment variable'dan oku
if (!$apiKey) {
    $apiKey = getenv('GROQ_API_KEY');
}

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key not configured']);
    exit();
}

// Request body'yi al
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

if (!$data || !isset($data['prompt'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit();
}

// Groq API'ye istek gönder
$groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

$groqPayload = [
    'model' => $data['model'] ?? 'llama-3.3-70b-versatile',
    'messages' => [
        [
            'role' => 'user',
            'content' => $data['prompt']
        ]
    ],
    'temperature' => $data['temperature'] ?? 0.7,
    'max_tokens' => $data['max_tokens'] ?? 2048
];

$ch = curl_init($groqUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($groqPayload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Hata kontrolü
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . $curlError]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo $response;
    exit();
}

// Başarılı yanıt
$groqResponse = json_decode($response, true);

echo json_encode([
    'success' => true,
    'data' => $groqResponse
]);
?>
