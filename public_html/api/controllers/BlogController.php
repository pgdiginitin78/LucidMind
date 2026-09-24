<?php

class BlogController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function handleRequest($method, $args) {
        $idOrSlug = $args[0] ?? null;
        $action = $args[1] ?? null;

        if ($method === 'GET' && !$idOrSlug) {
            $this->getAllBlogs();
        } else if ($method === 'GET' && $idOrSlug) {
            $this->getBlogByIdOrSlug($idOrSlug);
        } else if ($method === 'POST') {
            authenticate();
            $this->createBlog();
        } else if ($method === 'PUT' && $idOrSlug === 'reorder') {
            authenticate();
            $this->reorderBlogs();
        } else if ($method === 'PUT' && $idOrSlug) {
            authenticate();
            $this->updateBlog($idOrSlug);
        } else if ($method === 'DELETE' && $idOrSlug) {
            authenticate();
            $this->deleteBlog($idOrSlug);
        } else if ($method === 'PATCH' && $action === 'publish') {
            authenticate();
            $this->publishBlog($idOrSlug);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function getAllBlogs() {
        $stmt = $this->pdo->prepare("SELECT * FROM blogs ORDER BY sort_order ASC, created_at DESC");
        $stmt->execute();
        $blogs = $stmt->fetchAll();
        
        foreach ($blogs as &$blog) {
            $blog['_id'] = $blog['id'];
            $blog['tags'] = json_decode($blog['tags'], true) ?: [];
            $blog['isPublished'] = (bool)$blog['is_published'];
            $blog['authorRole'] = $blog['author_role'];
            $blog['readTime'] = $blog['read_time'];
            $blog['coverImage'] = $blog['cover_image'];
        }

        echo json_encode(['blogs' => $blogs]);
    }

    private function getBlogByIdOrSlug($idOrSlug) {
        $stmt = $this->pdo->prepare("SELECT * FROM blogs WHERE id = ? OR slug = ?");
        $stmt->execute([$idOrSlug, $idOrSlug]);
        $blog = $stmt->fetch();

        if ($blog) {
            $blog['_id'] = $blog['id'];
            $blog['tags'] = json_decode($blog['tags'], true) ?: [];
            $blog['isPublished'] = (bool)$blog['is_published'];
            $blog['authorRole'] = $blog['author_role'];
            $blog['readTime'] = $blog['read_time'];
            $blog['coverImage'] = $blog['cover_image'];
            echo json_encode(['blog' => $blog]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Blog not found']);
        }
    }

    private function slugify($text) {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9-]/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }

    private function createBlog() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['title'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Title is required']);
            return;
        }

        $id = uniqid('blog_');
        $slug = !empty($data['slug']) ? $data['slug'] : $this->slugify($data['title']);
        $tag = $data['tag'] ?? 'MINDSET';
        $category = $data['category'] ?? $tag;
        $author = $data['author'] ?? 'Ravishankar Pingali';
        $authorRole = $data['authorRole'] ?? 'Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor';
        $readTime = $data['readTime'] ?? '3 MIN READ';
        $date = $data['date'] ?? date('F j, Y');
        $excerpt = $data['excerpt'] ?? $data['description'] ?? '';
        $description = $data['description'] ?? $excerpt;
        $content = $data['content'] ?? '';
        $image = $data['image'] ?? $data['coverImage'] ?? '';
        $coverImage = $data['coverImage'] ?? $image;
        $isPublished = isset($data['isPublished']) ? (int)$data['isPublished'] : 1;
        $tags = isset($data['tags']) && is_array($data['tags']) ? json_encode($data['tags']) : json_encode([]);

        $stmt = $this->pdo->prepare("INSERT INTO blogs (id, title, slug, tag, category, author, author_role, read_time, date, excerpt, description, content, image, cover_image, is_published, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        try {
            $stmt->execute([$id, $data['title'], $slug, $tag, $category, $author, $authorRole, $readTime, $date, $excerpt, $description, $content, $image, $coverImage, $isPublished, $tags]);
            $blog = $data;
            $blog['_id'] = $id;
            http_response_code(201);
            echo json_encode(['message' => 'Blog created', 'blog' => $blog]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function updateBlog($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $fields = [];
        $values = [];

        $mapping = [
            'title' => 'title',
            'slug' => 'slug',
            'tag' => 'tag',
            'category' => 'category',
            'author' => 'author',
            'authorRole' => 'author_role',
            'readTime' => 'read_time',
            'date' => 'date',
            'excerpt' => 'excerpt',
            'description' => 'description',
            'content' => 'content',
            'image' => 'image',
            'coverImage' => 'cover_image'
        ];

        if (isset($data['title']) && !isset($data['slug'])) {
            $data['slug'] = $this->slugify($data['title']);
        }

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
        $sql = "UPDATE blogs SET " . implode(', ', $fields) . " WHERE id = ?";
        
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            if ($stmt->rowCount() > 0) {
                // Fetch the updated blog
                $stmt = $this->pdo->prepare("SELECT * FROM blogs WHERE id = ?");
                $stmt->execute([$id]);
                $blog = $stmt->fetch();
                $blog['_id'] = $blog['id'];
                $blog['tags'] = json_decode($blog['tags'], true) ?: [];
                $blog['authorRole'] = $blog['author_role'];
                $blog['readTime'] = $blog['read_time'];
                $blog['coverImage'] = $blog['cover_image'];
                $blog['isPublished'] = (bool)$blog['is_published'];
                echo json_encode(['message' => 'Blog updated', 'blog' => $blog]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Blog not found or no changes made']);
            }
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    private function deleteBlog($id) {
        $stmt = $this->pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Blog deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Blog not found']);
        }
    }

    private function publishBlog($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $isPublished = isset($data['isPublished']) ? (int)$data['isPublished'] : 0;
        
        $stmt = $this->pdo->prepare("UPDATE blogs SET is_published = ? WHERE id = ?");
        $stmt->execute([$isPublished, $id]);
        
        if ($stmt->rowCount() > 0) {
            $stmt = $this->pdo->prepare("SELECT * FROM blogs WHERE id = ?");
            $stmt->execute([$id]);
            $blog = $stmt->fetch();
            $blog['_id'] = $blog['id'];
            $blog['tags'] = json_decode($blog['tags'], true) ?: [];
            $blog['isPublished'] = (bool)$blog['is_published'];
            echo json_encode(['message' => 'Blog publish status updated', 'blog' => $blog]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Blog not found']);
        }
    }

    private function reorderBlogs() {
        $data = json_decode(file_get_contents("php://input"), true);
        $orderedIds = $data['orderedIds'] ?? null;

        if (!$orderedIds && isset($data['blogs'])) {
            $orderedIds = array_map(function($b) { return $b['_id'] ?? $b['id']; }, $data['blogs']);
        }

        if (!is_array($orderedIds)) {
            http_response_code(400);
            echo json_encode(['message' => 'orderedIds array is required']);
            return;
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("UPDATE blogs SET sort_order = ? WHERE id = ?");
            foreach ($orderedIds as $index => $id) {
                $stmt->execute([$index + 1, $id]);
            }
            $this->pdo->commit();
            $this->getAllBlogs();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}
