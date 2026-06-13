<?php
/**
 * Configuration de la Base de Données "SCHOOL" pour XAMPP
 * Sunu École — Suite Moderne de Gestion d'Établissement
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'SCHOOL');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHAR', 'utf8mb4');

// En-têtes CORS pour autoriser l'accès depuis d'autres appareils connectés au même réseau Wifi (ex: iPhone, Tablettes)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

