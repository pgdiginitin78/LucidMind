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

        $uploadDir = __DIR__ . '/../../public_html/uploads'; // Assuming standard cPanel structure (or just ../uploads if in root)
        // Check if we are in public_html/api or similar
        // Let's use a safe relative path.
        // We will default to a local 'uploads' directory if public_html doesn't exist.
        $targetDir = realpath(__DIR__ . '/../../uploads'); // Up to project root -> uploads
        if (!$targetDir) {
            $targetDir = __DIR__ . '/../../uploads';
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }
        }

        $cleanName = preg_replace('/[^a-zA-Z0-9.-]/', '_', basename($file['name']));
        $filename = time() . '-' . $cleanName;
        $targetFilePath = $targetDir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
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
