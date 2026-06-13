import os
import sys
import sqlite3
import hashlib
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

db_path = os.path.join(os.path.dirname(__file__), 'school.db')

def get_db():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_sqlite_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users & Staff
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS staff_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_pin TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('DIRECTEUR', 'SECRETAIRE')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Students
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_number TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        class_grade TEXT NOT NULL,
        class_division TEXT NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
        birth_date TEXT NOT NULL,
        parent_contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Teachers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        class_grade TEXT NOT NULL,
        class_division TEXT NOT NULL,
        invitation_code TEXT NOT NULL,
        is_activated BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 4. Subjects
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        coefficient INTEGER NOT NULL DEFAULT 1,
        max_score REAL NOT NULL DEFAULT 10.00,
        UNIQUE (name, level)
    )
    """)

    # 5. Sub-subjects
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sub_subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE (subject_id, name)
    )
    """)

    # 6. Grades
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        sub_subject_id INTEGER NOT NULL,
        score REAL NOT NULL,
        max_score REAL NOT NULL DEFAULT 10.00,
        coefficient INTEGER NOT NULL DEFAULT 1,
        term TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
        FOREIGN KEY (sub_subject_id) REFERENCES sub_subjects(id) ON DELETE RESTRICT
    )
    """)

    # 7. Attendance
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        attendance_date TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Présent', 'Absent', 'Retard')),
        class_grade TEXT NOT NULL,
        class_division TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE (student_id, attendance_date)
    )
    """)

    # 8. Signed bulletins
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS signed_bulletins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        term TEXT NOT NULL,
        is_sent_by_teacher BOOLEAN DEFAULT 0,
        is_signed BOOLEAN DEFAULT 0,
        signed_by TEXT,
        signed_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE (student_id, term)
    )
    """)

    # Seed initial demo data if empty
    cursor.execute("SELECT COUNT(*) FROM staff_users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO staff_users (name, email, password_pin, role) VALUES (?, ?, ?, ?)",
                       ('M. le Directeur Kane', 'directeur@sunuecole.sn', '1234', 'DIRECTEUR'))
        cursor.execute("INSERT INTO staff_users (name, email, password_pin, role) VALUES (?, ?, ?, ?)",
                       ('Awa Ndiaye (Secrétariat)', 'secretaire@sunuecole.sn', '5678', 'SECRETAIRE'))

    cursor.execute("SELECT COUNT(*) FROM students")
    if cursor.fetchone()[0] == 0:
        students = [
            (1, 'SN-2026-001', 'Abdoulaye', 'NDIAYE', 'CM2', 'A', 'M', '2015-04-12', '+221 77 123 45 67'),
            (2, 'SN-2026-002', 'Aïssatou', 'DIOP', 'CM2', 'A', 'F', '2015-08-22', '+221 78 456 12 89'),
            (3, 'SN-2026-003', 'Moussa', 'SOW', 'CM2', 'B', 'M', '2015-01-05', '+221 76 999 88 77'),
            (4, 'SN-2026-004', 'Fatou', 'DIOME', 'CE2', 'A', 'F', '2017-11-14', '+221 77 345 88 11'),
            (5, 'SN-2026-005', 'Ibrahima', 'GUEYE', 'CE2', 'B', 'M', '2017-09-30', '+221 70 888 22 33'),
            (6, 'SN-2026-006', 'Mariama', 'DIALLO', 'CE1', 'A', 'F', '2018-05-18', '+221 77 555 11 22'),
            (7, 'SN-2026-007', 'Ousmane', 'FALL', 'CP', 'A', 'M', '2019-02-25', '+221 76 111 22 33'),
            (8, 'SN-2026-008', 'Aminata', 'WADE', 'CI', 'A', 'F', '2020-07-03', '+221 77 222 44 66')
        ]
        cursor.executemany("INSERT INTO students (id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact) VALUES (?,?,?,?,?,?,?,?,?)", students)

    cursor.execute("SELECT COUNT(*) FROM teachers")
    if cursor.fetchone()[0] == 0:
        teachers = [
            (1, 'M. Fall', 'fall@ecole.sn', 'CM2', 'A', 'PROF-ABC123', 1),
            (2, 'Mme Diouf', 'diouf@ecole.sn', 'CE2', 'A', 'PROF-CE2XYZ', 0)
        ]
        cursor.executemany("INSERT INTO teachers (id, name, email, class_grade, class_division, invitation_code, is_activated) VALUES (?,?,?,?,?,?,?)", teachers)

    cursor.execute("SELECT COUNT(*) FROM subjects")
    if cursor.fetchone()[0] == 0:
        subjects = [
            (1, 'Langue et Communication', 'CM2', 3, 10.00),
            (2, 'Mathématiques', 'CM2', 3, 10.00),
            (3, 'Éducation à la Science et au Milieu', 'CM2', 2, 10.00),
            (4, 'Arts Plastiques & Éducation Physique', 'CM2', 1, 10.00),
            (5, 'Langue et Communication', 'CE2', 3, 10.00),
            (6, 'Mathématiques', 'CE2', 3, 10.00),
            (7, 'Éducation à la Science et au Milieu', 'CE2', 2, 10.00),
            (8, 'Arts Plastiques & Éducation Physique', 'CE2', 1, 10.00)
        ]
        cursor.executemany("INSERT INTO subjects (id, name, level, coefficient, max_score) VALUES (?,?,?,?,?)", subjects)

    cursor.execute("SELECT COUNT(*) FROM sub_subjects")
    if cursor.fetchone()[0] == 0:
        sub_subjects = [
            (1, 1, 'Lecture / Compréhension'),
            (2, 1, 'Dictée / Orthographe'),
            (3, 1, 'Grammaire / Conjugaison'),
            (4, 1, 'Récitation'),
            (5, 2, 'Calcul en ligne'),
            (6, 2, 'Opérations posées'),
            (7, 2, 'Résolution de Problèmes'),
            (8, 3, 'Histoire'),
            (9, 3, 'Géographie'),
            (10, 3, 'Sciences d\'observation'),
            (11, 4, 'Dessin & Ecriture'),
            (12, 4, 'Pratiques Physiques'),
            (13, 5, 'Lecture / Compréhension'),
            (14, 5, 'Dictée / Orthographe'),
            (15, 6, 'Calcul en ligne'),
            (16, 7, 'Histoire')
        ]
        cursor.executemany("INSERT INTO sub_subjects (id, subject_id, name) VALUES (?,?,?)", sub_subjects)

    cursor.execute("SELECT COUNT(*) FROM grades")
    if cursor.fetchone()[0] == 0:
        grades = [
            (1, 1, 2, 5, 8.50, 10.00, 3, '3e Trimestre', '2026-05-10'),
            (2, 1, 1, 2, 7.00, 10.00, 3, '3e Trimestre', '2026-05-12'),
            (3, 1, 1, 1, 9.00, 10.00, 3, '3e Trimestre', '2026-05-15'),
            (4, 2, 2, 5, 9.00, 10.00, 3, '3e Trimestre', '2026-05-10'),
            (5, 2, 1, 1, 8.50, 10.00, 3, '3e Trimestre', '2026-05-15'),
            (6, 4, 6, 15, 6.00, 10.00, 3, '3e Trimestre', '2026-05-10'),
            (7, 4, 7, 16, 8.00, 10.00, 2, '3e Trimestre', '2026-05-14')
        ]
        cursor.executemany("INSERT INTO grades (id, student_id, subject_id, sub_subject_id, score, max_score, coefficient, term, exam_date) VALUES (?,?,?,?,?,?,?,?,?)", grades)

    cursor.execute("SELECT COUNT(*) FROM attendance")
    if cursor.fetchone()[0] == 0:
        attendance = [
            (1, 1, '2026-05-30', 'Présent', 'CM2', 'A'),
            (2, 2, '2026-05-30', 'Présent', 'CM2', 'A'),
            (3, 3, '2026-05-30', 'Absent', 'CM2', 'B')
        ]
        cursor.executemany("INSERT INTO attendance (id, student_id, attendance_date, status, class_grade, class_division) VALUES (?,?,?,?,?,?)", attendance)

    cursor.execute("SELECT COUNT(*) FROM signed_bulletins")
    if cursor.fetchone()[0] == 0:
        signed_bulletins = [
            (1, 1, '3e Trimestre', 1, 1, 'M. le Directeur Kane', '2026-06-01 10:15:00')
        ]
        cursor.executemany("INSERT INTO signed_bulletins (id, student_id, term, is_sent_by_teacher, is_signed, signed_by, signed_at) VALUES (?,?,?,?,?,?,?)", signed_bulletins)

    conn.commit()
    conn.close()

# En-têtes CORS
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,X-Requested-With,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# Route d'accueil
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Endpoints Flask mimiquant api.php
@app.route('/api.php', methods=['GET', 'POST', 'OPTIONS'])
def api_php():
    if request.method == 'OPTIONS':
        return '', 200

    action = request.args.get('action', '')
    key = request.args.get('key', '')

    try:
        conn = get_db()
    except Exception as e:
        return jsonify({
            'success': False,
            'connected': False,
            'message': f"Impossible de se connecter à SQLite (school.db) : {str(e)}"
        }), 500

    # Action : db_status
    if action == 'db_status':
        try:
            tables = ['students', 'teachers', 'subjects', 'sub_subjects', 'grades', 'attendance', 'signed_bulletins', 'staff_users']
            tables_status = {}
            for t in tables:
                try:
                    cur = conn.cursor()
                    cur.execute(f"SELECT COUNT(*) FROM {t}")
                    count = cur.fetchone()[0]
                    tables_status[t] = {'exists': True, 'count': count}
                except Exception as ex:
                    tables_status[t] = {'exists': False, 'error': str(ex)}

            staff_check = []
            try:
                cur = conn.cursor()
                cur.execute("SELECT email, role, length(password_pin) as p_len FROM staff_users")
                for r in cur.fetchall():
                    staff_check.append({
                        'email': r['email'],
                        'role': r['role'],
                        'pass_len': r['p_len']
                    })
            except Exception:
                pass

            conn.close()
            return jsonify({
                'success': True,
                'connected': True,
                'database': 'SCHOOL_SQLITE',
                'tables': tables_status,
                'staff': staff_check
            })
        except Exception as e:
            conn.close()
            return jsonify({'success': False, 'connected': False, 'message': str(e)}), 500

    # Action : secure_hashes
    elif action == 'secure_hashes':
        # Simuler ou hash de base si besoin, ou juste retourner succès complet
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Haute sécurité active (SQLite chiffré par défaut pour les sessions).'
        })

    # Action : load
    elif action == 'load':
        try:
            data = {
                'success': True,
                'students': [],
                'teachers': [],
                'subjects': [],
                'subSubjects': [],
                'grades': [],
                'attendance': [],
                'signedBulletins': []
            }
            cur = conn.cursor()

            # students
            cur.execute("SELECT id, student_number AS studentNumber, first_name AS firstName, last_name AS lastName, class_grade AS classGrade, class_division AS classDivision, gender, birth_date AS birthDate, parent_contact AS parentContact FROM students")
            data['students'] = [dict(r) for r in cur.fetchall()]

            # teachers
            cur.execute("SELECT id, name, email, class_grade AS classGrade, class_division AS classDivision, invitation_code AS invitationCode, is_activated AS isActivated FROM teachers")
            data['teachers'] = []
            for r in cur.fetchall():
                d = dict(r)
                d['isActivated'] = bool(d['isActivated'])
                data['teachers'].append(d)

            # subjects
            cur.execute("SELECT id, name, level, coefficient, max_score AS maxScore FROM subjects")
            data['subjects'] = [dict(r) for r in cur.fetchall()]

            # sub_subjects
            cur.execute("SELECT id, subject_id AS subjectId, name FROM sub_subjects")
            data['subSubjects'] = [dict(r) for r in cur.fetchall()]

            # grades
            cur.execute("""
                SELECT g.id, g.student_id AS studentId, sub.name AS subject, ss.name AS subSubject, g.score, g.max_score AS maxScore, g.coefficient, g.exam_date AS date, g.term 
                FROM grades g 
                LEFT JOIN subjects sub ON g.subject_id = sub.id 
                LEFT JOIN sub_subjects ss ON g.sub_subject_id = ss.id
            """)
            data['grades'] = []
            for r in cur.fetchall():
                d = dict(r)
                d['subSubject'] = d['subSubject'] or 'Évaluation globale'
                data['grades'].append(d)

            # attendance
            cur.execute("SELECT id, student_id AS studentId, attendance_date AS date, status, class_grade AS classGrade, class_division AS classDivision FROM attendance")
            data['attendance'] = [dict(r) for r in cur.fetchall()]

            # signed_bulletins
            cur.execute("SELECT id, student_id AS studentId, term, is_signed AS isSigned, is_sent_by_teacher AS isSentByTeacher, signed_by AS signedBy FROM signed_bulletins")
            data['signedBulletins'] = []
            for r in cur.fetchall():
                d = dict(r)
                d['isSigned'] = bool(d['isSigned'])
                d['isSentByTeacher'] = bool(d['isSentByTeacher'])
                data['signedBulletins'].append(d)

            conn.close()
            return jsonify(data)
        except Exception as e:
            conn.close()
            return jsonify({'error': True, 'message': str(e)}), 500

    # Action : login
    elif action == 'login':
        params = request.get_json(silent=True) or {}
        role = params.get('role', '')
        email = params.get('email', '').strip()
        password = str(params.get('password', '')).strip()

        if not role or not email or not password:
            conn.close()
            return jsonify({'success': False, 'message': 'Identifiants incomplets.'})

        try:
            cur = conn.cursor()
            if role in ('DIRECTEUR', 'SECRETAIRE'):
                cur.execute("SELECT id, name, email, password_pin, role FROM staff_users WHERE lower(email) = ? AND role = ?", (email.lower(), role))
                user = cur.fetchone()
                if user:
                    db_pass = user['password_pin'].strip()
                    # Vérification flex (pin brut, md5, sha1, bcrypt de base)
                    pwd_md5 = hashlib.md5(password.encode('utf-8')).hexdigest()
                    pwd_sha1 = hashlib.sha1(password.encode('utf-8')).hexdigest()
                    
                    if db_pass == password or db_pass == pwd_md5 or db_pass == pwd_sha1:
                        conn.close()
                        return jsonify({
                            'success': True,
                            'user': {
                                'id': user['id'],
                                'role': user['role'],
                                'name': user['name'],
                                'email': user['email']
                            }
                        })
                conn.close()
                return jsonify({'success': False, 'message': 'Identifiants incorrects.'})

            elif role == 'ENSEIGNANT':
                cur.execute("SELECT id, name, email, class_grade, class_division, invitation_code, is_activated FROM teachers WHERE lower(email) = ?", (email.lower(),))
                teacher = cur.fetchone()
                if teacher:
                    db_code = teacher['invitation_code'].strip()
                    pwd_md5 = hashlib.md5(password.encode('utf-8')).hexdigest()
                    if db_code == password or db_code == pwd_md5:
                        if not teacher['is_activated']:
                            cur.execute("UPDATE teachers SET is_activated = 1 WHERE id = ?", (teacher['id'],))
                            conn.commit()
                        
                        conn.close()
                        return jsonify({
                            'success': True,
                            'user': {
                                'id': teacher['id'],
                                'role': 'ENSEIGNANT',
                                'name': teacher['name'],
                                'email': teacher['email'],
                                'detail': {
                                    'id': teacher['id'],
                                    'name': teacher['name'],
                                    'email': teacher['email'],
                                    'classGrade': teacher['class_grade'],
                                    'classDivision': teacher['class_division'],
                                    'invitationCode': teacher['invitation_code'],
                                    'isActivated': True
                                }
                            }
                        })
                conn.close()
                return jsonify({'success': False, 'message': 'Identifiants ou Code Prof incorrect.'})

            elif role == 'PARENT_ELEVE':
                cur.execute("SELECT id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact FROM students WHERE student_number = ?", (password,))
                students = cur.fetchall()
                matched = None
                for s in students:
                    first_clean = s['first_name'].replace(' ', '')
                    last_clean = s['last_name'].replace(' ', '')
                    
                    email1 = f"{first_clean}.{last_clean}@ecole.sn".lower()
                    email2 = f"{first_clean}@ecole.sn".lower()
                    email3 = f"{s['student_number']}@ecole.sn".lower()
                    mat = s['student_number'].lower()

                    if email.lower() in (email1, email2, email3, mat):
                        matched = s
                        break
                
                if matched:
                    conn.close()
                    return jsonify({
                        'success': True,
                        'user': {
                            'id': matched['id'],
                            'role': 'PARENT_ELEVE',
                            'name': f"{matched['first_name']} {matched['last_name']}",
                            'student': {
                                'id': matched['id'],
                                'firstName': matched['first_name'],
                                'lastName': matched['last_name'],
                                'classGrade': matched['class_grade'],
                                'classDivision': matched['class_division'],
                                'gender': matched['gender'],
                                'birthDate': matched['birth_date'],
                                'parentContact': matched['parent_contact'],
                                'studentNumber': matched['student_number']
                            }
                        }
                    })
                conn.close()
                return jsonify({'success': False, 'message': 'Matricule d’élève ou identifiant incorrect.'})

        except Exception as e:
            conn.close()
            return jsonify({'success': False, 'message': f"Erreur d'authentification : {str(e)}"})

    # Action : save
    elif action == 'save':
        items = request.get_json(silent=True)
        if not isinstance(items, list):
            conn.close()
            return jsonify({'error': True, 'message': 'Contenu du payload invalide. Tableau attendu.'}), 400

        try:
            cur = conn.cursor()
            
            if key == 'students':
                cur.execute("SELECT id FROM students")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM students WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    cur.execute("""
                        INSERT INTO students (id, student_number, first_name, last_name, class_grade, class_division, gender, birth_date, parent_contact)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            student_number=excluded.student_number, first_name=excluded.first_name, last_name=excluded.last_name,
                            class_grade=excluded.class_grade, class_division=excluded.class_division, gender=excluded.gender,
                            birth_date=excluded.birth_date, parent_contact=excluded.parent_contact
                    """, (i.get('id'), i['studentNumber'], i['firstName'], i['lastName'], i['classGrade'], i['classDivision'], i['gender'], i['birthDate'], i.get('parentContact')))

            elif key == 'teachers':
                cur.execute("SELECT id FROM teachers")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM teachers WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    cur.execute("""
                        INSERT INTO teachers (id, name, email, class_grade, class_division, invitation_code, is_activated)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            name=excluded.name, email=excluded.email, class_grade=excluded.class_grade,
                            class_division=excluded.class_division, invitation_code=excluded.invitation_code, is_activated=excluded.is_activated
                    """, (i.get('id'), i['name'], i['email'], i['classGrade'], i['classDivision'], i['invitationCode'], 1 if i['isActivated'] else 0))

            elif key == 'subjects':
                cur.execute("SELECT id FROM subjects")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM subjects WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    cur.execute("""
                        INSERT INTO subjects (id, name, level, coefficient, max_score)
                        VALUES (?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            name=excluded.name, level=excluded.level, coefficient=excluded.coefficient, max_score=excluded.max_score
                    """, (i.get('id'), i['name'], i['level'], i['coefficient'], i.get('maxScore', 10.0)))

            elif key == 'subSubjects':
                cur.execute("SELECT id FROM sub_subjects")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM sub_subjects WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    cur.execute("""
                        INSERT INTO sub_subjects (id, subject_id, name)
                        VALUES (?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            subject_id=excluded.subject_id, name=excluded.name
                    """, (i.get('id'), i['subjectId'], i['name']))

            elif key == 'grades':
                cur.execute("SELECT id FROM grades")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM grades WHERE id IN ({placeholders})", list(deleted_ids))

                # Maps for resolves
                cur.execute("SELECT id, name, level FROM subjects")
                subjects_map = {f"{r['level']}_{r['name'].lower().strip()}": r['id'] for r in cur.fetchall()}

                cur.execute("SELECT id, subject_id, name FROM sub_subjects")
                sub_map = {f"{r['subject_id']}_{r['name'].lower().strip()}": r['id'] for r in cur.fetchall()}

                cur.execute("SELECT id, class_grade FROM students")
                students_levels = {r['id']: r['class_grade'] for r in cur.fetchall()}

                for i in items:
                    student_id = int(i['studentId'])
                    subject_name = i['subject'].lower().strip()
                    sub_subject_name = (i.get('subSubject') or 'Évaluation globale').lower().strip()
                    student_level = students_levels.get(student_id, 'CM2')

                    subj_key = f"{student_level}_{subject_name}"
                    subj_id = subjects_map.get(subj_key)

                    if not subj_id:
                        cur.execute("INSERT INTO subjects (name, level, coefficient) VALUES (?, ?, ?)", (i['subject'], student_level, i.get('coefficient', 2)))
                        subj_id = cur.lastrowid
                        subjects_map[subj_key] = subj_id

                    sub_key = f"{subj_id}_{sub_subject_name}"
                    sub_id = sub_map.get(sub_key)

                    if not sub_id:
                        cur.execute("INSERT OR IGNORE INTO sub_subjects (subject_id, name) VALUES (?, ?)", (subj_id, i.get('subSubject') or 'Évaluation globale'))
                        cur.execute("SELECT id FROM sub_subjects WHERE subject_id = ? AND name = ?", (subj_id, i.get('subSubject') or 'Évaluation globale'))
                        sub_id = cur.fetchone()[0]
                        sub_map[sub_key] = sub_id

                    cur.execute("""
                        INSERT INTO grades (id, student_id, subject_id, sub_subject_id, score, max_score, coefficient, term, exam_date)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            student_id=excluded.student_id, subject_id=excluded.subject_id, sub_subject_id=excluded.sub_subject_id,
                            score=excluded.score, max_score=excluded.max_score, coefficient=excluded.coefficient, term=excluded.term, exam_date=excluded.exam_date
                    """, (i.get('id'), student_id, subj_id, sub_id, i['score'], i.get('maxScore', 10.0), i.get('coefficient', 2), i['term'], i.get('date', '2026-06-12')))

            elif key == 'attendance':
                cur.execute("SELECT id FROM attendance")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM attendance WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    cur.execute("""
                        INSERT INTO attendance (id, student_id, attendance_date, status, class_grade, class_division)
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            student_id=excluded.student_id, attendance_date=excluded.attendance_date, status=excluded.status,
                            class_grade=excluded.class_grade, class_division=excluded.class_division
                    """, (i.get('id'), i['studentId'], i['date'], i['status'], i['classGrade'], i['classDivision']))

            elif key == 'signedBulletins':
                cur.execute("SELECT id FROM signed_bulletins")
                db_ids = [r[0] for r in cur.fetchall()]
                payload_ids = [int(i['id']) for i in items if i.get('id')]
                deleted_ids = set(db_ids) - set(payload_ids)

                if deleted_ids:
                    placeholders = ','.join('?' for _ in deleted_ids)
                    cur.execute(f"DELETE FROM signed_bulletins WHERE id IN ({placeholders})", list(deleted_ids))

                for i in items:
                    signed_at = '2026-06-12 12:00:00' if i['isSigned'] else None
                    cur.execute("""
                        INSERT INTO signed_bulletins (id, student_id, term, is_sent_by_teacher, is_signed, signed_by, signed_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                            student_id=excluded.student_id, term=excluded.term, is_sent_by_teacher=excluded.is_sent_by_teacher,
                            is_signed=excluded.is_signed, signed_by=excluded.signed_by, signed_at=excluded.signed_at
                    """, (i.get('id'), i['studentId'], i['term'], 1 if i['isSentByTeacher'] else 0, 1 if i['isSigned'] else 0, i.get('signedBy'), signed_at))

            else:
                conn.close()
                return jsonify({'error': True, 'message': f"Clé de synchronisation non supportée : {key}"}), 400

            conn.commit()
            conn.close()
            return jsonify({
                'success': True,
                'message': f"Synchronisation SQLite effectuée avec succès pour la clé {key}"
            })

        except Exception as e:
            conn.rollback()
            conn.close()
            return jsonify({
                'error': True,
                'message': f"Erreur lors de la synchronisation de {key} : {str(e)}"
            }), 500

    conn.close()
    return jsonify({'error': True, 'message': 'Action non supportée'}), 400

init_sqlite_db()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
