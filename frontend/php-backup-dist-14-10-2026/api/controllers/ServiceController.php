<?php

class ServiceController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function handleRequest($method, $args) {
        $idOrSlug = $args[0] ?? null;

        if ($method === 'GET' && !$idOrSlug) {
            $this->getAllServices();
        } else if ($method === 'POST') {
            authenticate();
            $this->createService();
        } else if ($method === 'PUT' && $idOrSlug === 'reorder') {
            authenticate();
            $this->reorderServices();
        } else if ($method === 'PUT' && $idOrSlug) {
            authenticate();
            $this->updateService($idOrSlug);
        } else if ($method === 'DELETE' && $idOrSlug) {
            authenticate();
            $this->deleteService($idOrSlug);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function getAllServices() {
        $stmt = $this->pdo->prepare("SELECT * FROM services ORDER BY sort_order ASC, created_at DESC");
        $stmt->execute();
        $services = $stmt->fetchAll();
        
        foreach ($services as &$service) {
            $service['_id'] = $service['id'];
            $service['features'] = json_decode($service['features'], true) ?: [];
            $service['isActive'] = (bool)$service['is_active'];
            $service['realProblem'] = $service['real_problem'];
            $service['successLooksLike'] = $service['success_looks_like'];
        }

        echo json_encode(['services' => $services]);
    }

    private function slugify($text) {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9-]/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }

    private function createService() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['title'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Title is required']);
            return;
        }

        $id = uniqid('srv_');
        $slug = !empty($data['slug']) ? $data['slug'] : $this->slugify($data['title']);
        $subtitle = $data['subtitle'] ?? '';
        $category = $data['category'] ?? 'Phase 1: Getting Started';
        $realProblem = $data['realProblem'] ?? '';
        $description = $data['description'] ?? '';
        
        $features = $data['features'] ?? [];
        if (is_string($features)) {
            $features = array_filter(array_map('trim', explode(',', $features)));
        }
        $featuresJson = json_encode(array_values($features));

        $successLooksLike = $data['successLooksLike'] ?? '';
        $icon = $data['icon'] ?? 'Rocket';
        $image = $data['image'] ?? '';
        $isActive = isset($data['isActive']) ? (int)$data['isActive'] : 1;
        $order = $data['order'] ?? 0;

        $stmt = $this->pdo->prepare("INSERT INTO services (id, title, slug, subtitle, category, real_problem, description, features, success_looks_like, icon, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        try {
            $stmt->execute([$id, $data['title'], $slug, $subtitle, $category, $realProblem, $description, $featuresJson, $successLooksLike, $icon, $image, $isActive, $order]);
            $service = $data;
            $service['_id'] = $id;
            $service['features'] = $features;
            http_response_code(201);
            echo json_encode(['message' => 'Service created', 'service' => $service]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function updateService($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $fields = [];
        $values = [];

        $mapping = [
            'title' => 'title',
            'slug' => 'slug',
            'subtitle' => 'subtitle',
            'category' => 'category',
            'realProblem' => 'real_problem',
            'description' => 'description',
            'successLooksLike' => 'success_looks_like',
            'icon' => 'icon',
            'image' => 'image',
            'order' => 'sort_order'
        ];

        foreach ($mapping as $jsonKey => $dbKey) {
            if (isset($data[$jsonKey])) {
                $fields[] = "$dbKey = ?";
                $values[] = $data[$jsonKey];
            }
        }

        if (isset($data['isActive'])) {
            $fields[] = "is_active = ?";
            $values[] = (int)$data['isActive'];
        }

        if (isset($data['features'])) {
            $features = $data['features'];
            if (is_string($features)) {
                $features = array_filter(array_map('trim', explode(',', $features)));
            }
            $fields[] = "features = ?";
            $values[] = json_encode(array_values($features));
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['message' => 'No fields to update']);
            return;
        }

        $values[] = $id;
        $sql = "UPDATE services SET " . implode(', ', $fields) . " WHERE id = ?";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            if ($stmt->rowCount() > 0) {
                // Fetch the updated service
                $stmt = $this->pdo->prepare("SELECT * FROM services WHERE id = ?");
                $stmt->execute([$id]);
                $service = $stmt->fetch();
                $service['_id'] = $service['id'];
                $service['features'] = json_decode($service['features'], true) ?: [];
                echo json_encode(['message' => 'Service updated', 'service' => $service]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Service not found or no changes made']);
            }
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function deleteService($id) {
        $stmt = $this->pdo->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Service deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Service not found']);
        }
    }

    private function reorderServices() {
        $data = json_decode(file_get_contents("php://input"), true);
        $orderedIds = $data['orderedIds'] ?? null;

        if (!$orderedIds && isset($data['services'])) {
            $orderedIds = array_map(function($s) { return $s['_id'] ?? $s['id']; }, $data['services']);
        }

        if (!is_array($orderedIds)) {
            http_response_code(400);
            echo json_encode(['message' => 'orderedIds array is required']);
            return;
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("UPDATE services SET sort_order = ? WHERE id = ?");
            foreach ($orderedIds as $index => $id) {
                $stmt->execute([$index + 1, $id]);
            }
            $this->pdo->commit();
            $this->getAllServices();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}
