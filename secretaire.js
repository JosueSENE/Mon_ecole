/* ==========================================================================
   SUNU ÉCOLE - MODULE 3: SECRÉTARIAT WORKSPACE & BULLETINS GENERATORS
   ========================================================================== */

// 1. STUDENT REGISTRATION (Inscription)
window.renderSecretaireInscription = function(container) {
    const nextMatriculeInt = window.db.students.length > 0 ? Math.max(...window.db.students.map(s => s.id)) + 1 : 1;
    const nextMatriculeString = "SN-2026-" + String(nextMatriculeInt).padStart(3, '0');

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl max-w-2xl mx-auto shadow-md space-y-4">
                <div class="flex items-center space-x-3 border-b border-slate-800 pb-3">
                    <div class="w-10 h-10 bg-indigo-500/10 text-indigo-400 text-lg rounded-lg flex items-center justify-center font-bold">
                        <i class="fa-solid fa-address-card"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-black text-white uppercase tracking-wider">Fiche d'Inscription Administrative (Nouvel Élève)</h4>
                        <p class="text-[11px] text-slate-500 font-semibold uppercase mt-0.5">Scolarité d'Excellence CI au CM2</p>
                    </div>
                </div>

                <form id="inscription-form" onsubmit="window.handleNewStudentSubmit(event)" class="space-y-4 pt-1.5">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prénom de l'Élève</label>
                            <input type="text" id="s-firstname" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 placeholder-slate-700 focus:outline-emerald-500 font-bold" placeholder="Ex: Souleymane">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom de Famille</label>
                            <input type="text" id="s-lastname" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 placeholder-slate-705 focus:outline-emerald-500 font-black uppercase" placeholder="Ex: DIALLO">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Genre</label>
                            <select id="s-gender" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                                <option value="M">Masculin (Garçon)</option>
                                <option value="F">Féminin (Fille)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date de naissance</label>
                            <input type="date" id="s-birthdate" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Niveau d'Affectation</label>
                            <select id="s-grade" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                                <option value="CI">CI (Cours d'initiation)</option>
                                <option value="CP">CP (Cours préparatoire)</option>
                                <option value="CE1">CE1 (Cours élémentaire 1)</option>
                                <option value="CE2">CE2 (Cours élémentaire 2)</option>
                                <option value="CM1">CM1 (Cours moyen 1)</option>
                                <option value="CM2">CM2 (Cours moyen 2)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Division d'élèves</label>
                            <select id="s-division" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                                <option value="A">Division A</option>
                                <option value="B">Division B</option>
                                <option value="C">Division C</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Numéro GSM d'un parent responsable</label>
                        <input type="text" id="s-contact" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 placeholder-slate-700 focus:outline-emerald-500 font-mono" placeholder="Ex: +221 77 000 00 00">
                    </div>

                    <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                            <span class="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Matricule Conforme Attribué</span>
                            <span class="font-mono text-sm font-black text-indigo-400">${nextMatriculeString}</span>
                        </div>
                        <span class="px-2 py-0.5 text-[9px] font-extrabold text-indigo-400 bg-indigo-500/10 rounded border border-indigo-500/20 uppercase tracking-widest font-mono">Génération auto</span>
                    </div>

                    <button type="submit" class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase rounded-lg transition hover:scale-[1.015]">
                        Confirmer l'Inscription
                    </button>
                </form>
            </div>
        </div>
    `;
};

window.handleNewStudentSubmit = function(event) {
    event.preventDefault();
    const firstname = document.getElementById('s-firstname').value.trim();
    const lastname = document.getElementById('s-lastname').value.trim();
    const gender = document.getElementById('s-gender').value;
    const birthdate = document.getElementById('s-birthdate').value;
    const grade = document.getElementById('s-grade').value;
    const division = document.getElementById('s-division').value;
    const contact = document.getElementById('s-contact').value.trim();

    const nextId = window.db.students.length > 0 ? Math.max(...window.db.students.map(s => s.id)) + 1 : 1;
    const matricule = "SN-2026-" + String(nextId).padStart(3, '0');

    const obj = {
        id: nextId,
        firstName: firstname,
        lastName: lastname,
        classGrade: grade,
        classDivision: division,
        gender: gender,
        birthDate: birthdate,
        parentContact: contact,
        studentNumber: matricule
    };

    window.db.students.push(obj);
    window.saveToStorage('students');
    window.showToast(`🎉 Élève ${firstname} ${lastname} inscrit sous le matricule unique ${matricule}!`, 'success');
    window.switchScreen('STUDENTS');
};


// 2. STUDENT DIRECTORY LISTS (Registre)
window.renderSecrétaireStudents = function(container) {
    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Table and actions card -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                    <div>
                        <h4 class="text-sm font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-address-book text-emerald-400 mr-2"></i>Registre Éléves & Fiche Parents</h4>
                        <p class="text-xs text-slate-500 mt-1">Registre global des élèves de SunuÉcole.</p>
                    </div>
                </div>

                <div class="overflow-x-auto text-left">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-950 text-slate-500 text-[9px] uppercase border-b border-slate-800">
                            <tr>
                                <th class="p-3">Matricule</th>
                                <th class="p-3">Identité Prénom & Nom</th>
                                <th class="p-3">Genre</th>
                                <th class="p-3">Classe</th>
                                <th class="p-3">Date Naissance</th>
                                <th class="p-3">GSM Parent</th>
                                <th class="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            ${window.db.students.map(s => `
                                <tr class="hover:bg-slate-950/40">
                                    <td class="p-3 font-mono text-[10px] font-black text-indigo-400">${s.studentNumber}</td>
                                    <td class="p-3 font-extrabold text-slate-200">${s.firstName} ${s.lastName}</td>
                                    <td class="p-3">
                                        ${s.gender === 'F' ? '<span class="text-rose-450"><i class="fa-solid fa-venus mr-1"></i>Féminin</span>' : '<span class="text-cyan-450"><i class="fa-solid fa-mars mr-1"></i>Masculin</span>'}
                                    </td>
                                    <td class="p-3">
                                        <span class="px-2.5 py-1 bg-slate-800 text-slate-350 rounded font-black">${s.classGrade}-${s.classDivision}</span>
                                    </td>
                                    <td class="p-3 font-mono text-slate-400">${s.birthDate}</td>
                                    <td class="p-3 font-mono text-slate-300">${s.parentContact || 'Non affecté'}</td>
                                    <td class="p-3 text-right flex justify-end space-x-1">
                                        <button onclick="window.sendStudentInviteSms('${s.parentContact}', '${s.firstName}', '${s.lastName}', '${s.studentNumber}')" class="p-2 bg-slate-800 hover:bg-slate-750 text-slate-350 rounded-lg text-[10px] font-bold transition mr-1" title="Envoyer le matricule d'accès par SMS">
                                            <i class="fa-solid fa-comment-sms"></i> Invite SMS
                                        </button>
                                        <button onclick="window.deleteStudent(${s.id})" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition" title="Supprimer de l'école">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

window.deleteStudent = function(id) {
    if (confirm("⚠️ Alerte CRITIQUE : Souhaitez-vous vraiment radier cet élève définitivement ? \nToutes ses notes et traces de présences seront supprimées du registre.")) {
        window.db.students = window.db.students.filter(x => x.id !== id);
        window.db.grades = window.db.grades.filter(g => g.studentId !== id);
        window.db.attendance = window.db.attendance.filter(a => a.studentId !== id);
        window.db.signedBulletins = window.db.signedBulletins.filter(s => s.studentId !== id);
        
        window.saveToStorage('students');
        window.saveToStorage('grades');
        window.saveToStorage('attendance');
        window.saveToStorage('signedBulletins');
        
        window.showToast("🛑 Radiation effectuée avec succès.");
        window.renderSecrétaireStudents(document.getElementById('screen-container'));
    }
};


// 3. SECRETAIRE BULLETINS PRINT AND STATUS REVIEW
window.renderSecretaireBulletins = function(container) {
    const classStudents = window.db.students.filter(s => {
        return s.classGrade === window.secretaireActiveGradeFilter && s.classDivision === window.secretaireActiveDivisionFilter;
    });

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Filter Bar -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div class="space-y-1">
                    <h4 class="text-sm font-black text-white uppercase tracking-wide">Tirage de Bulletins scolaires officiels</h4>
                    <p class="text-xs text-slate-500">Impression groupée ou individuelle de bulletins d'élèves visés par la Direction.</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <select onchange="window.secretaireActiveTermFilter=this.value; window.renderSecretaireBulletins(document.getElementById('screen-container'))" 
                        class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500 font-bold">
                        <option value="1er Trimestre" ${window.secretaireActiveTermFilter==='1er Trimestre'?'selected':''}>1er Trimestre</option>
                        <option value="2e Trimestre" ${window.secretaireActiveTermFilter==='2e Trimestre'?'selected':''}>2e Trimestre</option>
                        <option value="3e Trimestre" ${window.secretaireActiveTermFilter==='3e Trimestre'?'selected':''}>3e Trimestre</option>
                    </select>

                    <select onchange="window.secretaireActiveGradeFilter=this.value; window.renderSecretaireBulletins(document.getElementById('screen-container'))" 
                        class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500 font-bold">
                        <option value="CI" ${window.secretaireActiveGradeFilter==='CI'?'selected':''}>CI</option>
                        <option value="CP" ${window.secretaireActiveGradeFilter==='CP'?'selected':''}>CP</option>
                        <option value="CE1" ${window.secretaireActiveGradeFilter==='CE1'?'selected':''}>CE1</option>
                        <option value="CE2" ${window.secretaireActiveGradeFilter==='CE2'?'selected':''}>CE2</option>
                        <option value="CM1" ${window.secretaireActiveGradeFilter==='CM1'?'selected':''}>CM1</option>
                        <option value="CM2" ${window.secretaireActiveGradeFilter==='CM2'?'selected':''}>CM2</option>
                    </select>

                    <select onchange="window.secretaireActiveDivisionFilter=this.value; window.renderSecretaireBulletins(document.getElementById('screen-container'))" 
                        class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500 font-bold">
                        <option value="A" ${window.secretaireActiveDivisionFilter==='A'?'selected':''}>Division A</option>
                        <option value="B" ${window.secretaireActiveDivisionFilter==='B'?'selected':''}>Division B</option>
                        <option value="C" ${window.secretaireActiveDivisionFilter==='C'?'selected':''}>Division C</option>
                    </select>
                </div>
            </div>

            <!-- Bulletins list review -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h5 class="text-xs font-black text-white uppercase tracking-wider">Bulletins de la Classe (${window.secretaireActiveGradeFilter}-${window.secretaireActiveDivisionFilter})</h5>
                    <button onclick="window.printClassBulletinsPDF('${window.secretaireActiveGradeFilter}', '${window.secretaireActiveDivisionFilter}', '${window.secretaireActiveTermFilter}')" 
                        class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase rounded shadow transition hover:scale-[1.015]">
                        <i class="fa-solid fa-print mr-1"></i> Impression Groupée (Classe Complète)
                    </button>
                </div>

                <div class="overflow-x-auto text-left">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-950 text-slate-500 text-[9px] uppercase border-b border-slate-800">
                            <tr>
                                <th class="p-3">Matricule</th>
                                <th class="p-3">Prénom & Nom</th>
                                <th class="p-3 text-center">Trimestre</th>
                                <th class="p-3 text-center">Moyenne Scolaire</th>
                                <th class="p-3 text-center">État de Viseur</th>
                                <th class="p-3 text-right">Fiche d'édition</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            ${classStudents.length === 0 ? `<tr><td colspan="6" class="p-4 text-center text-slate-500">Aucun élève trouvé pour cette classe d'affectation.</td></tr>` : 
                                classStudents.map(std => {
                                    const average = window.calculateOverallAverage(std.id, window.secretaireActiveTermFilter);
                                    let avgText = average !== null ? `${average.toFixed(2)}/10` : 'Pas de note';
                                    let avgClass = average !== null ? (average >= 5 ? 'text-emerald-400 font-extrabold' : 'text-rose-400') : 'text-slate-600';
                                    
                                    const signature = window.db.signedBulletins.find(sb => sb.studentId === std.id && sb.term === window.secretaireActiveTermFilter);
                                    const isSigned = signature ? signature.isSigned : false;

                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-mono text-[10px] text-slate-500">${std.studentNumber}</td>
                                            <td class="p-3 font-extrabold text-slate-200">${std.firstName} ${std.lastName}</td>
                                            <td class="p-3 text-center font-bold text-slate-300 uppercase text-[9px]">${window.secretaireActiveTermFilter}</td>
                                            <td class="p-3 text-center font-mono ${avgClass} text-sm">${avgText}</td>
                                            <td class="p-3 text-center">
                                                ${isSigned ? 
                                                    '<span class="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">✔ Signé par Directeur</span>' : 
                                                    '<span class="px-2 py-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full">⌛ En attente de signature</span>'
                                                }
                                            </td>
                                            <td class="p-3 text-right">
                                                <button onclick="window.previewStudentBulletinPDF(${std.id}, '${window.secretaireActiveTermFilter}')" 
                                                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-705 text-slate-350 rounded-lg text-[10px] font-black uppercase shadow transition">
                                                    <i class="fa-solid fa-print mr-1"></i> Imprimer
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};


// 4. PRINT PREVIEW WINDOW & PDF SIMULATOR FOR SINGLE PUPIL (Delegated to shared helper in data.js)
// window.previewStudentBulletinPDF remains fully functional and accessible from windows namespace via data.js.


// 5. BULK PRINT CLASS-WIDE COHORT BULLETINS
window.printClassBulletinsPDF = function(grade, division, term) {
    const levelStudents = window.db.students.filter(s => s.classGrade === grade && s.classDivision === division);
    
    // Critical filter: Only signed bulletins
    const signedStudents = levelStudents.filter(std => {
        return window.db.signedBulletins.some(sb => sb.studentId === std.id && sb.term === term && sb.isSigned);
    });

    if (signedStudents.length === 0) {
        window.showToast(`⚠️ Aucun bulletin signé par le Directeur pour la classe ${grade}-${division} au ${term}. Impossible d'imprimer.`, 'error');
        return;
    }

    // Open print window
    const printW = window.open("", "_blank", "width=850,height=1100");
    if (!printW) {
        window.showToast("⚠️ Le bloqueur de popups a empêché l'impression. Veuillez autoriser les popups.", 'error');
        return;
    }

    let fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Impression Groupée - Bulletins ${grade}-${division} (${term.toUpperCase()})</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #222;
            margin: 0;
            padding: 20px;
            background-color: #fff;
            -webkit-print-color-adjust: exact;
        }
        .bulletin-page {
            page-break-after: always;
            box-sizing: border-box;
            padding: 10px;
        }
        .bulletin-page:last-child {
            page-break-after: avoid;
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
            font-size: 18px;
            font-weight: 900;
            margin: 20px 0 15px 0;
            letter-spacing: 1px;
            text-decoration: underline;
        }
        .student-info-box {
            border: 2px solid #333;
            padding: 12px;
            margin-bottom: 20px;
            background-color: #fcfcfc;
            border-radius: 6px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 4px 6px;
            font-size: 12px;
        }
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .grades-table th {
            border: 1.5px solid #222;
            background-color: #f0f0f0 !important;
            padding: 8px 6px;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .grades-table td {
            border: 1px solid #ccc;
            padding: 8px 6px;
            font-size: 12px;
        }
        .totals-section {
            width: 100%;
            margin-bottom: 25px;
            display: inline-block;
        }
        .totals-table {
            width: 48%;
            float: right;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 1.5px solid #222;
        }
        .totals-table td {
            padding: 6px 10px;
            border: 1px solid #222;
            font-size: 12px;
        }
        .signature-section {
            width: 100%;
            margin-top: 30px;
            clear: both;
        }
        .signature-table {
            width: 100%;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            font-size: 12px;
            vertical-align: top;
            padding-top: 5px;
        }
        .stamp-box {
            border: 2px dashed #2e7d32;
            color: #2e7d32;
            background-color: #e8f5e9;
            padding: 8px;
            display: inline-block;
            font-weight: bold;
            font-size: 11px;
            margin-top: 8px;
            border-radius: 4px;
            text-align: center;
        }
        @media print {
            body {
                padding: 0;
            }
            .bulletin-page {
                padding: 10px 0;
            }
        }
    </style>
</head>
<body>
`;

    signedStudents.forEach(std => {
        const grades = window.db.grades.filter(g => g.studentId === std.id && g.term === term);
        const signature = window.db.signedBulletins.find(sb => sb.studentId === std.id && sb.term === term);
        const average = window.calculateOverallAverage(std.id, term);

        let rowsHtml = "";
        if (grades.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="7" style="padding: 15px; text-align: center; font-style: italic; color: #555;">
                        Aucune note enregistrée dans le système pour ce trimestre.
                    </td>
                </tr>
            `;
        } else {
            grades.forEach(g => {
                const score10 = (g.score / g.maxScore) * 10;
                const weighted = score10 * g.coefficient;
                let appreciation = "Moyen";
                if (score10 >= 8.5) appreciation = "Très Bien";
                else if (score10 >= 7) appreciation = "Bien";
                else if (score10 >= 5) appreciation = "Assez Bien";
                else appreciation = "Insuffisant";

                rowsHtml += `
                    <tr>
                        <td style="padding: 8px; text-align: left; font-weight: bold;">${g.subject}</td>
                        <td style="padding: 8px; text-align: left; font-size: 11px; color: #555;">${g.subSubject || 'Évaluation globale'}</td>
                        <td style="padding: 8px; text-align: center; font-weight: bold;">${g.coefficient}</td>
                        <td style="padding: 8px; text-align: center;">${g.score.toFixed(1)} / ${g.maxScore}</td>
                        <td style="padding: 8px; text-align: center; font-weight: bold; color: #333;">${score10.toFixed(2)} / 10</td>
                        <td style="padding: 8px; text-align: center; font-weight: bold; color: #111;">${weighted.toFixed(2)}</td>
                        <td style="padding: 8px; text-align: center; font-size: 11px; font-style: italic;">${appreciation}</td>
                    </tr>
                `;
            });
        }

        const totalCoeff = grades.reduce((acc, current) => acc + current.coefficient, 0);
        const totalPoints = grades.reduce((acc, current) => acc + ((current.score / current.maxScore) * 10 * current.coefficient), 0);
        const generalAvg = average !== null ? average.toFixed(2) : "--";

        let decisionLabel = "En cours de validation";
        let decisionColor = "#333";
        if (average !== null) {
            if (average >= 7.5) {
                decisionLabel = "Admis • Félicitations";
                decisionColor = "#2e7d32";
            } else if (average >= 5.0) {
                decisionLabel = "Admis au niveau supérieur";
                decisionColor = "#1565c0";
            } else {
                decisionLabel = "Doit redoubler d'efforts";
                decisionColor = "#c62828";
            }
        }

        fullHtml += `
<div class="bulletin-page">
    <table class="header-table">
        <tr>
            <td class="header-left" style="width: 40%;">
                <strong>RÉPUBLIQUE DU SÉNÉGAL</strong><br>
                Un Peuple - Un But - Une Foi<br>
                -------------------------<br>
                <strong>MINISTÈRE DE L'ÉDUCATION NATIONALE</strong><br>
                Inspection de l'Éducation (IEF)<br>
                Académie Scolaire Dakar
            </td>
            <td class="header-central" style="width: 20%;">
                <span style="font-size: 24px; font-weight: bold; border: 2.5px solid #333; padding: 4px 10px; border-radius: 6px;">SE</span>
            </td>
            <td class="header-right" style="width: 40%;">
                <strong>ÉCOLE PRIMAIRE SUNUECOLE</strong><br>
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
                <td style="width: 45%; font-size: 14px; font-weight: bold; color: #111;">${std.firstName} ${std.lastName}</td>
                <td style="width: 20%;"><strong>N° d'Inscr. :</strong></td>
                <td style="width: 20%; font-family: monospace; font-weight: bold; color: #4338ca;">${std.studentNumber}</td>
            </tr>
            <tr>
                <td><strong>Classe:</strong></td>
                <td><strong>${std.classGrade} - DIVISION ${std.classDivision}</strong></td>
                <td><strong>Date de Naiss. :</strong></td>
                <td>${std.birthDate}</td>
            </tr>
            <tr>
                <td><strong>Genre :</strong></td>
                <td>${std.gender === 'F' ? 'Féminin (F)' : 'Masculin (M)'}</td>
                <td><strong>Contact GSM :</strong></td>
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
                <th style="width: 12%;">Note (/10)</th>
                <th style="width: 12%;">Pondérée</th>
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
                <td style="text-align: center; font-weight: bold;">${totalCoeff}</td>
            </tr>
            <tr>
                <td style="background-color: #fafafa; font-weight: bold;">Somme des Notes Pondérées :</td>
                <td style="text-align: center; font-weight: bold;">${totalPoints.toFixed(2)}</td>
            </tr>
            <tr style="background-color: #f0fdf4; border: 2.5px solid #15803d;">
                <td><strong style="color: #15803d; font-size: 12px;">MOYENNE DU TRIMESTRE :</strong></td>
                <td style="text-align: center; font-size: 15px; font-weight: bold; color: #15803d;">${generalAvg} / 10</td>
            </tr>
        </table>
        
        <div style="width: 48%; float: left; padding: 10px; border-left: 3px solid #4f46e5; margin-top: 5px; box-sizing: border-box; background-color: #fbfbfb; border-radius: 4px;">
            <span style="font-size: 9px; text-transform: uppercase; color: #666; font-weight: bold;">Conseil d’Établissement :</span>
            <p style="font-size: 12px; font-weight: bold; color: ${decisionColor}; margin: 4px 0 0 0; line-height: 1.4;">${decisionLabel}</p>
        </div>
    </div>

    <table class="signature-section signature-table">
        <tr>
            <td>
                <strong>Le Directeur d'Établissement</strong><br>
                <div class="stamp-box">
                    ✔ ÉLECTRONIQUEMENT VISÉ & SIGNÉ<br>
                    <span style="font-size: 9px; font-weight: normal; font-family: monospace;">Signataire: ${signature.signedBy}</span>
                </div>
            </td>
            <td>
                <strong>Le Secrétaire de Scolarité</strong><br>
                <div style="font-size: 9px; color: #777; margin-top: 5px;">Rapport d'impression certifié conforme</div>
                <div style="margin-top: 10px; font-family: monospace; font-size: 10px; border: 1px dashed #aaa; padding: 6px; display: inline-block; background-color: #fafafa;">
                    Estampillé à Dakar le : ${new Date().toLocaleDateString('fr-FR')}
                </div>
            </td>
        </tr>
    </table>
</div>
`;
    });

    fullHtml += `
</body>
</html>
`;

    printW.document.write(fullHtml);
    printW.document.close();
    
    setTimeout(() => {
        printW.focus();
        printW.print();
    }, 800);

    window.showToast(`🖨️ Impression groupée lancée : ${signedStudents.length} bulletins signés envoyés à l'imprimante !`, 'success');
};
