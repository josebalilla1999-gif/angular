<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'status' => 'error',
        'message' => 'Metodo no permitido.',
    ], 405);
}

$payload = readJsonBody();
$email = trim((string) ($payload['email'] ?? ''));
$password = (string) ($payload['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse([
        'status' => 'error',
        'message' => 'El email no es valido.',
    ], 400);
}

if ($password === '') {
    jsonResponse([
        'status' => 'error',
        'message' => 'La contrasena es obligatoria.',
    ], 400);
}

try {
    $connection = databaseConnection();

    $statement = $connection->prepare(
        'SELECT id, email, nick, password_hash FROM usuarios WHERE email = :email LIMIT 1'
    );
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, (string) $user['password_hash'])) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Email o contrasena incorrectos.',
        ], 401);
    }

    jsonResponse([
        'status' => 'ok',
        'message' => 'Login correcto.',
        'user' => [
            'id' => (int) $user['id'],
            'email' => (string) $user['email'],
            'nick' => (string) $user['nick'],
        ],
    ]);
} catch (Throwable $error) {
    jsonResponse([
        'status' => 'error',
        'message' => 'No se pudo iniciar sesion.',
        'detail' => $error->getMessage(),
    ], 500);
}

function sendCorsHeaders(): void
{
    $allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
        'http://localhost:4200',
        'http://127.0.0.1:4200',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

function readJsonBody(): array
{
    $body = file_get_contents('php://input');

    if ($body === false || trim($body) === '') {
        jsonResponse([
            'status' => 'error',
            'message' => 'El cuerpo de la peticion esta vacio.',
        ], 400);
    }

    $payload = json_decode($body, true);

    if (!is_array($payload)) {
        jsonResponse([
            'status' => 'error',
            'message' => 'El JSON recibido no es valido.',
        ], 400);
    }

    return $payload;
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}