<?php
// db_data.php - Flux de données synchrone pour alimenter le cache d'état JS (window.db)
header('Content-Type: application/javascript; charset=utf-8');
require_once 'db_connect.php';

if (!$pdo) {
    echo "console.warn('⚠️ Base de données MySQL de XAMPP hors ligne. Fonctionnement autonome en cache local LocalStorage.');\n";
    echo "window.MYSQL_DB = null;\n";
    exit();
}

$data = [
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

    // 5. Notes (Jointure sur les matières et sous-matières)
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

    // 6. Présences (Appel)
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

} catch (Exception $e) {
    echo "console.error('Erreur SQL de récupération des données : " . addslashes($e->getMessage()) . "');\n";
}

// Injection des données dans l'objet global du navigateur
echo "window.MYSQL_DB = " . json_encode($data, JSON_UNESCAPED_UNICODE) . ";\n";
