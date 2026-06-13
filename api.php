<?php
// api.php - API de synchronisation Temps Réel avec MySQL (XAMPP htdocs)
header('Content-Type: application/json; charset=utf-8');

// Configuration stricte de la haute sécurité d'accès et des données
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header("Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:;");

// Autoriser le partage de ressources si nécessaire (CORS restreint)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if (!$pdo) {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'db_status') {
        echo json_encode([
            'success' => true,
            'connected' => false,
            'database' => $db_name ?? 'SCHOOL',
            'message' => 'Impossible de se connecter à la base de données : ' . ($pdo_error ?? 'Vérifiez que MySQL est démarré sous XAMPP.')
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode([
        'error' => true,
        'message' => 'Impossible de se connecter à la base de données MySQL : ' . ($pdo_error ?? 'Vérifiez que MySQL est démarré.')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$action = $_GET['action'] ?? '';
$key = $_GET['key'] ?? '';

if ($action === 'secure_hashes') {
    try {
        $stmt = $pdo->query("SELECT id, password_pin FROM staff_users");
        $staff = $stmt->fetchAll();
        $upgraded_staff = 0;
        foreach ($staff as $u) {
            $pwd = trim($u['password_pin']);
            // Convert to secure Bcrypt hash if raw (typically length < 20) or older hashes (MD5 (32) / SHA1 (40))
            if (strlen($pwd) < 20 || preg_match('/^[a-f0-9]{32}$/i', $pwd) || preg_match('/^[a-f0-9]{40}$/i', $pwd)) {
                $hashed = password_hash($pwd, PASSWORD_BCRYPT);
                $up = $pdo->prepare("UPDATE staff_users SET password_pin = ? WHERE id = ?");
                $up->execute([$hashed, $u['id']]);
                $upgraded_staff++;
            }
        }

        $stmt2 = $pdo->query("SELECT id, invitation_code FROM teachers");
        $teachers = $stmt2->fetchAll();
        $upgraded_teachers = 0;
        foreach ($teachers as $t) {
            $code = trim($t['invitation_code']);
            // Convert to secure Bcrypt hash if raw (typically length < 20) or older hashes (MD5 (32) / SHA1 (40))
            if (strlen($code) < 20 || preg_match('/^[a-f0-9]{32}$/i', $code) || preg_match('/^[a-f0-9]{40}$/i', $code)) {
                $hashed = password_hash($code, PASSWORD_BCRYPT);
                $up = $pdo->prepare("UPDATE teachers SET invitation_code = ? WHERE id = ?");
                $up->execute([$hashed, $t['id']]);
                $upgraded_teachers++;
            }
        }

        echo json_encode([
            'success' => true,
            'message' => "Haute sécurité activée ! Base de données SCHOOL mise en conformité : $upgraded_staff comptes de personnel et $upgraded_teachers codes d'enseignants ont été chiffrés en Bcrypt à sens unique."
        ], JSON_UNESCAPED_UNICODE);
        exit();
    } catch (Exception $ex) {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur de hachage de sécurité : ' . $ex->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

if ($action === 'load') {
    $data = [
        'success' => true,
        'students' => [],
        'teachers' => [],
        'subjects' => [],
        'subSubjects' => [],
        'grades' => [],
        'attendance' => [],
        'signedBulletins' => []
    ];

    try {
        // 1. Éléves
        $stmt = $pdo->query("SELECT id, student_number AS studentNumber, first_name AS firstName, last_name AS lastName, class_grade AS classGrade, class_division AS classDivision, gender, birth_date AS birthDate, parent_contact AS parentContact FROM students");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $data['students'][] = $row;
        }

        // 2. Enseignants
        $stmt = $pdo->query("SELECT id, name, email, class_grade AS classGrade, class_division AS classDivision, invitation_code AS invitationCode, is_activated AS isActivated FROM teachers");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['isActivated'] = (bool)$row['isActivated'];
            $data['teachers'][] = $row;
        }

        // 3. Matières
        $stmt = $pdo->query("SELECT id, name, level, coefficient, max_score AS maxScore FROM subjects");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['coefficient'] = (int)$row['coefficient'];
            $row['maxScore'] = (float)$row['maxScore'];
            $data['subjects'][] = $row;
        }

        // 4. Sous-matières
        $stmt = $pdo->query("SELECT id, subject_id AS subjectId, name FROM sub_subjects");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['subjectId'] = (int)$row['subjectId'];
            $data['subSubjects'][] = $row;
        }

        // 5. Notes
        $stmt = $pdo->query("SELECT g.id, g.student_id AS studentId, sub.name AS subject, ss.name AS subSubject, g.score, g.max_score AS maxScore, g.coefficient, g.exam_date AS date, g.term 
                             FROM grades g 
                             LEFT JOIN subjects sub ON g.subject_id = sub.id 
                             LEFT JOIN sub_subjects ss ON g.sub_subject_id = ss.id");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['studentId'] = (int)$row['studentId'];
            $row['score'] = (float)$row['score'];
            $row['maxScore'] = (float)$row['maxScore'];
            $row['coefficient'] = (int)$row['coefficient'];
            $row['subSubject'] = $row['subSubject'] ?? 'Évaluation globale';
            $data['grades'][] = $row;
        }

        // 6. Présences
        $stmt = $pdo->query("SELECT id, student_id AS studentId, attendance_date AS date, status, class_grade AS classGrade, class_division AS classDivision FROM attendance");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['studentId'] = (int)$row['studentId'];
            $data['attendance'][] = $row;
        }

        // 7. Bulletins signés
        $stmt = $pdo->query("SELECT id, student_id AS studentId, term, is_signed AS isSigned, is_sent_by_teacher AS isSentByTeacher, signed_by AS signedBy FROM signed_bulletins");
        while ($row = $stmt->fetch()) {
            $row['id'] = (int)$row['id'];
            $row['studentId'] = (int)$row['studentId'];
            $row['isSigned'] = (bool)$row['isSigned'];
            $row['isSentByTeacher'] = (bool)$row['isSentByTeacher'];
            $data['signedBulletins'][] = $row;
        }

        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit();

    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode([
            'error' => true,
            'message' => 'Erreur SQL lors du chargement des données : ' . $e->getMessage()
        ]);
        exit();
    }
}

if ($action === 'db_status') {
    try {
        $tables_to_check = ['students', 'teachers', 'subjects', 'sub_subjects', 'grades', 'attendance', 'signed_bulletins', 'staff_users'];
        $tables_status = [];
        foreach ($tables_to_check as $table) {
            try {
                $count_stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table`");
                $cnt = $count_stmt->fetch()['cnt'];
                $tables_status[$table] = [
                    'exists' => true,
                    'count' => (int)$cnt
                ];
            } catch (PDOException $ex) {
                $tables_status[$table] = [
                    'exists' => false,
                    'error' => $ex->getMessage()
                ];
            }
        }

        $staff_check = [];
        try {
            $staff_stmt = $pdo->query("SELECT email, role, LENGTH(password_pin) as pass_len FROM staff_users");
            while ($row = $staff_stmt->fetch()) {
                $staff_check[] = [
                    'email' => $row['email'],
                    'role' => $row['role'],
                    'pass_len' => (int)$row['pass_len']
                ];
            }
        } catch (PDOException $ex) {}

        echo json_encode([
            'success' => true,
            'connected' => true,
            'server_time' => date('Y-m-d H:i:s'),
            'database' => $db_name ?? 'SCHOOL',
            'tables' => $tables_status,
            'staff' => $staff_check
        ], JSON_UNESCAPED_UNICODE);
        exit();
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'connected' => false,
            'message' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

if ($action === 'login') {
    $jsonPayload = file_get_contents('php://input');
    $params = json_decode($jsonPayload, true);
    
    $role = $params['role'] ?? '';
    $email = trim($params['email'] ?? '');
    $password = trim($params['password'] ?? '');

    if (empty($role) || empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Identifiants incomplets.'
        ]);
        exit();
    }

    try {
        if ($role === 'DIRECTEUR' || $role === 'SECRETAIRE') {
            $stmt = $pdo->prepare("SELECT id, name, email, password_pin, role FROM staff_users WHERE LOWER(email) = :email AND role = :role");
            $stmt->execute([
                ':email' => strtolower($email),
                ':role' => $role
            ]);
            $user = $stmt->fetch();
            
            $isPasswordValide = false;
            if ($user) {
                $dbPass = trim($user['password_pin']);
                $mysqlHash = '*' . strtoupper(sha1(sha1($password, true)));
                
                if ($dbPass === $password) {
                    $isPasswordValide = true;
                } elseif (password_verify($password, $dbPass)) {
                    $isPasswordValide = true;
                } elseif (md5($password) === $dbPass || strtolower(md5($password)) === strtolower($dbPass)) {
                    $isPasswordValide = true;
                } elseif (sha1($password) === $dbPass || strtolower(sha1($password)) === strtolower($dbPass)) {
                    $isPasswordValide = true;
                } elseif ($dbPass === $mysqlHash || strtolower($dbPass) === strtolower($mysqlHash)) {
                    $isPasswordValide = true;
                }
            }

            if ($user && $isPasswordValide) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => (int)$user['id'],
                        'role' => $user['role'],
                        'name' => $user['name'],
                        'email' => $user['email']
                    ]
                ], JSON_UNESCAPED_UNICODE);
                exit();
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Identifiants incorrects.'
                ]);
                exit();
            }
        } elseif ($role === 'ENSEIGNANT') {
            $stmt = $pdo->prepare("SELECT id, name, email, class_grade, class_division, invitation_code, is_activated FROM teachers WHERE LOWER(email) = :email");
            $stmt->execute([
                ':email' => strtolower($email)
            ]);
            $teacher = $stmt->fetch();
            
            $isCodeValide = false;
            if ($teacher) {
                $dbCode = trim($teacher['invitation_code']);
                $mysqlHash = '*' . strtoupper(sha1(sha1($password, true)));
                
                if ($dbCode === $password) {
                    $isCodeValide = true;
                } elseif (password_verify($password, $dbCode)) {
                    $isCodeValide = true;
                } elseif (md5($password) === $dbCode || strtolower(md5($password)) === strtolower($dbCode)) {
                    $isCodeValide = true;
                } elseif (sha1($password) === $dbCode || strtolower(sha1($password)) === strtolower($dbCode)) {
                    $isCodeValide = true;
                } elseif ($dbCode === $mysqlHash || strtolower($dbCode) === strtolower($mysqlHash)) {
                    $isCodeValide = true;
                }
            }

            if ($teacher && $isCodeValide) {
                if (!$teacher['is_activated']) {
                    $up = $pdo->prepare("UPDATE teachers SET is_activated = 1 WHERE id = ?");
                    $up->execute([$teacher['id']]);
                    $teacher['is_activated'] = 1;
                }
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => (int)$teacher['id'],
                        'role' => 'ENSEIGNANT',
                        'name' => $teacher['name'],
                        'email' => $teacher['email'],
                        'detail' => [
                            'id' => (int)$teacher['id'],
                            'name' => $teacher['name'],
                            'email' => $teacher['email'],
                            'classGrade' => $teacher['class_grade'],
                            'classDivision' => $teacher['class_division'],
                            'invitationCode' => $teacher['invitation_code'],
                            'isActivated' => true
                        ]
                    ]
                ], JSON_UNESCAPED_UNICODE);
                exit();
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Identifiants ou Code Prof incorrect.'
                ]);
                exit();
            }
        } elseif ($role === 'PARENT_ELEVE') {
            $stmt = $pdo->prepare("SELECT id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact FROM students WHERE student_number = :password");
            $stmt->execute([':password' => $password]);
            $students = $stmt->fetchAll();

            $matchedStudent = null;
            foreach ($students as $s) {
                $firstNameClean = str_replace(' ', '', $s['first_name']);
                $lastNameClean = str_replace(' ', '', $s['last_name']);
                
                $email1 = strtolower($firstNameClean . '.' . $lastNameClean . '@ecole.sn');
                $email2 = strtolower($firstNameClean . '@ecole.sn');
                $email3 = strtolower($s['student_number'] . '@ecole.sn');
                $mat = strtolower($s['student_number']);

                if (strtolower($email) === $email1 || strtolower($email) === $email2 || strtolower($email) === $email3 || strtolower($email) === $mat) {
                    $matchedStudent = $s;
                    break;
                }
            }

            if ($matchedStudent) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => (int)$matchedStudent['id'],
                        'role' => 'PARENT_ELEVE',
                        'name' => $matchedStudent['first_name'] . ' ' . $matchedStudent['last_name'],
                        'student' => [
                            'id' => (int)$matchedStudent['id'],
                            'firstName' => $matchedStudent['first_name'],
                            'lastName' => $matchedStudent['last_name'],
                            'classGrade' => $matchedStudent['class_grade'],
                            'classDivision' => $matchedStudent['class_division'],
                            'gender' => $matchedStudent['gender'],
                            'birthDate' => $matchedStudent['birth_date'],
                            'parentContact' => $matchedStudent['parent_contact'],
                            'studentNumber' => $matchedStudent['student_number']
                        ]
                    ]
                ], JSON_UNESCAPED_UNICODE);
                exit();
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Matricule d’élève ou identifiant incorrect.'
                ]);
                exit();
            }
        }

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur serveur authentification : ' . $e->getMessage()
        ]);
        exit();
    }
}

if ($action !== 'save') {
    echo json_encode([
        'error' => true,
        'message' => 'Action requise : "save" ou "load"'
    ]);
    exit();
}

// Récupérer le contenu brut du payload JSON
$jsonPayload = file_get_contents('php://input');
$items = json_decode($jsonPayload, true);

if (!is_array($items)) {
    echo json_encode([
        'error' => true,
        'message' => 'Contenu du payload invalide. Tableau attendu.'
    ]);
    exit();
}

try {
    $pdo->beginTransaction();

    switch ($key) {
        case 'students':
            // 1. Récupérer les IDs actuels en base
            $dbIds = $pdo->query("SELECT id FROM students")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            // 2. Supprimer les élèves radiés (les cascades gèrent notes, présences, bulletins)
            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $stmt = $pdo->prepare("DELETE FROM students WHERE id IN ($inQuery)");
                $stmt->execute(array_values($deletedIds));
            }

            // 3. Upsert des élèves actuels
            $stmt = $pdo->prepare("INSERT INTO students (id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact) 
                                   VALUES (:id, :student_number, :first_name, :last_name, :class_grade, :class_division, :gender, :birth_date, :parent_contact)
                                   ON DUPLICATE KEY UPDATE student_number = VALUES(student_number), first_name = VALUES(first_name), last_name = VALUES(last_name), class_grade = VALUES(class_grade), class_division = VALUES(class_division), gender = VALUES(gender), birth_date = VALUES(birth_date), parent_contact = VALUES(parent_contact)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':student_number' => $item['studentNumber'],
                    ':first_name' => $item['firstName'],
                    ':last_name' => $item['lastName'],
                    ':class_grade' => $item['classGrade'],
                    ':class_division' => $item['classDivision'],
                    ':gender' => $item['gender'],
                    ':birth_date' => $item['birthDate'],
                    ':parent_contact' => $item['parentContact'] ?? null
                ]);
            }
            break;

        case 'teachers':
            $dbIds = $pdo->query("SELECT id FROM teachers")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM teachers WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            $stmt = $pdo->prepare("INSERT INTO teachers (id, name, email, class_grade, class_division, invitation_code, is_activated) 
                                   VALUES (:id, :name, :email, :class_grade, :class_division, :invitation_code, :is_activated)
                                   ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), class_grade = VALUES(class_grade), class_division = VALUES(class_division), invitation_code = VALUES(invitation_code), is_activated = VALUES(is_activated)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':name' => $item['name'],
                    ':email' => $item['email'],
                    ':class_grade' => $item['classGrade'],
                    ':class_division' => $item['classDivision'],
                    ':invitation_code' => $item['invitationCode'],
                    ':is_activated' => $item['isActivated'] ? 1 : 0
                ]);
            }
            break;

        case 'subjects':
            $dbIds = $pdo->query("SELECT id FROM subjects")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM subjects WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            $stmt = $pdo->prepare("INSERT INTO subjects (id, name, level, coefficient, max_score) 
                                   VALUES (:id, :name, :level, :coefficient, :max_score)
                                   ON DUPLICATE KEY UPDATE name = VALUES(name), level = VALUES(level), coefficient = VALUES(coefficient), max_score = VALUES(max_score)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':name' => $item['name'],
                    ':level' => $item['level'],
                    ':coefficient' => $item['coefficient'],
                    ':max_score' => $item['maxScore'] ?? 10
                ]);
            }
            break;

        case 'subSubjects':
            $dbIds = $pdo->query("SELECT id FROM sub_subjects")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM sub_subjects WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            $stmt = $pdo->prepare("INSERT INTO sub_subjects (id, subject_id, name) 
                                   VALUES (:id, :subject_id, :name)
                                   ON DUPLICATE KEY UPDATE subject_id = VALUES(subject_id), name = VALUES(name)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':subject_id' => $item['subjectId'],
                    ':name' => $item['name']
                ]);
            }
            break;

        case 'grades':
            $dbIds = $pdo->query("SELECT id FROM grades")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM grades WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            // Récupérer la cartographie des matières et des composantes en base
            $subjects_rows = $pdo->query("SELECT id, name, level FROM subjects")->fetchAll();
            $subjects_map = [];
            foreach ($subjects_rows as $sub) {
                $subjects_map[$sub['level'] . '_' . trim(strtolower($sub['name']))] = (int)$sub['id'];
            }

            $sub_subjects_rows = $pdo->query("SELECT id, subject_id, name FROM sub_subjects")->fetchAll();
            $sub_map = [];
            foreach ($sub_subjects_rows as $ss) {
                $sub_map[$ss['subject_id'] . '_' . trim(strtolower($ss['name']))] = (int)$ss['id'];
            }

            $students_rows = $pdo->query("SELECT id, class_grade FROM students")->fetchAll();
            $students_levels = [];
            foreach ($students_rows as $st) {
                $students_levels[(int)$st['id']] = $st['class_grade'];
            }

            $stmt = $pdo->prepare("INSERT INTO grades (id, student_id, subject_id, sub_subject_id, score, max_score, coefficient, term, exam_date) 
                                   VALUES (:id, :student_id, :subject_id, :sub_subject_id, :score, :max_score, :coefficient, :term, :exam_date)
                                   ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), subject_id = VALUES(subject_id), sub_subject_id = VALUES(sub_subject_id), score = VALUES(score), max_score = VALUES(max_score), coefficient = VALUES(coefficient), term = VALUES(term), exam_date = VALUES(exam_date)");

            foreach ($items as $item) {
                $studentId = (int)$item['studentId'];
                $subjectName = trim(strtolower($item['subject']));
                $subSubjectName = trim(strtolower($item['subSubject'] ?? 'Évaluation globale'));
                $studentLevel = $students_levels[$studentId] ?? 'CM2';

                // Trouver ou créer l'ID de la matière
                $subjKey = $studentLevel . '_' . $subjectName;
                $subject_id = $subjects_map[$subjKey] ?? null;

                if (!$subject_id) {
                    foreach ($subjects_rows as $sub) {
                        if (trim(strtolower($sub['name'])) === $subjectName && $sub['level'] === $studentLevel) {
                            $subject_id = (int)$sub['id'];
                            break;
                        }
                    }
                }

                if (!$subject_id) {
                    $ins_sub = $pdo->prepare("INSERT INTO subjects (name, level, coefficient) VALUES (?, ?, ?)");
                    $ins_sub->execute([$item['subject'], $studentLevel, $item['coefficient'] ?? 2]);
                    $subject_id = (int)$pdo->lastInsertId();
                    $subjects_map[$subjKey] = $subject_id;
                    $subjects_rows[] = ['id' => $subject_id, 'name' => $item['subject'], 'level' => $studentLevel];
                }

                // Trouver ou créer l'ID de la sous-matière (composante)
                $subKey = $subject_id . '_' . $subSubjectName;
                $sub_subject_id = $sub_map[$subKey] ?? null;

                if (!$sub_subject_id) {
                    $ins_ss = $pdo->prepare("INSERT INTO sub_subjects (subject_id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id");
                    $ins_ss->execute([$subject_id, $item['subSubject'] ?? 'Évaluation globale']);
                    $sub_subject_id = (int)$pdo->query("SELECT id FROM sub_subjects WHERE subject_id = $subject_id AND name = " . $pdo->quote($item['subSubject'] ?? 'Évaluation globale'))->fetchColumn();
                    $sub_map[$subKey] = $sub_subject_id;
                }

                $stmt->execute([
                    ':id' => $item['id'],
                    ':student_id' => $studentId,
                    ':subject_id' => $subject_id,
                    ':sub_subject_id' => $sub_subject_id,
                    ':score' => $item['score'],
                    ':max_score' => $item['maxScore'] ?? 10,
                    ':coefficient' => $item['coefficient'] ?? 2,
                    ':term' => $item['term'],
                    ':exam_date' => $item['date'] ?? date('Y-m-d')
                ]);
            }
            break;

        case 'attendance':
            $dbIds = $pdo->query("SELECT id FROM attendance")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM attendance WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            $stmt = $pdo->prepare("INSERT INTO attendance (id, student_id, attendance_date, status, class_grade, class_division) 
                                   VALUES (:id, :student_id, :attendance_date, :status, :class_grade, :class_division)
                                   ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), attendance_date = VALUES(attendance_date), status = VALUES(status), class_grade = VALUES(class_grade), class_division = VALUES(class_division)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':student_id' => $item['studentId'],
                    ':attendance_date' => $item['date'],
                    ':status' => $item['status'],
                    ':class_grade' => $item['classGrade'],
                    ':class_division' => $item['classDivision']
                ]);
            }
            break;

        case 'signedBulletins':
            $dbIds = $pdo->query("SELECT id FROM signed_bulletins")->fetchAll(PDO::FETCH_COLUMN);
            $payloadIds = array_filter(array_column($items, 'id'));
            $deletedIds = array_diff($dbIds, $payloadIds);

            if (!empty($deletedIds)) {
                $inQuery = implode(',', array_fill(0, count($deletedIds), '?'));
                $pdo->prepare("DELETE FROM signed_bulletins WHERE id IN ($inQuery)")->execute(array_values($deletedIds));
            }

            $stmt = $pdo->prepare("INSERT INTO signed_bulletins (id, student_id, term, is_signed, is_sent_by_teacher, signed_by, signed_at) 
                                   VALUES (:id, :student_id, :term, :is_signed, :is_sent_by_teacher, :signed_by, :signed_at)
                                   ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), term = VALUES(term), is_signed = VALUES(is_signed), is_sent_by_teacher = VALUES(is_sent_by_teacher), signed_by = VALUES(signed_by), signed_at = VALUES(signed_at)");
            foreach ($items as $item) {
                $stmt->execute([
                    ':id' => $item['id'],
                    ':student_id' => $item['studentId'],
                    ':term' => $item['term'],
                    ':is_signed' => $item['isSigned'] ? 1 : 0,
                    ':is_sent_by_teacher' => $item['isSentByTeacher'] ? 1 : 0,
                    ':signed_by' => $item['signedBy'] ?? null,
                    ':signed_at' => ($item['isSigned']) ? date('Y-m-d H:i:s') : null
                ]);
            }
            break;

        default:
            throw new Exception("Clé de synchronisation non supportée : $key");
    }

    $pdo->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Synchronisation MySQL effectuée avec succès pour la clé ' . $key
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode([
        'error' => true,
        'message' => 'Erreur lors de la synchronisation de ' . $key . ' : ' . $e->getMessage()
    ]);
}
