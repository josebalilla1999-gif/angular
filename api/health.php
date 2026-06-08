<?php
declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once __DIR__ . '/config/database.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse([
        'status' => 'error',
        'message' => 'Metodo no permitido.',
    ], 405);
}

try {
    $connection = databaseConnection();
    $database = databaseName();

    $version = $connection->query('SELECT VERSION() AS version')->fetch();

    $tables = $connection->prepare(
        'SELECT COUNT(*) AS total
         FROM information_schema.tables
         WHERE table_schema = :database'
    );
    $tables->execute(['database' => $database]);
    $tableCount = $tables->fetch();

    jsonResponse([
        'status' => 'ok',
        'database' => $database,
        'tables' => (int) ($tableCount['total'] ?? 0),
        'serverVersion' => $version['version'] ?? null,
        'checkedAt' => (new DateTimeImmutable('now', new DateTimeZone('UTC')))
            ->format(DateTimeInterface::ATOM),
    ]);
} catch (Throwable $error) {
    jsonResponse([
        'status' => 'error',
        'database' => databaseName(),
        'message' => 'No se pudo conectar con la base de datos.',
        'detail' => $error->getMessage(),
    ], 500);
}

function sendCorsHeaders(): void
{
    $allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}
