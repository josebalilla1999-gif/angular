<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conexion = new mysqli(
    "localhost",
    "root",
    "",
    "sistema_reservaciones"
);

if ($conexion->connect_error) {
    die("Error de conexión");
}

$sql = "SELECT * FROM vuelos";
$resultado = $conexion->query($sql);

$vuelos = [];

while ($fila = $resultado->fetch_assoc()) {
    $vuelos[] = $fila;
}

echo json_encode($vuelos);

$conexion->close();
?>