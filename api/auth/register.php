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
$nick = trim((string) ($payload['nick'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse([
        'status' => 'error',
        'message' => 'El email no es valido.',
    ], 400);
}

if (strlen($password) < 6) {
    jsonResponse([
        'status' => 'error',
        'message' => 'La contrasena debe tener al menos 6 caracteres.',
    ], 400);
}

if (strlen($nick) < 3) {
    jsonResponse([
        'status' => 'error',
        'message' => 'El nick debe tener al menos 3 caracteres.',
    ], 400);
}

try {
    $connection = databaseConnection();

    $existingUser = $connection->prepare(
        'SELECT id FROM usuarios WHERE email = :email OR nick = :nick LIMIT 1'
    );
    $existingUser->execute([
        'email' => $email,
        'nick' => $nick,
    ]);

    if ($existingUser->fetch()) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Ya existe un usuario con ese email o nick.',
        ], 409);
    }

    $insertUser = $connection->prepare(
        'INSERT INTO usuarios (email, nick, password) VALUES (:email, :nick, :password)'
    );
    $insertUser->execute([
        'email' => $email,
        'nick' => $nick,
        'password' => $password,
    ]);

    jsonResponse([
        'status' => 'ok',
        'message' => 'Usuario registrado correctamente.',
        'user' => [
            'id' => (int) $connection->lastInsertId(),
            'email' => $email,
            'nick' => $nick,
        ],
    ], 201);
} catch (Throwable $error) {
    jsonResponse([
        'status' => 'error',
        'message' => 'No se pudo registrar el usuario.',
        'detail' => $error->getMessage(),
    ], 500);
}

function sendCorsHeaders(): void
{
    $allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1'
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
