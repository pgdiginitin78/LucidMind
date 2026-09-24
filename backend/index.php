<?php
// Load env early
$envCandidates = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__, 2) . '/.env',
    '/home4/lucidmindco/.env',
    '/home4/lucidmindco/public_html/.env',
    '/home4/lucidmindco/public_html/api/.env'
];

foreach ($envCandidates as $envFile) {
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0 || empty($line) || strpos($line, '=') === false) continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            putenv("$name=$value");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
        break;
    }
}

// Explicit allowed frontend origins
$allowedOrigins = [
    'https://lucidmind.co.in',
    'https://www.lucidmind.co.in',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://lucid-mind-ten.vercel.app'
];

$frontendUrl = getenv('FRONTEND_URL') ?: ($_ENV['FRONTEND_URL'] ?? ($_SERVER['FRONTEND_URL'] ?? ''));
if (!empty($frontendUrl)) {
    $cleanFrontendUrl = rtrim($frontendUrl, '/');
    if (!in_array($cleanFrontendUrl, $allowedOrigins, true)) {
        $allowedOrigins[] = $cleanFrontendUrl;
    }
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
} else if (empty($origin)) {
    // Direct or server-to-server calls (e.g. curl)
    header("Access-Control-Allow-Origin: https://lucidmind.co.in");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Global Exception Handler
set_exception_handler(function($e) {
    error_log($e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
    exit;
});

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = str_replace($scriptName, '', $requestUri);
$path = trim($path, '/');
$parts = explode('/', $path);

// If first segment is 'api', shift it
if (isset($parts[0]) && $parts[0] === 'api') {
    array_shift($parts);
}

$resource = $parts[0] ?? '';

// Health check
if ($resource === 'health') {
    echo json_encode(['status' => 'ok', 'message' => 'LucidMind API is running']);
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/auth.php';

// Controllers
$controllersMap = [
    'auth' => 'AuthController.php',
    'blogs' => 'BlogController.php',
    'podcasts' => 'PodcastController.php',
    'services' => 'ServiceController.php',
    'contact' => 'ContactController.php',
    'upload' => 'UploadController.php'
];

if (array_key_exists($resource, $controllersMap)) {
    require_once __DIR__ . '/controllers/' . $controllersMap[$resource];
    
    // Auth Controller
    if ($resource === 'auth') {
        $authController = new AuthController();
        $authController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
    // Blog Controller
    else if ($resource === 'blogs') {
        $blogController = new BlogController();
        $blogController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
    // Podcast Controller
    else if ($resource === 'podcasts') {
        $podcastController = new PodcastController();
        $podcastController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
    // Service Controller
    else if ($resource === 'services') {
        $serviceController = new ServiceController();
        $serviceController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
    // Contact Controller
    else if ($resource === 'contact') {
        $contactController = new ContactController();
        $contactController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
    // Upload Controller
    else if ($resource === 'upload') {
        $uploadController = new UploadController();
        $uploadController->handleRequest($_SERVER['REQUEST_METHOD'], array_slice($parts, 1));
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Route not found']);
}
