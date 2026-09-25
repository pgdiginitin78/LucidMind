<?php

class AuthController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function handleRequest($method, $args) {
        $action = $args[0] ?? '';

        if ($method === 'POST' && $action === 'login') {
            $this->login();
        } else if ($method === 'GET' && $action === 'me') {
            $this->getMe();
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        $SECRET_KEY = getenv('PAYLOAD_SECRET') ?: 'lucidmind_payload_secret_key_2026';

        $username = '';
        $password = '';

        // Decrypt the encrypted payload from the frontend (CryptoJS AES)
        if (!empty($data['payload'])) {
            $decrypted = $this->decryptCryptoJsAES($data['payload'], $SECRET_KEY);
            if ($decrypted) {
                $decoded = json_decode($decrypted, true);
                $username = isset($decoded['username']) ? trim($decoded['username']) : '';
                $password = $decoded['password'] ?? '';
            }
        }

        // Fallback to plaintext (backward compat / dev mode)
        if (empty($username)) $username = trim($data['username'] ?? '');
        if (empty($password)) $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Username and password are required']);
            return;
        }

        $stmt = $this->pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $secret = getenv('JWT_SECRET') ?: 'default_jwt_secret_change_in_production';
            $payload = [
                'id' => $user['id'],
                'username' => $user['username'],
                'iat' => time(),
                'exp' => time() + (86400 * 30) // 30 days
            ];
            $token = JWT::encode($payload, $secret);
            
            echo json_encode([
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid username or password']);
        }
    }

    /**
     * Decrypt a CryptoJS AES-encrypted string (OpenSSL-compatible)
     * CryptoJS uses: "Salted__" + 8-byte salt + ciphertext (Base64 encoded)
     */
    private function decryptCryptoJsAES(string $ciphertext, string $passphrase): ?string {
        try {
            $ciphertext = base64_decode($ciphertext);
            if (substr($ciphertext, 0, 8) !== 'Salted__') return null;

            $salt       = substr($ciphertext, 8, 8);
            $ciphertext = substr($ciphertext, 16);

            // Derive key (32 bytes) and IV (16 bytes) via MD5 like CryptoJS does
            $derived = '';
            $prev    = '';
            while (strlen($derived) < 48) {
                $prev    = md5($prev . $passphrase . $salt, true);
                $derived .= $prev;
            }

            $key       = substr($derived, 0, 32);
            $iv        = substr($derived, 32, 16);
            $decrypted = openssl_decrypt($ciphertext, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);

            return $decrypted !== false ? $decrypted : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function getMe() {
        $user = authenticate();
        
        $stmt = $this->pdo->prepare("SELECT id, username FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $dbUser = $stmt->fetch();

        if ($dbUser) {
            echo json_encode(['user' => $dbUser]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    }
}
