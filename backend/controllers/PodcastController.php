<?php

class PodcastController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function handleRequest($method, $args) {
        $idOrSlug = $args[0] ?? null;
        $action = $args[1] ?? null;

        if ($method === 'GET' && !$idOrSlug) {
            $this->getAllPodcasts();
        } else if ($method === 'GET' && $idOrSlug) {
            $this->getPodcastById($idOrSlug);
        } else if ($method === 'POST') {
            authenticate();
            $this->createPodcast();
        } else if ($method === 'PUT' && $idOrSlug === 'reorder') {
            authenticate();
            $this->reorderPodcasts();
        } else if ($method === 'PUT' && $idOrSlug) {
            authenticate();
            $this->updatePodcast($idOrSlug);
        } else if ($method === 'DELETE' && $idOrSlug) {
            authenticate();
            $this->deletePodcast($idOrSlug);
        } else if ($method === 'PATCH' && $action === 'publish') {
            authenticate();
            $this->publishPodcast($idOrSlug);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function getAllPodcasts() {
        $stmt = $this->pdo->prepare("SELECT * FROM podcasts ORDER BY sort_order ASC, created_at DESC");
        $stmt->execute();
        $podcasts = $stmt->fetchAll();
        
        foreach ($podcasts as &$podcast) {
            $podcast['_id'] = $podcast['id'];
            $podcast['tags'] = json_decode($podcast['tags'], true) ?: [];
            $podcast['isPublished'] = (bool)$podcast['is_published'];
            $podcast['audioUrl'] = $podcast['audio_url'];
            $podcast['coverImage'] = $podcast['cover_image'];
        }

        echo json_encode(['podcasts' => $podcasts]);
    }

    private function getPodcastById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM podcasts WHERE id = ?");
        $stmt->execute([$id]);
        $podcast = $stmt->fetch();

        if ($podcast) {
            $podcast['_id'] = $podcast['id'];
            $podcast['tags'] = json_decode($podcast['tags'], true) ?: [];
            $podcast['isPublished'] = (bool)$podcast['is_published'];
            $podcast['audioUrl'] = $podcast['audio_url'];
            $podcast['coverImage'] = $podcast['cover_image'];
            echo json_encode(['podcast' => $podcast]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Podcast not found']);
        }
    }

    private function slugify($text) {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9-]/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }

    private function createPodcast() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['title'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Title is required']);
            return;
        }

        $id = uniqid('pod_');
        $slug = !empty($data['slug']) ? $data['slug'] : $this->slugify($data['title']);
        $episode = $data['episode'] ?? 'Ep. 01';
        $finalSrc = $data['src'] ?? $data['audioUrl'] ?? '';
        $thumbnail = $data['thumbnail'] ?? $data['coverImage'] ?? '';
        $coverImage = $data['coverImage'] ?? $thumbnail;
        $duration = $data['duration'] ?? '15 mins';
        $host = $data['host'] ?? 'Ravishankar Pingali';
        $guest = $data['guest'] ?? '';
        $description = $data['description'] ?? '';
        $isPublished = isset($data['isPublished']) ? (int)$data['isPublished'] : 1;
        $tags = isset($data['tags']) && is_array($data['tags']) ? json_encode($data['tags']) : json_encode([]);

        $stmt = $this->pdo->prepare("INSERT INTO podcasts (id, title, slug, episode, src, audio_url, thumbnail, cover_image, duration, host, guest, description, tags, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        try {
            $stmt->execute([$id, $data['title'], $slug, $episode, $finalSrc, $finalSrc, $thumbnail, $coverImage, $duration, $host, $guest, $description, $tags, $isPublished]);
            $podcast = $data;
            $podcast['_id'] = $id;
            http_response_code(201);
            echo json_encode(['message' => 'Podcast created', 'podcast' => $podcast]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function updatePodcast($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $fields = [];
        $values = [];

        $mapping = [
            'title' => 'title',
            'slug' => 'slug',
            'episode' => 'episode',
            'src' => 'src',
            'audioUrl' => 'audio_url',
            'thumbnail' => 'thumbnail',
            'coverImage' => 'cover_image',
            'duration' => 'duration',
            'host' => 'host',
            'guest' => 'guest',
            'description' => 'description'
        ];

        // Mirror fields
        if (isset($data['src']) && !isset($data['audioUrl'])) $data['audioUrl'] = $data['src'];
        if (isset($data['audioUrl']) && !isset($data['src'])) $data['src'] = $data['audioUrl'];
        if (isset($data['thumbnail']) && !isset($data['coverImage'])) $data['coverImage'] = $data['thumbnail'];
        if (isset($data['coverImage']) && !isset($data['thumbnail'])) $data['thumbnail'] = $data['coverImage'];

        foreach ($mapping as $jsonKey => $dbKey) {
            if (isset($data[$jsonKey])) {
                $fields[] = "$dbKey = ?";
                $values[] = $data[$jsonKey];
            }
        }

        if (isset($data['isPublished'])) {
            $fields[] = "is_published = ?";
            $values[] = (int)$data['isPublished'];
        }

        if (isset($data['tags']) && is_array($data['tags'])) {
            $fields[] = "tags = ?";
            $values[] = json_encode($data['tags']);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['message' => 'No fields to update']);
            return;
        }

        $values[] = $id;
        $sql = "UPDATE podcasts SET " . implode(', ', $fields) . " WHERE id = ?";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            if ($stmt->rowCount() > 0) {
                // Fetch the updated podcast
                $stmt = $this->pdo->prepare("SELECT * FROM podcasts WHERE id = ?");
                $stmt->execute([$id]);
                $podcast = $stmt->fetch();
                $podcast['_id'] = $podcast['id'];
                $podcast['tags'] = json_decode($podcast['tags'], true) ?: [];
                echo json_encode(['message' => 'Podcast updated', 'podcast' => $podcast]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Podcast not found or no changes made']);
            }
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function deletePodcast($id) {
        $stmt = $this->pdo->prepare("DELETE FROM podcasts WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Podcast deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Podcast not found']);
        }
    }

    private function publishPodcast($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $isPublished = isset($data['isPublished']) ? (int)$data['isPublished'] : 0;
        
        $stmt = $this->pdo->prepare("UPDATE podcasts SET is_published = ? WHERE id = ?");
        $stmt->execute([$isPublished, $id]);
        
        if ($stmt->rowCount() > 0) {
            $stmt = $this->pdo->prepare("SELECT * FROM podcasts WHERE id = ?");
            $stmt->execute([$id]);
            $podcast = $stmt->fetch();
            $podcast['_id'] = $podcast['id'];
            $podcast['tags'] = json_decode($podcast['tags'], true) ?: [];
            $podcast['isPublished'] = (bool)$podcast['is_published'];
            echo json_encode(['message' => 'Podcast publish status updated', 'podcast' => $podcast]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Podcast not found']);
        }
    }

    private function reorderPodcasts() {
        $data = json_decode(file_get_contents("php://input"), true);
        $orderedIds = $data['orderedIds'] ?? null;

        if (!$orderedIds && isset($data['podcasts'])) {
            $orderedIds = array_map(function($p) { return $p['_id'] ?? $p['id']; }, $data['podcasts']);
        }

        if (!is_array($orderedIds)) {
            http_response_code(400);
            echo json_encode(['message' => 'orderedIds array is required']);
            return;
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("UPDATE podcasts SET sort_order = ? WHERE id = ?");
            foreach ($orderedIds as $index => $id) {
                $stmt->execute([$index + 1, $id]);
            }
            $this->pdo->commit();
            $this->getAllPodcasts();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}
