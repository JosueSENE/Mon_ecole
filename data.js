/* ==========================================================================
   SUNU ÉCOLE - MODULE 1: DATABASE, INITIAL MOCK STATES, AUTHENTICATION & COMMUNICATION
   ========================================================================== */

// Default LocalStorage Mock Data setup
window.INITIAL_STUDENTS = [
    { id: 1, firstName: "Abdoulaye", lastName: "NDIAYE", classGrade: "CM2", classDivision: "A", gender: "M", birthDate: "2015-04-12", parentContact: "+221 77 123 45 67", studentNumber: "SN-2026-001" },
    { id: 2, firstName: "Aïssatou", lastName: "DIOP", classGrade: "CM2", classDivision: "A", gender: "F", birthDate: "2015-08-22", parentContact: "+221 78 456 12 89", studentNumber: "SN-2026-002" },
    { id: 3, firstName: "Moussa", lastName: "SOW", classGrade: "CM2", classDivision: "B", gender: "M", birthDate: "2015-01-05", parentContact: "+221 76 999 88 77", studentNumber: "SN-2026-003" },
    { id: 4, firstName: "Fatou", lastName: "DIOME", classGrade: "CE2", classDivision: "A", gender: "F", birthDate: "2017-11-14", parentContact: "+221 77 345 88 11", studentNumber: "SN-2026-004" },
    { id: 5, firstName: "Ibrahima", lastName: "GUEYE", classGrade: "CE2", classDivision: "B", gender: "M", birthDate: "2017-09-30", parentContact: "+221 70 888 22 33", studentNumber: "SN-2026-005" },
    { id: 6, firstName: "Mariama", lastName: "DIALLO", classGrade: "CE1", classDivision: "A", gender: "F", birthDate: "2018-05-18", parentContact: "+221 77 555 11 22", studentNumber: "SN-2026-006" },
    { id: 7, firstName: "Ousmane", lastName: "FALL", classGrade: "CP", classDivision: "A", gender: "M", birthDate: "2019-02-25", parentContact: "+221 76 111 22 33", studentNumber: "SN-2026-007" },
    { id: 8, firstName: "Aminata", lastName: "WADE", classGrade: "CI", classDivision: "A", gender: "F", birthDate: "2020-07-03", parentContact: "+221 77 222 44 66", studentNumber: "SN-2026-008" }
];

window.INITIAL_TEACHERS = [
    { id: 1, name: "M. Fall", email: "fall@ecole.sn", classGrade: "CM2", classDivision: "A", invitationCode: "PROF-ABC123", isActivated: true },
    { id: 2, name: "Mme Diouf", email: "diouf@ecole.sn", classGrade: "CE2", classDivision: "A", invitationCode: "PROF-CE2XYZ", isActivated: false }
];

window.INITIAL_SUBJECTS = [
    { id: 1, name: "Langue et Communication", level: "CM2", coefficient: 3, maxScore: 10 },
    { id: 2, name: "Mathématiques", level: "CM2", coefficient: 3, maxScore: 10 },
    { id: 3, name: "Éducation à la Science et au Milieu", level: "CM2", coefficient: 2, maxScore: 10 },
    { id: 4, name: "Arts Plastiques & Éducation Physique", level: "CM2", coefficient: 1, maxScore: 10 },
    
    { id: 5, name: "Langue et Communication", level: "CE2", coefficient: 3, maxScore: 10 },
    { id: 6, name: "Mathématiques", level: "CE2", coefficient: 3, maxScore: 10 },
    { id: 7, name: "Éducation à la Science et au Milieu", level: "CE2", coefficient: 2, maxScore: 10 },
    { id: 8, name: "Arts Plastiques & Éducation Physique", level: "CE2", coefficient: 1, maxScore: 10 }
];

window.INITIAL_SUB_SUBJECTS = [
    { id: 1, subjectId: 1, name: "Lecture / Compréhension" },
    { id: 2, subjectId: 1, name: "Dictée / Orthographe" },
    { id: 3, subjectId: 1, name: "Grammaire / Conjugaison" },
    { id: 4, subjectId: 1, name: "Récitation" },
    { id: 5, subjectId: 2, name: "Calcul en ligne" },
    { id: 6, subjectId: 2, name: "Opérations posées" },
    { id: 7, subjectId: 2, name: "Résolution de Problèmes" },
    { id: 8, subjectId: 3, name: "Histoire" },
    { id: 9, subjectId: 3, name: "Géographie" },
    { id: 10, subjectId: 3, name: "Sciences d'observation" },
    { id: 11, subjectId: 4, name: "Dessin & Ecriture" },
    { id: 12, subjectId: 4, name: "Pratiques Physiques" },

    { id: 13, subjectId: 5, name: "Lecture / Compréhension" },
    { id: 14, subjectId: 5, name: "Dictée / Orthographe" },
    { id: 15, subjectId: 6, name: "Calcul en ligne" },
    { id: 16, subjectId: 7, name: "Histoire" }
];

window.INITIAL_GRADES = [
    { id: 1, studentId: 1, subject: "Mathématiques", subSubject: "Calcul en ligne", score: 8.5, maxScore: 10.0, coefficient: 3, date: "2026-05-10", term: "3e Trimestre" },
    { id: 2, studentId: 1, subject: "Langue et Communication", subSubject: "Dictée / Orthographe", score: 7.0, maxScore: 10.0, coefficient: 3, date: "2026-05-12", term: "3e Trimestre" },
    { id: 3, studentId: 1, subject: "Langue et Communication", subSubject: "Lecture / Compréhension", score: 9.0, maxScore: 10.0, coefficient: 3, date: "2026-05-15", term: "3e Trimestre" },
    
    { id: 4, studentId: 2, subject: "Mathématiques", subSubject: "Calcul en ligne", score: 9.0, maxScore: 10.0, coefficient: 3, date: "2026-05-10", term: "3e Trimestre" },
    { id: 5, studentId: 2, subject: "Langue et Communication", subSubject: "Lecture / Compréhension", score: 8.5, maxScore: 10.0, coefficient: 3, date: "2026-05-15", term: "3e Trimestre" },

    { id: 6, studentId: 4, subject: "Mathématiques", subSubject: "Calcul en ligne", score: 6.0, maxScore: 10.0, coefficient: 3, date: "2026-05-10", term: "3e Trimestre" },
    { id: 7, studentId: 4, subject: "Éducation à la Science et au Milieu", subSubject: "Histoire", score: 8.0, maxScore: 10.0, coefficient: 2, date: "2026-05-14", term: "3e Trimestre" }
];

window.INITIAL_ATTENDANCE = [
    { id: 1, studentId: 1, date: "2026-05-30", status: "Présent", classGrade: "CM2", classDivision: "A" },
    { id: 2, studentId: 2, date: "2026-05-30", status: "Présent", classGrade: "CM2", classDivision: "A" },
    { id: 3, studentId: 3, date: "2026-05-30", status: "Absent", classGrade: "CM2", classDivision: "B" }
];

window.INITIAL_SIGNED_BULLETINS = [
    { id: 1, studentId: 1, term: "3e Trimestre", isSigned: true, isSentByTeacher: true, signedBy: "M. le Directeur Kane" }
];

// Core App Cache State
window.db = {
    students: [],
    teachers: [],
    subjects: [],
    subSubjects: [],
    grades: [],
    attendance: [],
    signedBulletins: []
};

// Initialize LocalStorage Data & Trigger Realtime Live MySQL Sync
window.initStorage = function() {
    // 0. Si nous avons des données injectées de manière synchrone par PHP/MySQL (db_data.php), on les applique immédiatement
    if (window.MYSQL_DB && typeof window.MYSQL_DB === 'object') {
        Object.keys(window.db).forEach(key => {
            if (Array.isArray(window.MYSQL_DB[key])) {
                window.db[key] = window.MYSQL_DB[key];
                localStorage.setItem(`school_${key}`, JSON.stringify(window.db[key]));
            }
        });
        console.log("⚡ [Interconnexion] Initialisation instantanée de l'état depuis le cache de db_data.php (MySQL XAMPP).");
    } else {
        // 1. Sinon on initialise avec les données locales du LocalStorage pour un chargement instantané autonome
        Object.keys(window.db).forEach(key => {
            const stored = localStorage.getItem(`school_${key}`);
            if (!stored) {
                let initialData = [];
                if (key === 'students') initialData = window.INITIAL_STUDENTS;
                if (key === 'teachers') initialData = window.INITIAL_TEACHERS;
                if (key === 'subjects') initialData = window.INITIAL_SUBJECTS;
                if (key === 'subSubjects') initialData = window.INITIAL_SUB_SUBJECTS;
                if (key === 'grades') initialData = window.INITIAL_GRADES;
                if (key === 'attendance') initialData = window.INITIAL_ATTENDANCE;
                if (key === 'signedBulletins') initialData = window.INITIAL_SIGNED_BULLETINS;
                
                localStorage.setItem(`school_${key}`, JSON.stringify(initialData));
                window.db[key] = initialData;
            } else {
                window.db[key] = JSON.parse(stored);
            }
        });
    }

    // Ping check live indicator if any on current page
    if (typeof window.checkLiveDbConnection === 'function') {
        window.checkLiveDbConnection();
    }

    // 2. Requête d'arrière-plan vers le serveur XAMPP (MySQL) pour recharger les données en temps réel
    if (!window.hasTriggeredSync) {
        window.hasTriggeredSync = true;
        
        fetch('api.php?action=load')
            .then(res => res.json())
            .then(data => {
                if (data && data.success) {
                    console.log("⚡ Connecté avec succès au serveur MySQL de XAMPP (Base SCHOOL) !");
                    
                    // Mettre à jour la base de données locale (window.db) et le LocalStorage
                    Object.keys(window.db).forEach(key => {
                        if (data[key]) {
                            window.db[key] = data[key];
                            localStorage.setItem(`school_${key}`, JSON.stringify(data[key]));
                        }
                    });
                    
                    // Déclencher une mise à jour d'affichage de la page active si nécessaire
                    if (typeof window.switchTab === 'function') {
                        if (typeof window.currentTab === 'string') {
                            window.switchTab(window.currentTab);
                        }
                    } else if (typeof window.renderOverview === 'function') {
                        window.renderOverview();
                    }
                    
                    // Notification discrète de succès de synchronisation
                    if (typeof window.showToast === 'function') {
                        window.showToast("⚡ Connexion établie avec la base MySQL SCHOOL", "info");
                    }
                } else if (data && data.error) {
                    console.warn("⚠️ API de synchronisation : " + data.error);
                }
            })
            .catch(error => {
                console.log("ℹ️ Fonctionnement local actif (Le script PHP n'est pas encore lancé sous Apache XAMPP).");
            });
    }
};

// Function to update any visual live database connection indicators on the active page
window.checkLiveDbConnection = function() {
    fetch('api.php?action=db_status')
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('live-db-badge');
            const dot = document.getElementById('live-db-dot');
            const text = document.getElementById('live-db-text');
            if (badge) badge.classList.remove('hidden');
            if (data && data.connected) {
                if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-500";
                if (text) {
                    text.innerText = "Interconnecté à MySQL ⚡";
                    text.className = "text-emerald-400 font-bold font-mono";
                }
            } else {
                if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse";
                if (text) {
                    text.innerText = "MySQL Déconnecté (Local Temp)";
                    text.className = "text-amber-400 font-bold font-mono";
                }
            }
        })
        .catch(() => {
            const badge = document.getElementById('live-db-badge');
            const dot = document.getElementById('live-db-dot');
            const text = document.getElementById('live-db-text');
            if (badge) badge.classList.remove('hidden');
            if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-slate-500";
            if (text) {
                text.innerText = "Hors-ligne (Cache local)";
                text.className = "text-slate-400 font-bold font-mono";
            }
        });
};

window.saveToStorage = function(key) {
    // Étape A: Sauvegarde instantanée locale dans le LocalStorage
    localStorage.setItem(`school_${key}`, JSON.stringify(window.db[key]));
    
    // Étape B: Envoi synchrone de fond vers la base MySQL réelle de XAMPP
    fetch(`api.php?action=save&key=${key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(window.db[key])
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.success) {
            console.log(`✔️ Table [${key}] mise à jour dans MySQL.`);
        } else if (data && data.error) {
            console.error("❌ Erreur MySQL : " + data.error);
            if (typeof window.showToast === 'function') {
                window.showToast("⚠️ Erreur d'enregistrement MySQL : " + data.error, "error");
            }
        }
    })
    .catch(err => {
        console.warn("ℹ️ Enregistrement local uniquement (Serveur Apache/PHP non joignable).");
    });
};

// 4. PRINT PREVIEW WINDOW & PDF SIMULATOR FOR SINGLE PUPIL (Shareable utility)
window.previewStudentBulletinPDF = function(studentId, term) {
    const std = window.db.students.find(s => s.id === studentId);
    if (!std) return;

    const grades = window.db.grades.filter(g => g.studentId === studentId && g.term === term);
    const signature = window.db.signedBulletins.find(sb => sb.studentId === studentId && sb.term === term);
    const isSigned = signature ? signature.isSigned : false;
    const average = window.calculateOverallAverage(studentId, term);

    // Opening a clean window block for print preview
    const printW = window.open("", "_blank", "width=850,height=1100");
    if (!printW) {
        window.showToast("⚠️ Le bloqueur de popups a empêché l'impression. Veuillez autoriser les popups dans vos réglages.", 'error');
        return;
    }

    let rowsHtml = "";
    if (grades.length === 0) {
        rowsHtml = `
            <tr>
                <td colspan="7" style="padding: 15px; text-align: center; font-style: italic; color: #555;">
                    Aucune note d'évaluation enregistrée dans le système pour ce trimestre.
                </td>
            </tr>
        `;
    } else {
        grades.forEach(g => {
            const score10 = (g.score / g.maxScore) * 10;
            const weighted = score10 * g.coefficient;
            
            let appreciation = "Moyen";
            if (score10 >= 8.5) appreciation = "Très Bien / Excellent";
            else if (score10 >= 7) appreciation = "Bien";
            else if (score10 >= 5) appreciation = "Assez Bien";
            else appreciation = "Insuffisant";

            rowsHtml += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; text-align: left; font-weight: bold; font-size: 13px;">${g.subject}</td>
                    <td style="padding: 10px; text-align: left; font-size: 11px; color: #555;">${g.subSubject || 'Évaluation globale'}</td>
                    <td style="padding: 10px; text-align: center; font-weight: bold;">${g.coefficient}</td>
                    <td style="padding: 10px; text-align: center;">${g.score.toFixed(1)} / ${g.maxScore}</td>
                    <td style="padding: 10px; text-align: center; font-weight: bold; color: #333;">${score10.toFixed(2)} / 10</td>
                    <td style="padding: 10px; text-align: center; font-weight: bold; color: #111;">${weighted.toFixed(2)}</td>
                    <td style="padding: 10px; text-align: center; font-size: 11px; font-style: italic; color: #444;">${appreciation}</td>
                </tr>
            `;
        });
    }

    const totalCoeff = grades.reduce((acc, current) => acc + current.coefficient, 0);
    const totalPoints = grades.reduce((acc, current) => acc + ((current.score / current.maxScore) * 10 * current.coefficient), 0);
    const generalAvg = average !== null ? average.toFixed(2) : "--";

    // Determine decision / honor
    let decisionLabel = "En cours de validation";
    let decisionColor = "#333";
    if (average !== null) {
        if (average >= 7.5) {
            decisionLabel = "Admis • Félicitations du Conseil des Maîtres (Tableau d'Honneur)";
            decisionColor = "#2e7d32";
        } else if (average >= 5.0) {
            decisionLabel = "Admis au niveau supérieur";
            decisionColor = "#1565c0";
        } else {
            decisionLabel = "Doit redoubler d'efforts / Redoublement envisagé";
            decisionColor = "#c62828";
        }
    }

    printW.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bulletin de Notes - ${std.firstName} ${std.lastName}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #222;
            margin: 0;
            padding: 30px;
            background-color: #fff;
            -webkit-print-color-adjust: exact;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header-left {
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            line-height: 1.5;
        }
        .header-central {
            text-align: center;
            vertical-align: middle;
        }
        .header-right {
            text-align: right;
            font-size: 11px;
            line-height: 1.5;
        }
        .title {
            text-align: center;
            font-size: 20px;
            font-weight: 900;
            margin: 25px 0 15px 0;
            letter-spacing: 1px;
            text-decoration: underline;
        }
        .student-info-box {
            border: 2px solid #333;
            padding: 15px;
            margin-bottom: 25px;
            background-color: #fcfcfc;
            border-radius: 6px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 5px 8px;
            font-size: 13px;
        }
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .grades-table th {
            border: 1.5px solid #222;
            background-color: #f0f0f0 !important;
            padding: 10px 8px;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .grades-table td {
            border: 1px solid #ccc;
            padding: 10px 8px;
            font-size: 13px;
        }
        .totals-section {
            width: 100%;
            margin-bottom: 30px;
            display: inline-block;
        }
        .totals-table {
            width: 48%;
            float: right;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 1.5px solid #222;
        }
        .totals-table td {
            padding: 8px 12px;
            border: 1px solid #222;
            font-size: 13px;
        }
        .signature-section {
            width: 100%;
            margin-top: 40px;
            clear: both;
        }
        .signature-table {
            width: 100%;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            font-size: 13px;
            vertical-align: top;
            padding-top: 5px;
        }
        .stamp-box {
            border: 2px dashed #2e7d32;
            color: #2e7d32;
            background-color: #e8f5e9;
            padding: 10px;
            display: inline-block;
            font-weight: bold;
            font-size: 12px;
            margin-top: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .stamp-box-pending {
            border: 2px dashed #d32f2f;
            color: #d32f2f;
            background-color: #ffebee;
            padding: 10px;
            display: inline-block;
            font-weight: bold;
            font-size: 12px;
            margin-top: 10px;
            border-radius: 4px;
            text-align: center;
        }
        @media print {
            body {
                padding: 15px;
            }
            @page {
                size: A4;
                margin: 20mm;
            }
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td class="header-left" style="width: 40%;">
                <strong>RÉPUBLIQUE DU SÉNÉGAL</strong><br>
                Un Peuple - Un But - Une Foi<br>
                -------------------------<br>
                <strong>MINISTÈRE DE L'ÉDUCATION NATIONALE</strong><br>
                Inspection de l'Éducation et de la Formation (IEF)<br>
                Académie Scolaire Régionale de Dakar
            </td>
            <td class="header-central" style="width: 20%;">
                <span style="font-size: 28px; font-weight: bold; border: 2.5px solid #333; padding: 4px 10px; border-radius: 6px; background-color: #fafafa;">SE</span>
            </td>
            <td class="header-right" style="width: 40%;">
                <strong>ÉCOLE PRIMAIRE PRIVÉE SUNUECOLE</strong><br>
                Scolarité d'Excellence du CI au CM2<br>
                Quartier Mermoz, Dakar - Sénégal<br>
                Téléphone: +221 33 824 55 99<br>
                Année Académique: 2025 - 2026
            </td>
        </tr>
    </table>

    <div class="title">BULLETIN DE NOTES - ${term.toUpperCase()}</div>

    <div class="student-info-box">
        <table class="info-table">
            <tr>
                <td style="width: 15%;"><strong>Élève :</strong></td>
                <td style="width: 45%; font-size: 15px; font-weight: bold; color: #111;">${std.firstName} ${std.lastName}</td>
                <td style="width: 20%;"><strong>Numéro d'Inscrip. :</strong></td>
                <td style="width: 20%; font-family: monospace; font-weight: bold; font-size: 13px; color: #4338ca;">${std.studentNumber}</td>
            </tr>
            <tr>
                <td><strong>Classe d'études:</strong></td>
                <td><strong>${std.classGrade} - DIVISION ${std.classDivision}</strong></td>
                <td><strong>Date de Naissance :</strong></td>
                <td>${std.birthDate}</td>
            </tr>
            <tr>
                <td><strong>Genre / Sexe:</strong></td>
                <td>${std.gender === 'F' ? 'Féminin (F)' : 'Masculin (M)'}</td>
                <td><strong>Parent de l'Élève :</strong></td>
                <td>${std.parentContact || 'Non spécifié'}</td>
            </tr>
        </table>
    </div>

    <table class="grades-table">
        <thead>
            <tr>
                <th style="width: 25%; text-align: left;">Matière d'évaluation</th>
                <th style="width: 25%; text-align: left;">Détails de l'évaluation</th>
                <th style="width: 8%;">Coef</th>
                <th style="width: 12%;">Note Brute</th>
                <th style="width: 12%;">Note Ramené (/10)</th>
                <th style="width: 12%;">Note Pondérée</th>
                <th style="width: 14%;">Appréciation</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>

    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <td style="background-color: #fafafa; font-weight: bold;">Somme des coefficients :</td>
                <td style="text-align: center; font-weight: bold; font-family: monospace;">${totalCoeff}</td>
            </tr>
            <tr>
                <td style="background-color: #fafafa; font-weight: bold;">Somme des Notes Pondérées :</td>
                <td style="text-align: center; font-weight: bold; font-family: monospace;">${totalPoints.toFixed(2)}</td>
            </tr>
            <tr style="background-color: #f0fdf4; border: 2px solid #15803d;">
                <td><strong style="color: #15803d; font-size: 13px;">MOYENNE DU TRIMESTRE :</strong></td>
                <td style="text-align: center; font-size: 16px; font-weight: 1000; color: #15803d; font-family: monospace;">${generalAvg} / 10</td>
            </tr>
        </table>
        
        <div style="width: 48%; float: left; padding: 12px; border-left: 3px solid #4f46e5; margin-top: 5px; box-sizing: border-box; background-color: #fbfbfb; border-radius: 4px;">
            <span style="font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold;">Décision du Conseil d’Établissement :</span>
            <p style="font-size: 13px; font-weight: bold; color: ${decisionColor}; margin: 8px 0 0 0; line-height: 1.4;">${decisionLabel}</p>
        </div>
    </div>

    <table class="signature-section signature-table">
        <tr>
            <td>
                <strong>Le Directeur d'Établissement</strong><br>
                ${isSigned ? `
                    <div class="stamp-box">
                        ✔ BULLETIN SCOLAIRE SIGNÉ<br>
                        <span style="font-size: 10px; font-weight: normal; font-family: monospace;">Auteur: ${signature.signedBy}</span>
                    </div>
                ` : `
                    <div class="stamp-box-pending">
                        ⚠️ NON ENCORE SIGNÉ PAR LE DIRECTEUR<br>
                        <span style="font-size: 9px; font-weight: normal; font-style: italic;">Validation électronique en attente</span>
                    </div>
                `}
            </td>
            <td>
                <strong>Le Secrétaire de Scolarité</strong><br>
                <div style="font-size: 10px; color: #777; margin-top: 5px;">Auteur du Tirage numérique et certifice conforme</div>
                <div style="margin-top: 15px; font-family: 'Courier New', monospace; font-size: 11px; border: 1px dashed #aaa; padding: 8px; display: inline-block; background-color: #fafafa; border-radius: 4px;">
                    Établi à Dakar le : ${new Date().toLocaleDateString('fr-FR')}<br>
                    Secrétariat SunuÉcole
                </div>
            </td>
        </tr>
    </table>

    <div style="margin-top: 60px; text-align: center; font-size: 9px; color: #777; border-top: 1px solid #eee; padding-top: 10px; font-style: italic;">
        Document académique unique généré de manière sécurisée via l'espace de gestion et de scolarité SunuÉcole Sénégal.
    </div>

</body>
</html>
    `);
    
    printW.document.close();
    // Wait for render then trigger print
    setTimeout(() => {
        printW.focus();
        printW.print();
    }, 600);
    
    window.showToast(`🖨️ Document d'impression officiel de ${std.firstName} ${std.lastName} envoyé de manière conforme.`, 'success');
};


// Global Active Variables setup to share across workspaces
window.currentRole = 'DIRECTEUR';
window.currentUser = null;
window.currentScreen = 'DASHBOARD';
window.secretaireActiveGradeFilter = 'CM2';
window.secretaireActiveDivisionFilter = 'A';
window.secretaireActiveTermFilter = '3e Trimestre';
window.secretaireSelectedStudentId = null;
window.activeTeacherTerm = null;
window.activeStudentTerm = null;
window.directeurActiveTermFilter = '3e Trimestre';
window.directeurActiveGradeFilter = 'CM2';
window.directeurActiveDivisionFilter = 'A';

// Helper for Grade Mentions in French System
window.getGradeMentionFrench = function(avg) {
    if (avg === null) return "Aucune note";
    if (avg >= 8.5) return "Excellent";
    if (avg >= 7.5) return "Très Bien";
    if (avg >= 6.5) return "Bien";
    if (avg >= 5.0) return "Assez Bien";
    if (avg >= 4.0) return "Passable";
    return "Insuffisant";
};

// Average calculations Engine
window.calculateOverallAverage = function(studentId, term) {
    const grades = window.db.grades.filter(g => g.studentId === studentId && g.term === term);
    if (grades.length === 0) return null;

    let totalWeightedScore = 0;
    let totalCoefficients = 0;

    grades.forEach(g => {
        totalWeightedScore += g.score * g.coefficient;
        totalCoefficients += g.coefficient;
    });

    return totalCoefficients > 0 ? (totalWeightedScore / totalCoefficients) : null;
};


// ----------------- TOAST SYSTEM -----------------
window.showToast = function(message, type = 'success') {
    const wrapper = document.getElementById('toast-wrapper');
    if (!wrapper) return; // Silent guarantee during transitions
    const alert = document.createElement('div');
    
    let bgClass = "bg-slate-900 border-emerald-500/50 text-emerald-400";
    let icon = "fa-circle-check";
    if (type === 'error') {
        bgClass = "bg-slate-900 border-red-500/50 text-red-400";
        icon = "fa-circle-xmark";
    } else if (type === 'info') {
        bgClass = "bg-slate-900 border-blue-500/50 text-blue-400";
        icon = "fa-circle-info";
    }

    alert.className = `flex items-center space-x-3 p-4 rounded-xl border ${bgClass} shadow-xl transform translate-y-2 opacity-0 transition duration-300`;
    alert.innerHTML = `
        <i class="fa-solid ${icon} text-lg shrink-0"></i>
        <p class="text-xs font-semibold">${message}</p>
    `;
    
    wrapper.appendChild(alert);
    setTimeout(() => {
        alert.classList.remove('translate-y-2', 'opacity-0');
    }, 50);

    setTimeout(() => {
        alert.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
};


// ----------------- LOGIN SYSTEM RENDERERS -----------------
window.selectLoginRole = function(role) {
    window.currentRole = role;
    
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active', 'bg-emerald-500', 'text-slate-950');
        tab.classList.add('text-slate-400');
    });
    const activeTab = document.getElementById(`tab-${role}`);
    if (activeTab) {
        activeTab.classList.add('bg-emerald-500', 'text-slate-950', 'active');
        activeTab.classList.remove('text-slate-400');
    }

    const emailInput = document.getElementById('login-email');
    const passLabel = document.getElementById('password-label');
    const passInput = document.getElementById('login-password');

    if (!emailInput || !passInput) return;

    if (role === 'DIRECTEUR') {
        emailInput.value = '';
        emailInput.placeholder = "directeur@sunuecole.sn";
        passLabel.innerText = "Mot de passe";
        passInput.placeholder = "••••";
    } else if (role === 'SECRETAIRE') {
        emailInput.value = '';
        emailInput.placeholder = "secretaire@sunuecole.sn";
        passLabel.innerText = "Mot de passe";
        passInput.placeholder = "••••";
    } else if (role === 'ENSEIGNANT') {
        emailInput.value = '';
        emailInput.placeholder = "fall@ecole.sn";
        passLabel.innerText = "Code Prof";
        passInput.placeholder = "••••";
    } else if (role === 'PARENT_ELEVE') {
        emailInput.value = '';
        emailInput.placeholder = "Identifiant ou matricule";
        passLabel.innerText = "N° d'inscription";
        passInput.placeholder = "Ex: SN-2026-001";
    }

    const errBox = document.getElementById('login-error-alert');
    if (errBox) errBox.classList.add('hidden');
};

window.togglePasswordVisibility = function() {
    const passInput = document.getElementById('login-password');
    const icon = document.getElementById('password-toggle-icon');
    if (!passInput || !icon) return;
    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.className = 'fa-solid fa-eye-slash text-xs';
    } else {
        passInput.type = 'password';
        icon.className = 'fa-solid fa-eye text-xs';
    }
};

window.handleLoginSubmit = function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin text-xs"></i>
            <span>Vérification...</span>
        `;
    }

    fetch('api.php?action=login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role: window.currentRole,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.success) {
            const u = data.user;
            window.currentUser = u;
            
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('workspace-screen').classList.remove('hidden');
            
            document.getElementById('header-user-badge').classList.remove('hidden');
            document.getElementById('header-username').innerText = u.name;
            document.getElementById('header-user-role').innerText = window.getRoleLabel(window.currentRole);

            window.showToast(`✅ Connexion réussie ! Bienvenue dans votre Espace Scolaire.`, 'success');
            
            if (window.initStorage) {
                window.initStorage();
            }

            window.setupWorkspace(window.currentUser);
        } else {
            throw new Error(data.message || "Identifiants incorrects.");
        }
    })
    .catch(err => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }

        const errorBox = document.getElementById('login-error-alert');
        const errorText = document.getElementById('login-error-text');
        if (errorBox && errorText) {
            errorText.innerText = "❌ Connexion refusée : " + err.message;
            errorBox.classList.remove('hidden');
        }
        window.showToast("❌ Connexion échouée", "error");
    });
};

window.getRoleLabel = function(role) {
    if (role === 'DIRECTEUR') return "Directeur";
    if (role === 'SECRETAIRE') return "Secrétariat";
    if (role === 'ENSEIGNANT') return "Enseignant";
    if (role === 'PARENT_ELEVE') return "Élève / Parent";
    return "Visiteur";
};

window.logout = function() {
    localStorage.removeItem('school_session');
    
    // Check if we are in a standalone app (directeur, enseignant, secretaire, eleve) or SPA login page
    const workspace = document.getElementById('workspace-screen');
    const badge = document.getElementById('header-user-badge');
    const login = document.getElementById('login-screen');
    
    if (!workspace || !login) {
        // Standalone page: just redirect to index.html
        window.location.href = "index.html";
        return;
    }
    
    // index.html SPA handling
    window.currentUser = null;
    window.activeTeacherTerm = null;
    window.activeStudentTerm = null;
    workspace.classList.add('hidden');
    if (badge) badge.classList.add('hidden');
    login.classList.remove('hidden');
    
    const passField = document.getElementById('login-password');
    if (passField) passField.value = '';
    window.showToast("ℹ️ Vous vous êtes déconnecté avec succès.");
};


// ----------------- INVITATIONS SENDERS -----------------
window.sendInvitationMail = function(email, name, code, classe) {
    const subject = encodeURIComponent(`Invitation SunuÉcole - Votre Code d'Enseignant (${classe})`);
    const appUrl = window.location.href.split('?')[0];
    const loginLink = `${appUrl}?role=ENSEIGNANT&code=${code}&email=${encodeURIComponent(email)}`;
    
    const body = encodeURIComponent(`Bonjour ${name},

Vous avez été invité par la Direction Générale à rejoindre l'application SunuÉcole en tant qu'enseignant titulaire pour la classe de ${classe}.

Voici vos identifiants de connexion sécurisés :
• Adresse e-mail : ${email}
• Code d'accès Enseignant : ${code}

Pour vous connecter automatiquement en un clic, utilisez ce lien d'accès direct :
${loginLink}

Si le lien direct ne fonctionne pas, vous pouvez vous rendre sur l'application et vous connecter manuellement avec vos identifiants ci-dessus.

Cordialement,
La Direction - SunuÉcole`);

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    window.showToast("📨 Ouverture de votre logiciel de messagerie...");
};

window.sendStudentInviteSms = function(contact, firstName, lastName, matricule) {
    if (!contact) {
        window.showToast("⚠️ Aucun numéro de parent configuré pour cet élève !", "error");
        return;
    }
    const cleanPhone = contact.replace(/\s+/g, '');
    const appUrl = window.location.href.split('?')[0];
    const directLink = `${appUrl}?role=PARENT_ELEVE&code=${matricule}`;
    const text = encodeURIComponent(`Bonjour, voici le matricule d'accès SunuÉcole pour votre enfant ${firstName} ${lastName} : ${matricule}\n\nLien de connexion direct un-clic : ${directLink}`);
    
    window.open(`sms:${cleanPhone}?body=${text}`, '_blank');
    window.showToast("📱 Ouverture de l'application SMS...");
};

window.handleUrlParametersOnLoad = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const code = urlParams.get('code');
    const email = urlParams.get('email');

    if (role) {
        window.selectLoginRole(role);
        if (email) {
            const el = document.getElementById('login-email');
            if (el) el.value = email;
        }
        if (code) {
            const el = document.getElementById('login-password');
            if (el) el.value = code;
        }
        if (email && code) {
            window.showToast("⚡ Code d'accès invitation détecté ! Connexion automatique...", "info");
            setTimeout(() => {
                const form = document.getElementById('login-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }, 800);
        }
    }
};

// ==========================================================================
// ACCESSIBILITÉ DE PREMIER ORDRE - WIDGET GLOBAL POUR SUNUÉCOLE
// ==========================================================================
window.addEventListener('load', () => {
    // 1. Déclarer et injecter les feuilles de styles d'accessibilité
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        /* Styles utiles pour le menu d'accessibilité */
        #sunu-accessibility-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px solid #000000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 20px;
        }
        #sunu-accessibility-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        #sunu-accessibility-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 320px;
            max-width: calc(100vw - 40px);
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            padding: 16px;
            font-family: inherit;
            display: none;
            flex-direction: column;
            gap: 12px;
        }
        .access-title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 8px;
            margin-bottom: 4px;
        }
        .access-section-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
        }
        .access-btn-grid {
            display: grid;
            grid-template-cols: repeat(3, 1fr);
            gap: 4px;
        }
        .access-action-btn {
            background-color: #1e293b;
            color: #e2e8f0;
            border: 1px solid #334155;
            padding: 6px 4px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }
        .access-action-btn:hover {
            background-color: #334155;
            color: #ffffff;
        }
        .access-action-btn.active {
            background-color: #10b981;
            color: #020617;
            border-color: #10b981;
        }
        
        /* Styles pour les malvoyants - Dyslexie hachage */
        body.access-dyslexia, body.access-dyslexia * {
            font-family: "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Trebuchet MS", sans-serif !important;
            letter-spacing: 0.12em !important;
            word-spacing: 0.18em !important;
            line-height: 1.8 !important;
        }
        
        /* Styles haute visibilité contrastes */
        body.access-high-contrast {
            background-color: #000000 !important;
            color: #ffff00 !important;
        }
        body.access-high-contrast * {
            background-color: #000000 !important;
            color: #ffff00 !important;
            border-color: #ffff00 !important;
            text-shadow: none !important;
            box-shadow: none !important;
        }
        body.access-high-contrast iframe, body.access-high-contrast img, body.access-high-contrast svg {
            filter: contrast(150%) brightness(120%) !important;
        }
        body.access-high-contrast button, body.access-high-contrast a, body.access-high-contrast input {
            border: 2px solid #ffff00 !important;
            color: #ffff00 !important;
            background: #000000 !important;
            text-decoration: underline !important;
        }
        body.access-high-contrast button:hover, body.access-high-contrast a:hover {
            background: #ffff00 !important;
            color: #000000 !important;
        }
        body.access-high-contrast input::placeholder {
            color: #00ff00 !important;
        }
        
        /* Styles noir et blanc monochrome */
        body.access-monochrome {
            filter: grayscale(100%) !important;
        }
        
        /* Cadre de lecture vocale actif */
        .speak-focused {
            outline: 3px solid #10b981 !important;
            outline-offset: 4px !important;
            background-color: rgba(16, 185, 129, 0.1) !important;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. Créer l'icône flottante d'accessibilité
    const floatBtn = document.createElement('button');
    floatBtn.id = "sunu-accessibility-btn";
    floatBtn.setAttribute('aria-label', "Options d'accessibilité et d'ergonomie");
    floatBtn.setAttribute('title', "Menu d'accessibilité (Taille, Contraste, Lecture vocale)");
    floatBtn.innerHTML = '<i class="fa-solid fa-universal-access"></i>';
    document.body.appendChild(floatBtn);

    // 3. Créer le panneau d'accessibilité
    const panel = document.createElement('div');
    panel.id = "sunu-accessibility-panel";
    panel.innerHTML = `
        <div class="access-title-bar">
            <span class="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center space-x-1.5">
                <i class="fa-solid fa-universal-access text-emerald-400"></i>
                <span>Accessibilité</span>
            </span>
            <button id="sunu-access-close" class="text-slate-400 hover:text-red-400 text-xs transition">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        
        <div>
            <p class="access-section-title mb-1.5 flex justify-between">
                <span>Taille du texte</span>
                <span id="access-zoom-lbl" class="text-[9px] font-mono text-emerald-400 font-bold">100%</span>
            </p>
            <div class="grid grid-cols-3 gap-1">
                <button class="access-action-btn" id="access-zoom-dec"><i class="fa-solid fa-minus text-[9px]"></i> Diminuer</button>
                <button class="access-action-btn" id="access-zoom-rst">Normal</button>
                <button class="access-action-btn" id="access-zoom-inc"><i class="fa-solid fa-plus text-[9px]"></i> Agrandir</button>
            </div>
        </div>

        <div>
            <p class="access-section-title mb-1.5">Contraste & Couleur</p>
            <div class="grid grid-cols-3 gap-1">
                <button class="access-action-btn" id="access-color-normal">Normal</button>
                <button class="access-action-btn" id="access-color-contrast">Élevé</button>
                <button class="access-action-btn" id="access-color-gray">Monochrom.</button>
            </div>
        </div>

        <div>
            <p class="access-section-title mb-1.5">Aide Visuelle & Lecture</p>
            <div class="grid grid-cols-2 gap-1">
                <button class="access-action-btn" id="access-font-dys">Police Dyslexie</button>
                <button class="access-action-btn" id="access-tts-toggle"><i class="fa-solid fa-volume-high text-[9px]"></i> Lecteur Vocal</button>
            </div>
        </div>

        <p class="text-[8px] text-slate-600 text-center uppercase font-black leading-relaxed mt-1 border-t border-slate-900 pt-2">
            SunuÉcole • Haute Accessibilité pour tous
        </p>
    `;
    document.body.appendChild(panel);

    // 4. Initialisation des états du LocalStorage
    let textZoom = parseFloat(localStorage.getItem('access_text_zoom') || '1.0');
    let colorMode = localStorage.getItem('access_color_mode') || 'normal'; // 'normal', 'contrast', 'grayscale'
    let isDyslexiaActive = localStorage.getItem('access_dys_active') === 'true';
    let isTtsActive = localStorage.getItem('access_tts_active') === 'true';

    // Appliquer instantanément les valeurs enregistrées au chargement de chaque page
    function applyAllSettings() {
        // A. Appliquer le zoom du texte (Mise à l'échelle Tailwind via HTML root)
        document.documentElement.style.fontSize = (textZoom * 16) + 'px';
        document.getElementById('access-zoom-lbl').innerText = Math.round(textZoom * 100) + '%';

        // B. Appliquer le mode de couleur
        document.body.classList.remove('access-high-contrast', 'access-monochrome');
        document.getElementById('access-color-normal').classList.remove('active');
        document.getElementById('access-color-contrast').classList.remove('active');
        document.getElementById('access-color-gray').classList.remove('active');

        if (colorMode === 'contrast') {
            document.body.classList.add('access-high-contrast');
            document.getElementById('access-color-contrast').classList.add('active');
        } else if (colorMode === 'grayscale') {
            document.body.classList.add('access-monochrome');
            document.getElementById('access-color-gray').classList.add('active');
        } else {
            document.getElementById('access-color-normal').classList.add('active');
        }

        // C. Appliquer le mode dyslexie
        if (isDyslexiaActive) {
            document.body.classList.add('access-dyslexia');
            document.getElementById('access-font-dys').classList.add('active');
        } else {
            document.body.classList.remove('access-dyslexia');
            document.getElementById('access-font-dys').classList.remove('active');
        }

        // D. Appliquer l'état du Lecteur Vocal
        if (isTtsActive) {
            document.getElementById('access-tts-toggle').classList.add('active');
        } else {
            document.getElementById('access-tts-toggle').classList.remove('active');
        }
    }

    applyAllSettings();

    // 5. Associer les événements d'interface du panneau
    floatBtn.addEventListener('click', () => {
        panel.style.display = (panel.style.display === 'flex') ? 'none' : 'flex';
    });

    document.getElementById('sunu-access-close').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    // Échelle du texte
    document.getElementById('access-zoom-dec').addEventListener('click', () => {
        if (textZoom > 0.8) {
            textZoom -= 0.1;
            localStorage.setItem('access_text_zoom', textZoom.toFixed(1));
            applyAllSettings();
        }
    });
    document.getElementById('access-zoom-rst').addEventListener('click', () => {
        textZoom = 1.0;
        localStorage.setItem('access_text_zoom', '1.0');
        applyAllSettings();
    });
    document.getElementById('access-zoom-inc').addEventListener('click', () => {
        if (textZoom < 1.6) {
            textZoom += 0.1;
            localStorage.setItem('access_text_zoom', textZoom.toFixed(1));
            applyAllSettings();
        }
    });

    // Mode contrate
    document.getElementById('access-color-normal').addEventListener('click', () => {
        colorMode = 'normal';
        localStorage.setItem('access_color_mode', 'normal');
        applyAllSettings();
    });
    document.getElementById('access-color-contrast').addEventListener('click', () => {
        colorMode = 'contrast';
        localStorage.setItem('access_color_mode', 'contrast');
        applyAllSettings();
    });
    document.getElementById('access-color-gray').addEventListener('click', () => {
        colorMode = 'grayscale';
        localStorage.setItem('access_color_mode', 'grayscale');
        applyAllSettings();
    });

    // Aide Dyslexie
    document.getElementById('access-font-dys').addEventListener('click', () => {
        isDyslexiaActive = !isDyslexiaActive;
        localStorage.setItem('access_dys_active', isDyslexiaActive);
        applyAllSettings();
    });

    // 6. MOTEUR SYNTHÉTISEUR VOCAL (LECTEUR D'ÉCRAN DYNAMIQUE EN FRANÇAIS)
    let lastSpokenText = '';
    
    document.getElementById('access-tts-toggle').addEventListener('click', () => {
        isTtsActive = !isTtsActive;
        localStorage.setItem('access_tts_active', isTtsActive);
        applyAllSettings();

        if (isTtsActive) {
            speakText("Le lecteur vocal d'écran est activé. Survolez ou touchez un texte pour l'écouter.");
        } else {
            window.speechSynthesis.cancel();
        }
    });

    function speakText(text) {
        if (!text || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Annule la récitation précédente
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    // Capture des survols de souris/toucher pour la récitation vocale
    const elementsSelectors = 'h1, h2, h3, h4, h5, p, label, button, option, span.font-bold, td';
    
    document.addEventListener('mouseover', (e) => {
        if (!isTtsActive) return;
        
        const target = e.target.closest(elementsSelectors);
        if (target && target.id !== 'sunu-accessibility-btn' && !panel.contains(target)) {
            const rawText = target.innerText || target.getAttribute('placeholder') || target.getAttribute('aria-label');
            if (rawText && rawText !== lastSpokenText) {
                target.classList.add('speak-focused');
                speakText(rawText);
                lastSpokenText = rawText;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(elementsSelectors);
        if (target) {
            target.classList.remove('speak-focused');
            lastSpokenText = '';
        }
    });
});
