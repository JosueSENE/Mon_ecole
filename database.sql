-- ================================================================================
--           SUITE DE GESTION SCOLAIRE "SUNU ÉCOLE" — BASE DE DONNÉES SQL
-- ================================================================================
-- Ce fichier contient le schéma complet de la base de données (DDL) pour MySQL/MariaDB
-- (compatible XAMPP htdocs) ainsi que l'ensemble des requêtes d'interaction requises.
-- ================================================================================

-- --------------------------------------------------------------------------------
-- 1. INITIALISATION DE LA BASE DE DONNÉES
-- --------------------------------------------------------------------------------
DROP DATABASE IF EXISTS SCHOOL;
CREATE DATABASE SCHOOL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE SCHOOL;

-- --------------------------------------------------------------------------------
-- 2. CRÉATION DES TABLES (SCHÉMAS RELATIONNELS)
-- --------------------------------------------------------------------------------

-- Table 1: ÉLÈVES (students)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_number VARCHAR(20) NOT NULL UNIQUE, -- Matricule (ex: SN-2026-001)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    class_grade VARCHAR(10) NOT NULL,          -- Niveau (CI, CP, CE1, CE2, CM1, CM2)
    class_division VARCHAR(5) NOT NULL,        -- Division / Section (A, B, C)
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    birth_date DATE NOT NULL,
    parent_contact VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_class (class_grade, class_division),
    INDEX idx_matricule (student_number)
) ENGINE=InnoDB;

-- Table 2: ENSEIGNANTS (teachers)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    class_grade VARCHAR(10) NOT NULL,          -- Classe assignée (ex: CM2)
    class_division VARCHAR(5) NOT NULL,        -- Division (ex: A)
    invitation_code VARCHAR(255) NOT NULL,     -- DÉMO PIN / CODE PROF d'accès (ex: PROF-ABC123)
    is_activated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_teacher_email (email)
) ENGINE=InnoDB;

-- Table 3: ADMINISTRATEURS / SECRÉTAIRES (administrators)
-- Utilisé pour la centralisation des accès Directeurs et Secrétaires
CREATE TABLE IF NOT EXISTS staff_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_pin VARCHAR(255) NOT NULL,        -- Code PIN (ex: 1234 pour Directeur, 5678 pour Secrétaire)
    role VARCHAR(30) NOT NULL CHECK (role IN ('DIRECTEUR', 'SECRETAIRE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 4: MATIÈRES DE L'ÉCOLE PRIMAIRE SÉNÉGALAISE (subjects)
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,                -- Ex: "Langue et Communication", "Mathématiques"
    level VARCHAR(10) NOT NULL,                -- Niveau visé (ex: CM2, CE2)
    coefficient INT NOT NULL DEFAULT 1,        -- Coefficient pour le calcul de la moyenne sénégalaise
    max_score DECIMAL(5,2) NOT NULL DEFAULT 10.00, -- Barème max (Sénégal: Généralement sur 10 au primaire)
    UNIQUE KEY uq_subject_level (name, level)
) ENGINE=InnoDB;

-- Table 5: COMPOSANTES / SOUS-MATIÈRES (sub_subjects)
CREATE TABLE IF NOT EXISTS sub_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,                -- Ex: "Calcul en ligne", "Dictée / Orthographe", "Récitation"
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY uq_sub_subject (subject_id, name)
) ENGINE=InnoDB;

-- Table 6: SAISIE DES NOTES (grades)
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,                  -- Référence à la matière parente
    sub_subject_id INT NOT NULL,              -- Référence à la composante / sous-matière
    score DECIMAL(4,2) NOT NULL,               -- Note de l'élève (ex: 8.50)
    max_score DECIMAL(4,2) NOT NULL DEFAULT 10.00, -- Barème maximum (ex: 10.00)
    coefficient INT NOT NULL DEFAULT 1,        -- Coefficient applicable à cette note
    term VARCHAR(25) NOT NULL,                 -- Trimestre (ex: "1er Trimestre", "2e Trimestre", "3e Trimestre")
    exam_date DATE NOT NULL,                   -- Date de l'évaluation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
    FOREIGN KEY (sub_subject_id) REFERENCES sub_subjects(id) ON DELETE RESTRICT,
    INDEX idx_student_grades (student_id, term),
    INDEX idx_subject_term (subject_id, term)
) ENGINE=InnoDB;

-- Table 7: CAHIER D'APPEL / PRÉSENCES (attendance)
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('Présent', 'Absent', 'Retard')),
    class_grade VARCHAR(10) NOT NULL,          -- Redondance contrôlée pour filtres rapides
    class_division VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_daily_attendance (student_id, attendance_date),
    INDEX idx_class_date (class_grade, class_division, attendance_date)
) ENGINE=InnoDB;

-- Table 8: BULLETINS VALIDÉS ET VISÉS (signed_bulletins)
CREATE TABLE IF NOT EXISTS signed_bulletins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    term VARCHAR(25) NOT NULL,
    is_sent_by_teacher BOOLEAN DEFAULT FALSE,  -- Transmis au secrétariat / direction
    is_signed BOOLEAN DEFAULT FALSE,           -- Visé par le directeur
    signed_by VARCHAR(150) NULL,               -- Nom de l'autorité signataire (ex: "M. le Directeur Kane")
    signed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_term_bulletin (student_id, term)
) ENGINE=InnoDB;


-- --------------------------------------------------------------------------------
-- 3. ALIMENTATION DES DONNÉES DE JEU DÉMO (SYNCHRONISATION DATA.JS)
-- --------------------------------------------------------------------------------

-- Insertion Table: staff_users (Compte Directeur & Secrétaire)
INSERT INTO staff_users (name, email, password_pin, role) VALUES 
('M. le Directeur Kane', 'directeur@sunuecole.sn', '1234', 'DIRECTEUR'),
('Awa Ndiaye (Secrétariat)', 'secretaire@sunuecole.sn', '5678', 'SECRETAIRE');

-- Insertion Table: students (8 Élèves d'origine)
INSERT INTO students (id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact) VALUES
(1, 'SN-2026-001', 'Abdoulaye', 'NDIAYE', 'CM2', 'A', 'M', '2015-04-12', '+221 77 123 45 67'),
(2, 'SN-2026-002', 'Aïssatou', 'DIOP', 'CM2', 'A', 'F', '2015-08-22', '+221 78 456 12 89'),
(3, 'SN-2026-003', 'Moussa', 'SOW', 'CM2', 'B', 'M', '2015-01-05', '+221 76 999 88 77'),
(4, 'SN-2026-004', 'Fatou', 'DIOME', 'CE2', 'A', 'F', '2017-11-14', '+221 77 345 88 11'),
(5, 'SN-2026-005', 'Ibrahima', 'GUEYE', 'CE2', 'B', 'M', '2017-09-30', '+221 70 888 22 33'),
(6, 'SN-2026-006', 'Mariama', 'DIALLO', 'CE1', 'A', 'F', '2018-05-18', '+221 77 555 11 22'),
(7, 'SN-2026-007', 'Ousmane', 'FALL', 'CP', 'A', 'M', '2019-02-25', '+221 76 111 22 33'),
(8, 'SN-2026-008', 'Aminata', 'WADE', 'CI', 'A', 'F', '2020-07-03', '+221 77 222 44 66');

-- Insertion Table: teachers (2 Enseignants d'origine)
INSERT INTO teachers (id, name, email, class_grade, class_division, invitation_code, is_activated) VALUES
(1, 'M. Fall', 'fall@ecole.sn', 'CM2', 'A', 'PROF-ABC123', TRUE),
(2, 'Mme Diouf', 'diouf@ecole.sn', 'CE2', 'A', 'PROF-CE2XYZ', FALSE);

-- Insertion Table: subjects (CM2 & CE2)
INSERT INTO subjects (id, name, level, coefficient, max_score) VALUES
-- Matières CM2
(1, 'Langue et Communication', 'CM2', 3, 10.00),
(2, 'Mathématiques', 'CM2', 3, 10.00),
(3, 'Éducation à la Science et au Milieu', 'CM2', 2, 10.00),
(4, 'Arts Plastiques & Éducation Physique', 'CM2', 1, 10.00),
-- Matières CE2
(5, 'Langue et Communication', 'CE2', 3, 10.00),
(6, 'Mathématiques', 'CE2', 3, 10.00),
(7, 'Éducation à la Science et au Milieu', 'CE2', 2, 10.00),
(8, 'Arts Plastiques & Éducation Physique', 'CE2', 1, 10.00);

-- Insertion Table: sub_subjects (Composantes liées)
INSERT INTO sub_subjects (id, subject_id, name) VALUES
-- Pour Matière 1 (Langue et Com - CM2)
(1, 1, 'Lecture / Compréhension'),
(2, 1, 'Dictée / Orthographe'),
(3, 1, 'Grammaire / Conjugaison'),
(4, 1, 'Récitation'),
-- Pour Matière 2 (Maths - CM2)
(5, 2, 'Calcul en ligne'),
(6, 2, 'Opérations posées'),
(7, 2, 'Résolution de Problèmes'),
-- Pour Matière 3 (Éduc Science - CM2)
(8, 3, 'Histoire'),
(9, 3, 'Géographie'),
(10, 3, 'Sciences d\'observation'),
-- Pour Matière 4 (Arts/EPS - CM2)
(11, 4, 'Dessin & Ecriture'),
(12, 4, 'Pratiques Physiques'),
-- Pour Matière 5 (Langue et Com - CE2)
(13, 5, 'Lecture / Compréhension'),
(14, 5, 'Dictée / Orthographe'),
-- Pour Matière 6 (Maths - CE2)
(15, 6, 'Calcul en ligne'),
-- Pour Matière 7 (Éduc Science - CE2)
(16, 7, 'Histoire');

-- Insertion Table: grades (Notes saisies d'origine)
INSERT INTO grades (id, student_id, subject_id, sub_subject_id, score, max_score, coefficient, term, exam_date) VALUES
-- Notes d'Abdoulaye NDIAYE (id = 1) - CM2
(1, 1, 2, 5, 8.50, 10.00, 3, '3e Trimestre', '2026-05-10'), -- Maths -> Calcul en ligne
(2, 1, 1, 2, 7.00, 10.00, 3, '3e Trimestre', '2026-05-12'), -- Langue -> Dictée/Orthographe
(3, 1, 1, 1, 9.00, 10.00, 3, '3e Trimestre', '2026-05-15'), -- Langue -> Lecture/Compréhension

-- Notes d'Aïssatou DIOP (id = 2) - CM2
(4, 2, 2, 5, 9.00, 10.00, 3, '3e Trimestre', '2026-05-10'), -- Maths -> Calcul en ligne
(5, 2, 1, 1, 8.50, 10.00, 3, '3e Trimestre', '2026-05-15'), -- Langue -> Lecture/Compréhension

-- Notes de Fatou DIOME (id = 4) - CE2
(6, 4, 6, 15, 6.00, 10.00, 3, '3e Trimestre', '2026-05-10'), -- Maths -> Calcul en ligne
(7, 4, 7, 16, 8.00, 10.00, 2, '3e Trimestre', '2026-05-14'); -- Science -> Histoire

-- Insertion Table: attendance (Appel d'origine)
INSERT INTO attendance (id, student_id, attendance_date, status, class_grade, class_division) VALUES
(1, 1, '2026-05-30', 'Présent', 'CM2', 'A'),
(2, 2, '2026-05-30', 'Présent', 'CM2', 'A'),
(3, 3, '2026-05-30', 'Absent', 'CM2', 'B');

-- Insertion Table: signed_bulletins (Historique signature)
INSERT INTO signed_bulletins (id, student_id, term, is_sent_by_teacher, is_signed, signed_by, signed_at) VALUES
(1, 1, '3e Trimestre', TRUE, TRUE, 'M. le Directeur Kane', '2026-06-01 10:15:00');


-- --------------------------------------------------------------------------------
-- 4. REQUÊTES SQL DE L'APPLICATION (INTERACTION / BACKEND)
-- --------------------------------------------------------------------------------

-- ==========================================
-- REQUÊTE A : COMPTES ET COUCHE DURANT L'AUTHENTIFICATION (LOGIN)
-- ==========================================

-- 1. Connexion en tant que Directeur ou Secrétaire (staff_users)
-- Exemple d'entrée: email = 'directeur@sunuecole.sn', password_pin = '1234'
SELECT id, name, email, role 
FROM staff_users 
WHERE email = 'directeur@sunuecole.sn' AND password_pin = '1234';

-- 2. Connexion en tant qu'Enseignant (teachers)
-- Exemple d'entrée: email = 'fall@ecole.sn', code = 'PROF-ABC123'
SELECT id, name, email, class_grade, class_division, is_activated
FROM teachers 
WHERE email = 'fall@ecole.sn' AND invitation_code = 'PROF-ABC123';

-- 3. Activation automatique lors du premier login d'un Enseignant
UPDATE teachers 
SET is_activated = TRUE 
WHERE email = 'fall@ecole.sn';

-- 4. Connexion Parent / Élève (students)
-- Connexion avec le matricule ou l'adresse email générée de l'élève (ex: abdoulaye.ndiaye@ecole.sn) et matricule (Code PIN)
SELECT id, student_number, first_name, last_name, class_grade, class_division 
FROM students 
WHERE (student_number = 'SN-2026-001' OR 
       LOWER(CONCAT(REPLACE(first_name, ' ', ''), '.', REPLACE(last_name, ' ', ''), '@ecole.sn')) = 'abdoulaye.ndiaye@ecole.sn')
  AND student_number = 'SN-2026-001';


-- ==========================================
-- REQUÊTE B : ESPACE SECRÉTAIRE (INSCRIPTION & PROMOTION)
-- ==========================================

-- 1. Enregistrer un nouvel élève
INSERT INTO students (student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact)
VALUES ('SN-2026-009', 'Oumar', 'SARR', 'CM1', 'A', 'M', '2016-07-15', '+221 77 987 65 43');

-- 2. Obtenir le dernier matricule généré d'une année pour calcul de séquence
SELECT student_number 
FROM students 
WHERE student_number LIKE 'SN-2026-%' 
ORDER BY student_number DESC 
LIMIT 1;

-- 3. Promouvoir un élève de classe (ex: passage de CE2 vers CM1)
UPDATE students 
SET class_grade = 'CM1' 
WHERE id = 5;

-- 4. Exclure ou supprimer le dossier d'un élève
DELETE FROM students 
WHERE id = 8;


-- ==========================================
-- REQUÊTE C : ESPACE ENSEIGNANT (SAISIE DES NOTES & APPEL)
-- ==========================================

-- 1. Lister les élèves de la classe de l'enseignant (Ex: CM2-A) pour faire l'appel
SELECT id, student_number, first_name, last_name 
FROM students 
WHERE class_grade = 'CM2' AND class_division = 'A'
ORDER BY last_name ASC, first_name ASC;

-- 2. Enregistrer une présence (Insert avec mise à jour automatique si déjà existant)
INSERT INTO attendance (student_id, attendance_date, status, class_grade, class_division)
VALUES (1, '2026-06-09', 'Présent', 'CM2', 'A')
ON DUPLICATE KEY UPDATE status = 'Présent';

-- 3. Consulter les statistiques d'absence d'un élève pour le trimestre
SELECT 
    COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS total_absences,
    COUNT(CASE WHEN status = 'Retard' THEN 1 END) AS total_retards,
    COUNT(*) AS total_jours_pointes
FROM attendance 
WHERE student_id = 1;

-- 4. Récupérer les composantes (sub_subjects) pour le formulaire de saisie de notes (ex: CM2)
SELECT sub.id AS sub_subject_id, sub.name AS sub_subject_name, subj.id AS subject_id, subj.name AS subject_name, subj.coefficient
FROM sub_subjects sub
INNER JOIN subjects subj ON sub.subject_id = subj.id
WHERE subj.level = 'CM2';

-- 5. Insérer une note d'évaluation trimestrielle
INSERT INTO grades (student_id, subject_id, sub_subject_id, score, max_score, coefficient, term, exam_date)
VALUES (1, 2, 5, 9.50, 10.00, 3, '3e Trimestre', '2026-06-09');


-- ==========================================
-- REQUÊTE D : ESPACE PARENTS & CALCUL DES BULLETINS (COMPLEXE)
-- ==========================================

-- 1. Reconstitution du bulletin complet d'un élève avec moyenne pondérée par matière (ex: l'élève 1 au 3e Trimestre)
-- Cette requête calcule la moyenne réelle pondérée par matière en joignant les notes et matières.
SELECT 
    sub.name AS matiere,
    sub.coefficient AS coeff,
    GROUP_CONCAT(CONCAT(ss.name, ': ', g.score, '/', g.max_score) SEPARATOR ' | ') AS details_composantes,
    AVG(g.score) AS moyenne_sur_10,
    (AVG(g.score) * sub.coefficient) AS note_totale_ponderee,
    (10.00 * sub.coefficient) AS bareme_total_pondere
FROM grades g
INNER JOIN subjects sub ON g.subject_id = sub.id
INNER JOIN sub_subjects ss ON g.sub_subject_id = ss.id
WHERE g.student_id = 1 AND g.term = '3e Trimestre'
GROUP BY sub.id;

-- 2. Calculer la moyenne trimestrielle générale d'un élève (Moyenne du Sénégal : Somme des Notes Pondérées / Somme des Coefficients)
SELECT 
    ROUND(SUM(moyenne_matiere * coefficient) / SUM(coefficient), 2) AS moyenne_generale
FROM (
    SELECT 
        g.subject_id,
        sub.coefficient,
        AVG(g.score) AS moyenne_matiere
    FROM grades g
    INNER JOIN subjects sub ON g.subject_id = sub.id
    WHERE g.student_id = 1 AND g.term = '3e Trimestre'
    GROUP BY g.subject_id, sub.coefficient
) AS matieres_moyennes;


-- ==========================================
-- REQUÊTE E : ESPACE DIRECTEUR & TABLEAUX DE BORD
-- ==========================================

-- 1. Statistiques Globales Administrateur
SELECT 
    (SELECT COUNT(*) FROM students) AS total_eleves,
    (SELECT COUNT(*) FROM teachers) AS total_enseignants,
    (SELECT COUNT(*) FROM attendance WHERE status = 'Absent' AND attendance_date = CURRENT_DATE()) AS absences_aujourdhui;

-- 2. Taux d'assiduité global par classe
SELECT 
    class_grade, 
    class_division,
    COUNT(CASE WHEN status = 'Présent' THEN 1 END) / COUNT(*) * 100 AS taux_presence_pourcent
FROM attendance
GROUP BY class_grade, class_division;

-- 3. Transmettre le bulletin au Secrétariat (Action du Maître de classe)
INSERT INTO signed_bulletins (student_id, term, is_sent_by_teacher)
VALUES (2, '3e Trimestre', TRUE)
ON DUPLICATE KEY UPDATE is_sent_by_teacher = TRUE;

-- 4. Visa & Signature Électronique du Directeur
-- Une fois le bulletin complété, le Directeur appose son visa.
INSERT INTO signed_bulletins (student_id, term, is_signed, signed_by, signed_at)
VALUES (1, '3e Trimestre', TRUE, 'M. le Directeur Kane', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE 
    is_signed = TRUE, 
    signed_by = 'M. le Directeur Kane', 
    signed_at = CURRENT_TIMESTAMP;

-- 5. Palmarès et Classement de la classe (Rang des élèves au trimestres pour CM2-A)
-- Calcule la moyenne de chaque élève de la classe, puis les ordonne pour attribuer le classement.
SELECT 
    s.id AS student_id,
    s.student_number,
    s.first_name,
    s.last_name,
    ROUND(SUM(moyenne_matiere * coefficient) / SUM(coefficient), 2) AS moyenne_generale,
    RANK() OVER (ORDER BY SUM(moyenne_matiere * coefficient) / SUM(coefficient) DESC) AS rang
FROM students s
INNER JOIN (
    -- Sous-requête pour obtenir la moyenne par matière par élève
    SELECT 
        g.student_id,
        g.subject_id,
        sub.coefficient,
        AVG(g.score) AS moyenne_matiere
    FROM grades g
    INNER JOIN subjects sub ON g.subject_id = sub.id
    WHERE g.term = '3e Trimestre'
    GROUP BY g.student_id, g.subject_id, sub.coefficient
) AS mat_avg ON s.id = mat_avg.student_id
WHERE s.class_grade = 'CM2' AND s.class_division = 'A'
GROUP BY s.id
ORDER BY moyenne_generale DESC;
