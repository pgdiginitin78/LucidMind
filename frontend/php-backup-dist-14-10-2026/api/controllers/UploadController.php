<?php

class UploadController {
    public function handleRequest($method, $args) {
        if ($method === 'POST') {
            $this->uploadFile();
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function uploadFile() {
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No file provided']);
            return;
        }

        $file = $_FILES['file'];
        
        // 10MB limit
        if ($file['size'] > 10 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['error' => 'File size exceeds 10MB limit']);
            return;
        }
        // Ensure valid image extension (PNG, JPG, SVG, etc)
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(['error' => 'Unsupported file format. Only JPG, PNG, SVG, WEBP, and GIF are allowed.']);
            return;
        }
        // Use dirname(__DIR__, 2) to strictly get the directory above the api folder (public_html)
        $docRoot = dirname(__DIR__, 2);
        $targetDir = $docRoot . '/uploads';
        
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $cleanName = preg_replace('/[^a-zA-Z0-9.-]/', '_', basename($file['name']));
        $filename = time() . '-' . $cleanName;
        $targetFilePath = $targetDir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            chmod($targetFilePath, 0644); // Fix 403 Forbidden error on cPanel
            echo json_encode([
                'success' => true,
                'url' => '/uploads/' . $filename,
                'filename' => $filename
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to process upload']);
        }
    }
}
