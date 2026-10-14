<?php

$envFile = __DIR__ . '/../api/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'lucidmind';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage() . "\n");
}

$jsonFile = __DIR__ . '/../backend/data/db.json';
if (!file_exists($jsonFile)) {
    die("Error: JSON file not found at $jsonFile\n");
}

$data = json_decode(file_get_contents($jsonFile), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error parsing JSON: " . json_last_error_msg() . "\n");
}

function getId($item) {
    return $item['_id'] ?? $item['id'] ?? null;
}

// Blogs
if (isset($data['blogs']) && is_array($data['blogs'])) {
    echo "Migrating " . count($data['blogs']) . " blogs...\n";
    $stmt = $pdo->prepare("INSERT IGNORE INTO blogs (id, title, slug, tag, category, author, author_role, read_time, date, excerpt, description, content, image, cover_image, tags, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($data['blogs'] as $idx => $blog) {
        $id = getId($blog);
        if (!$id) continue;
        $tags = isset($blog['tags']) ? json_encode($blog['tags']) : json_encode([]);
        $isPublished = isset($blog['isPublished']) ? (int)$blog['isPublished'] : 1;
        $order = isset($blog['order']) ? (int)$blog['order'] : ($idx + 1);
        $stmt->execute([
            $id,
            $blog['title'] ?? '',
            $blog['slug'] ?? '',
            $blog['tag'] ?? 'MINDSET',
            $blog['category'] ?? 'Thought Leadership',
            $blog['author'] ?? 'Ravishankar Pingali',
            $blog['authorRole'] ?? '',
            $blog['readTime'] ?? '3 MIN READ',
            $blog['date'] ?? '',
            $blog['excerpt'] ?? '',
            $blog['description'] ?? '',
            $blog['content'] ?? '',
            $blog['image'] ?? '',
            $blog['coverImage'] ?? '',
            $tags,
            $isPublished,
            $order
        ]);
    }
}

// Podcasts
if (isset($data['podcasts']) && is_array($data['podcasts'])) {
    echo "Migrating " . count($data['podcasts']) . " podcasts...\n";
    $stmt = $pdo->prepare("INSERT IGNORE INTO podcasts (id, title, slug, episode, src, audio_url, thumbnail, cover_image, duration, host, guest, description, tags, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($data['podcasts'] as $idx => $podcast) {
        $id = getId($podcast);
        if (!$id) continue;
        $tags = isset($podcast['tags']) ? json_encode($podcast['tags']) : json_encode([]);
        $isPublished = isset($podcast['isPublished']) ? (int)$podcast['isPublished'] : 1;
        $order = isset($podcast['order']) ? (int)$podcast['order'] : ($idx + 1);
        $stmt->execute([
            $id,
            $podcast['title'] ?? '',
            $podcast['slug'] ?? '',
            $podcast['episode'] ?? 'Ep. 01',
            $podcast['src'] ?? '',
            $podcast['audioUrl'] ?? '',
            $podcast['thumbnail'] ?? '',
            $podcast['coverImage'] ?? '',
            $podcast['duration'] ?? '15 mins',
            $podcast['host'] ?? 'Ravishankar Pingali',
            $podcast['guest'] ?? '',
            $podcast['description'] ?? '',
            $tags,
            $isPublished,
            $order
        ]);
    }
}

// Services
if (isset($data['services']) && is_array($data['services'])) {
    echo "Migrating " . count($data['services']) . " services...\n";
    $stmt = $pdo->prepare("INSERT IGNORE INTO services (id, title, slug, subtitle, category, real_problem, description, features, success_looks_like, icon, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($data['services'] as $idx => $service) {
        $id = getId($service);
        if (!$id) continue;
        $features = isset($service['features']) ? json_encode($service['features']) : json_encode([]);
        $isActive = isset($service['isActive']) ? (int)$service['isActive'] : 1;
        $order = isset($service['order']) ? (int)$service['order'] : ($idx + 1);
        $stmt->execute([
            $id,
            $service['title'] ?? '',
            $service['slug'] ?? '',
            $service['subtitle'] ?? '',
            $service['category'] ?? 'Phase 1: Getting Started',
            $service['realProblem'] ?? '',
            $service['description'] ?? '',
            $features,
            $service['successLooksLike'] ?? '',
            $service['icon'] ?? 'Rocket',
            $service['image'] ?? '',
            $isActive,
            $order
        ]);
    }
}

echo "Migration completed successfully!\n";
