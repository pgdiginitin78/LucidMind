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
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $payload = $data['payload'] ?? ''; // They had some payload decryption logic, we'll try to support basic if needed, but the original mostly needed basic username/password.

        // If they still pass encrypted payload, we'd ideally decrypt it here.
        // Assuming they fallback to basic username/password if crypto isn't used, or we just handle standard login.
        
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
