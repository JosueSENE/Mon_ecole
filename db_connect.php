<?php
// db_connect.php - Connexion PDO sécurisée à la base de données MySQL de XAMPP de manière ultra-robuste

// 1. Charger la configuration locale si elle existe, pour respecter les informations de l'utilisateur
if (file_exists(__DIR__ . '/config.php')) {
    try {
        require_once 'config.php';
    } catch (Exception $e) {
        // Ignorer si config.php a un problème
    }
}

// 2. Définir les variables de connexion avec fallbacks
$host = defined('DB_HOST') ? DB_HOST : 'localhost';
$db_name = defined('DB_NAME') ? DB_NAME : 'SCHOOL';
$username = defined('DB_USER') ? DB_USER : 'root';
$password = defined('DB_PASS') ? DB_PASS : '';

try {
    // Tenter d'abord la connexion avec l'hôte spécifié. S'il s'agit de "localhost", essayer également "127.0.0.1" comme solution de repli instantanée.
    $hosts_to_try = [$host];
    if (strtolower($host) === 'localhost') {
        $hosts_to_try[] = '127.0.0.1';
    }

    $connected = false;
    $pdo_error = null;

    foreach ($hosts_to_try as $current_host) {
        try {
            // Connexion initiale sans base de données pour s'assurer que la base de données existe
            try {
                $pdo_init = new PDO("mysql:host=$current_host;charset=utf8mb4", $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 2, // Timeout court de 2 secondes
                ]);
                $pdo_init->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                $pdo_init = null;
            } catch (PDOException $init_ex) {
                // Ignorer l'échec d'initialisation de la base si les privilèges de création sont restreints
            }

            // Connexion principale sécurisée
            $pdo = new PDO("mysql:host=$current_host;dbname=$db_name;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 2,
            ]);

            $connected = true;
            $host = $current_host; // Sauvegarder l'hôte de connexion réussi
            break;
        } catch (PDOException $ex) {
            $pdo_error = $ex->getMessage();
        }
    }

    if (!$connected || !$pdo) {
        // Lever l'exception pour être interceptée par le catch principal ci-dessous
        throw new PDOException($pdo_error ?: "Impossible de se connecter aux hôtes spécifiés.");
    }

    // 5. Système d'auto-installation des tables si la table "students" n'existe pas
    $tables_exist = false;
    try {
        $chk = $pdo->query("SHOW TABLES LIKE 'students'");
        $tables_exist = (bool)$chk->fetch();
    } catch (PDOException $e) {
        $tables_exist = false;
    }

    if (!$tables_exist) {
        $sqlFile = __DIR__ . '/database.sql';
        if (file_exists($sqlFile)) {
            $sqlContent = file_get_contents($sqlFile);
            
            // Retirer les instructions de base d'origine "sunu_ecole" ou "SCHOOL" pour forcer le nom configuré
            $sqlContent = preg_replace('/DROP DATABASE IF EXISTS (sunu_ecole|SCHOOL);/i', '', $sqlContent);
            $sqlContent = preg_replace('/CREATE DATABASE (sunu_ecole|SCHOOL)[^;]*;/i', '', $sqlContent);
            $sqlContent = preg_replace('/USE (sunu_ecole|SCHOOL);/i', '', $sqlContent);

            $queries = explode(';', $sqlContent);
            $pdo->beginTransaction();
            foreach ($queries as $query) {
                $trimmedQuery = trim($query);
                if ($trimmedQuery !== '') {
                    try {
                        $pdo->exec($trimmedQuery);
                    } catch (PDOException $ex) {
                        // Ignorer les erreurs d'insertion de doublons ou de structure
                    }
                }
            }
            $pdo->commit();
        }
    }

    // 6. Ajuster les schémas existants si nécessaire (protection contre hachages tronqués)
    try {
        $pdo->exec("ALTER TABLE staff_users MODIFY COLUMN password_pin VARCHAR(255) NOT NULL");
    } catch (PDOException $ex) {}
    try {
        $pdo->exec("ALTER TABLE teachers MODIFY COLUMN invitation_code VARCHAR(255) NOT NULL");
    } catch (PDOException $ex) {}

} catch (PDOException $e) {
    // Au lieu d'étouffer le script ou d'afficher une erreur JSON ici, on stocke l'erreur et on laisse $pdo = null.
    // Cela permet aux scripts appelants d'adopter la réponse adéquate (JSON pour api.php, JS pour db_data.php).
    $pdo = null;
    $pdo_error = $e->getMessage();
}
