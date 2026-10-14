<?php
/**
 * ONE-TIME Admin Seed Script
 * 
 * USAGE:
 *   1. Upload this file to your cPanel public_html root (or api folder)
 *   2. Visit: https://lucidmind.co.in/seed-admin.php?secret=LucidSeed2026
 *   3. It will create the admin user if not already exists
 *   4. DELETE this file from the server immediately after!
 */

// ─── Security Gate ────────────────────────────────────────────────────────────
$SEED_SECRET = 'LucidSeed2026';
if (($_GET['secret'] ?? '') !== $SEED_SECRET) {
    http_response_code(403);
    die(json_encode(['error' => 'Forbidden. Pass ?secret=LucidSeed2026 in the URL.']));
}

// ─── Load .env ────────────────────────────────────────────────────────────────
$envCandidates = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    '/home4/lucidmindco/.env',
    '/home4/lucidmindco/public_html/.env',
];

foreach ($envCandidates as $envFile) {
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0 || empty($line) || strpos($line, '=') === false) continue;
            [$name, $value] = explode('=', $line, 2);
            putenv(trim($name) . '=' . trim($value, " \t\n\r\0\x0B\"'"));
        }
        break;
    }
}

// ─── DB Connection ────────────────────────────────────────────────────────────
$host    = getenv('DB_HOST')     ?: 'localhost';
$dbname  = getenv('DB_NAME')     ?: 'lucidmind';
$dbuser  = getenv('DB_USER')     ?: 'root';
$dbpass  = getenv('DB_PASSWORD') ?: '';

header('Content-Type: application/json');

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $dbuser,
        $dbpass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]));
}

// ─── Ensure users table exists ────────────────────────────────────────────────
$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
");

// ─── Admin Credentials ────────────────────────────────────────────────────────
$adminUsername = 'admin';
$adminPassword = 'admin@1234';

// ─── Check if admin already exists ───────────────────────────────────────────
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$adminUsername]);
$existing = $stmt->fetch();

if ($existing) {
    $hashed = password_hash($adminPassword, PASSWORD_BCRYPT);
    $pdo->prepare("UPDATE users SET password = ? WHERE username = ?")->execute([$hashed, $adminUsername]);
    echo json_encode([
        'status'   => 'updated',
        'message'  => "Admin user already existed - password has been reset.",
        'username' => $adminUsername,
        'password' => $adminPassword,
        'warning'  => 'DELETE this file from your server immediately!'
    ], JSON_PRETTY_PRINT);
} else {
    $hashed = password_hash($adminPassword, PASSWORD_BCRYPT);
    $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)")->execute([$adminUsername, $hashed]);
    echo json_encode([
        'status'   => 'created',
        'message'  => "Admin user created successfully!",
        'username' => $adminUsername,
        'password' => $adminPassword,
        'warning'  => 'DELETE this file from your server immediately!'
    ], JSON_PRETTY_PRINT);
}
