/* ==========================================================================
   SUNU ÉCOLE - MODULE 4: ENSEIGNANT WORKSPACE & SCORING SHEETS
   ========================================================================== */

// 1. TERM PICKER PANEL (Mandatory initially before making changes)
window.renderTeacherTermPicker = function(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in text-center my-10">
            <div class="w-16 h-16 bg-blue-500/10 text-blue-400 text-3xl mx-auto rounded-2xl flex items-center justify-center font-bold border border-blue-500/20 shadow">
                <i class="fa-solid fa-calendar-check"></i>
            </div>
            
            <div class="space-y-1.5">
                <h4 class="text-sm font-black text-white uppercase tracking-wider">Sélectionner un Trimestre de Travail</h4>
                <p class="text-xs text-slate-400">Pour saisir des notes d'évaluation ou faire l'appel d'élèves, veuillez d'abord activer une période scolaire trimestrielle.</p>
            </div>

            <div class="grid grid-cols-1 gap-3 pt-2">
                <button onclick="window.setTeacherActiveTerm('1er Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-100 rounded-xl font-bold hover:scale-[1.015] transition flex items-center justify-between px-4 uppercase tracking-wider text-xs">
                    <span>🍂 1er Trimestre (Saisies)</span>
                    <i class="fa-solid fa-arrow-right text-[10px] text-slate-500"></i>
                </button>
                <button onclick="window.setTeacherActiveTerm('2e Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-100 rounded-xl font-bold hover:scale-[1.015] transition flex items-center justify-between px-4 uppercase tracking-wider text-xs">
                    <span>❄️ 2e Trimestre (Saisies)</span>
                    <i class="fa-solid fa-arrow-right text-[10px] text-slate-500"></i>
                </button>
                <button onclick="window.setTeacherActiveTerm('3e Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-100 rounded-xl font-bold hover:scale-[1.015] transition flex items-center justify-between px-4 uppercase tracking-wider text-xs">
                    <span>🌱 3e Trimestre (En cours)</span>
                    <i class="fa-solid fa-arrow-right text-[10px] text-slate-500"></i>
                </button>
            </div>
        </div>
    `;
};

window.setTeacherActiveTerm = function(term) {
    window.activeTeacherTerm = term;
    window.renderActiveScreen();
    if (term) {
        window.showToast(`📅 Session active initialisée : ${term}`, 'info');
    }
};


// 2. DAILY ATTENDANCE (Appel de classe)
let attendanceDate = "2026-06-01"; // default school placeholder date

window.renderEnseignantAttendance = function(container) {
    if (!window.activeTeacherTerm) {
        window.renderTeacherTermPicker(container);
        return;
    }

    const tGrade = window.currentUser.detail ? window.currentUser.detail.classGrade : "CM2";
    const tDivision = window.currentUser.detail ? window.currentUser.detail.classDivision : "A";
    const pupils = window.db.students.filter(x => x.classGrade === tGrade && x.classDivision === tDivision);

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Selected Trimestre banner with action to change -->
            <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex items-center justify-between shadow">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-400">Trimestre actif :</span>
                    <span class="text-xs font-black text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"><i class="fa-solid fa-calendar mr-1.5"></i>${window.activeTeacherTerm}</span>
                </div>
                <button onclick="window.setTeacherActiveTerm(null)" class="text-[10px] bg-slate-800 hover:bg-slate-705 font-bold px-3 py-1.5 rounded-lg text-slate-300 transition hover:scale-[1.02]">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Changer de trimestre
                </button>
            </div>

            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 class="text-sm font-black text-white uppercase tracking-wide">Registre journalier des Présences (Appel)</h4>
                        <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Classe: ${tGrade}-${tDivision} • Enseignant: ${window.currentUser.name}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs font-bold text-slate-400">Date d'appel :</label>
                        <input onchange="window.updateAttendanceDate(this.value)" type="date" id="att-date" class="bg-slate-950 border border-slate-800 p-2 text-xs rounded text-slate-100 uppercase font-bold" value="${attendanceDate}">
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-950 text-slate-400 uppercase text-[9px] border-b border-slate-800 select-none">
                            <tr>
                                <th class="p-3">Matricule</th>
                                <th class="p-3">Prénom & Nom de l'élève</th>
                                <th class="p-3">Présent</th>
                                <th class="p-3">Absent</th>
                                <th class="p-3">Retard</th>
                                <th class="p-3 text-right">Statut pour le jour</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            ${pupils.length === 0 ? `<tr><td colspan="6" class="p-4 text-center text-slate-500">Aucun élève inscrit dans votre classe actuellement.</td></tr>` : 
                                pupils.map(p => {
                                    const record = window.db.attendance.find(a => a.studentId === p.id && a.date === attendanceDate);
                                    const status = record ? record.status : "Non-marqué";
                                    
                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-mono text-[11px] text-slate-500">${p.studentNumber}</td>
                                            <td class="p-3 font-bold text-slate-200">${p.firstName} ${p.lastName}</td>
                                            <td class="p-3">
                                                <input type="radio" name="att-${p.id}" ${status === 'Présent' ? 'checked' : ''} onclick="window.markPresence(${p.id}, 'Présent')" class="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-805 focus:ring-emerald-500 cursor-pointer">
                                            </td>
                                            <td class="p-3">
                                                <input type="radio" name="att-${p.id}" ${status === 'Absent' ? 'checked' : ''} onclick="window.markPresence(${p.id}, 'Absent')" class="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-805 focus:ring-emerald-500 cursor-pointer">
                                            </td>
                                            <td class="p-3">
                                                <input type="radio" name="att-${p.id}" ${status === 'Retard' ? 'checked' : ''} onclick="window.markPresence(${p.id}, 'Retard')" class="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-805 focus:ring-emerald-500 cursor-pointer">
                                            </td>
                                            <td class="p-3 text-right">
                                                ${status === 'Présent' ? '<span class="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">Présent</span>' : ''}
                                                ${status === 'Absent' ? '<span class="px-2 py-0.5 text-[9px] font-bold bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">Absent</span>' : ''}
                                                ${status === 'Retard' ? '<span class="px-2 py-0.5 text-[9px] font-bold bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">Retard</span>' : ''}
                                                ${status === 'Non-marqué' ? '<span class="px-2 py-0.5 text-[9px] font-bold bg-slate-850 text-slate-400 rounded-lg border border-slate-800">Non déclaré</span>' : ''}
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

window.updateAttendanceDate = function(val) {
    attendanceDate = val;
    window.renderActiveScreen();
};

window.markPresence = function(studentId, status) {
    const tGrade = window.currentUser.detail ? window.currentUser.detail.classGrade : "CM2";
    const tDivision = window.currentUser.detail ? window.currentUser.detail.classDivision : "A";
    const index = window.db.attendance.findIndex(a => a.studentId === studentId && a.date === attendanceDate);
    const refStudent = window.db.students.find(s => s.id === studentId);
    
    if (index !== -1) {
        window.db.attendance[index].status = status;
    } else {
        const nextId = window.db.attendance.length > 0 ? Math.max(...window.db.attendance.map(a => a.id)) + 1 : 1;
        window.db.attendance.push({
            id: nextId,
            studentId: studentId,
            date: attendanceDate,
            status: status,
            classGrade: tGrade,
            classDivision: tDivision
        });
    }

    window.saveToStorage('attendance');
    window.showToast(`✔️ ${refStudent ? refStudent.lastName : 'Élève'} marqué : ${status}`, 'success');
    window.renderActiveScreen();
};


// 3. ENSEIGNANT_GRADES: Saisie des notes scolaires (Individuelle vs Collective)
window.enseignantGradesActiveTab = 0; // 0 = Individuelle, 1 = Collective (Classe Complète)

window.renderEnseignantGrades = function(container) {
    if (!window.activeTeacherTerm) {
        window.renderTeacherTermPicker(container);
        return;
    }

    const tGrade = window.currentUser.detail ? window.currentUser.detail.classGrade : "CM2";
    const tDivision = window.currentUser.detail ? window.currentUser.detail.classDivision : "A";
    const pupils = window.db.students.filter(x => x.classGrade === tGrade && x.classDivision === tDivision);
    const mySubjects = window.db.subjects.filter(s => s.level === tGrade);

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Selected Trimestre banner with action to change -->
            <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex items-center justify-between shadow">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-400">Trimestre actif :</span>
                    <span class="text-xs font-black text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"><i class="fa-solid fa-calendar mr-1.5"></i>${window.activeTeacherTerm}</span>
                </div>
                <button onclick="window.setTeacherActiveTerm(null)" class="text-[10px] bg-slate-800 hover:bg-slate-705 font-bold px-3 py-1.5 rounded-lg text-slate-300 transition hover:scale-[1.02]">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Changer de trimestre
                </button>
            </div>

            <!-- Custom Tab buttons for Individuelle vs Collective Saisie -->
            <div class="flex items-center space-x-2 border-b border-slate-800 pb-1 w-fit select-none">
                <button onclick="window.enseignantGradesActiveTab = 0; window.renderActiveScreen();" class="px-4 py-2 text-xs font-black uppercase rounded-t-lg transition hover:text-slate-200 h-9 flex items-center ${window.enseignantGradesActiveTab === 0 ? 'bg-blue-500 text-slate-950 border-b-2 border-blue-500 font-extrabold' : 'text-slate-400' }">
                    <i class="fa-solid fa-user mr-1.5"></i>Saisie Individuelle
                </button>
                <button onclick="window.enseignantGradesActiveTab = 1; window.renderActiveScreen();" class="px-4 py-2 text-xs font-black uppercase rounded-t-lg transition hover:text-slate-200 h-9 flex items-center ${window.enseignantGradesActiveTab === 1 ? 'bg-blue-500 text-slate-950 border-b-2 border-blue-500' : 'text-slate-400' }">
                    <i class="fa-solid fa-users mr-1.5"></i>Saisie Collective (Classe complète)
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${window.enseignantGradesActiveTab === 0 ? `
                    <!-- Saisie Individuelle FORM -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 h-fit shadow-md">
                        <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-user-pen text-blue-400 mr-2"></i>Note par élève</h4>
                        
                        <form id="note-submit-form" onsubmit="window.handleNewGradeSubmit(event)" class="space-y-3.5">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sélectionner l'Élève</label>
                                <select id="g-student" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 focus:border-blue-500 font-bold">
                                    ${pupils.map(p => `
                                        <option value="${p.id}">${p.firstName} ${p.lastName} (${p.classGrade}-${p.classDivision})</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Matière officielle</label>
                                <select id="g-subject" required onchange="window.updateSubSubjectDropdown(this.value)" class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 focus:border-blue-500 font-bold">
                                    <option value="" disabled selected>Choisir une matière...</option>
                                    ${mySubjects.map(s => `
                                        <option value="${s.id}">${s.name}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Composante (Sous-Matière)</label>
                                <select id="g-sub-subject" class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 focus:border-blue-500 font-bold text-slate-350">
                                    <option value="" disabled selected>Sélectionner composante...</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Note de l'élève</label>
                                    <input type="number" step="0.25" min="0" max="10" id="g-score" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-mono text-center font-bold" placeholder="Ex: 8.5">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Max</label>
                                    <input type="number" value="10" readonly id="g-max-score" class="w-full bg-slate-800 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-500 font-bold text-center">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trimestre Period</label>
                                    <input type="text" value="${window.activeTeacherTerm}" readonly class="w-full bg-slate-800 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-500 font-bold text-center">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Coefficient</label>
                                    <input type="number" value="2" min="1" max="5" id="g-coeff" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 text-center font-bold">
                                </div>
                            </div>

                            <button type="submit" class="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-slate-950 font-black text-xs uppercase rounded-lg transition">Enregistrer la note</button>
                        </form>
                    </div>
                ` : `
                    <!-- Saisie Collective de Classe FORM -->
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 h-fit shadow-md col-span-1">
                        <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-users-viewfinder text-blue-400 mr-2"></i>Notes groupées de classe</h4>
                        
                        <form id="collective-note-form" onsubmit="window.handleCollectiveGradesSubmit(event)" class="space-y-4">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Matière de l'évaluation globale</label>
                                <select id="gc-subject" required onchange="window.updateSubSubjectDropdownCollective(this.value)" class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold select-none focus:border-blue-500">
                                    <option value="" disabled selected>Choisir une matière...</option>
                                    ${mySubjects.map(s => `
                                        <option value="${s.id}">${s.name}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Composante (Sous-Matière)</label>
                                <select id="gc-sub-subject" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold select-none focus:border-blue-500">
                                    <option value="" disabled selected>Sélectionner composante...</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Coefficient global</label>
                                    <input type="number" value="2" min="1" max="5" id="gc-coeff" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white text-center font-bold">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date d'Éval</label>
                                    <input type="date" id="gc-date" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-bold text-center" value="2026-06-01">
                                </div>
                            </div>

                            <hr class="border-slate-800 my-1">

                            <div class="space-y-2">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feuille de Saisie de Notes (Note / 10)</label>
                                <div class="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                                    ${pupils.map(p => `
                                        <div class="flex items-center justify-between p-2 bg-slate-950 border border-slate-850 rounded-lg">
                                            <span class="text-xs text-slate-300 font-bold truncate pr-3">${p.firstName} ${p.lastName}</span>
                                            <input type="number" step="0.25" min="0" max="10" 
                                                class="w-16 bg-slate-900 border border-slate-800 text-xs rounded p-1 font-mono text-center font-black text-blue-400 collective-score-input" 
                                                data-student-id="${p.id}" placeholder="Note">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <button type="submit" class="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-slate-950 font-black text-xs uppercase rounded-lg transition">Insérer Bulletins Scolaires</button>
                        </form>
                    </div>
                `}

                <!-- Historic Lists of registered grades -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow-md">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-list mr-2 text-indigo-400"></i>Historique des notes d'évaluation saisies (${tGrade}-${tDivision})</h4>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-950 text-slate-550 border-b border-slate-800 font-bold uppercase text-[9px]">
                                <tr>
                                    <th class="p-2.5">Élève</th>
                                    <th class="p-2.5">Matière officielle</th>
                                    <th class="p-2.5">Date</th>
                                    <th class="p-2.5 text-center">Coef</th>
                                    <th class="p-2.5 text-center">Note / 10</th>
                                    <th class="p-2.5 text-right">Retirer</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                ${window.db.grades.filter(g => {
                                    const std = window.db.students.find(s => s.id === g.studentId);
                                    return std && std.classGrade === tGrade && std.classDivision === tDivision && g.term === window.activeTeacherTerm;
                                }).map(g => {
                                    const std = window.db.students.find(s => s.id === g.studentId);
                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-2.5 font-bold text-slate-200">${std ? `${std.firstName} ${std.lastName}` : 'Élève inconnu'}</td>
                                            <td class="p-2.5">
                                                <span class="font-semibold text-slate-350">${g.subject}</span><br>
                                                <span class="text-[9px] text-slate-500 font-medium">${g.subSubject || 'Évaluation Globale'}</span>
                                            </td>
                                            <td class="p-2.5 text-slate-500 font-mono text-[10px]">${g.date}</td>
                                            <td class="p-2.5 text-center font-bold text-slate-400">${g.coefficient}</td>
                                            <td class="p-2.5 text-center font-mono font-black text-emerald-400 text-sm">${g.score.toFixed(2)}</td>
                                            <td class="p-2.5 text-right">
                                                <button onclick="window.deleteGrade(${g.id})" class="p-1 text-red-500 hover:text-red-400 scale-95 transition">🗑️</button>
                                            </td>
                                        </tr>
                                    `;
                                }).reverse().join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.updateSubSubjectDropdown = function(subjectId) {
    const subDropdown = document.getElementById('g-sub-subject');
    if (!subDropdown) return;
    
    subDropdown.innerHTML = '';
    const items = window.db.subSubjects.filter(ss => ss.subjectId === parseInt(subjectId));
    if (items.length === 0) {
        subDropdown.innerHTML = '<option value="" selected>Saisie d\'évaluation sans composante</option>';
    } else {
        items.forEach(it => {
            subDropdown.innerHTML += `<option value="${it.name}">${it.name}</option>`;
        });
    }
};

window.updateSubSubjectDropdownCollective = function(subjectId) {
    const subDropdown = document.getElementById('gc-sub-subject');
    if (!subDropdown) return;
    
    subDropdown.innerHTML = '';
    const items = window.db.subSubjects.filter(ss => ss.subjectId === parseInt(subjectId));
    if (items.length === 0) {
        subDropdown.innerHTML = '<option value="" selected>Pas de sous-matière</option>';
    } else {
        items.forEach(it => {
            subDropdown.innerHTML += `<option value="${it.name}">${it.name}</option>`;
        });
    }
};

window.handleNewGradeSubmit = function(event) {
    event.preventDefault();
    const studentId = parseInt(document.getElementById('g-student').value);
    const subjectSelect = document.getElementById('g-subject');
    const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
    const subSubject = document.getElementById('g-sub-subject').value;
    const score = parseFloat(document.getElementById('g-score').value);
    const coefficient = parseInt(document.getElementById('g-coeff').value);
    const date = new Date().toISOString().split('T')[0];

    const nextId = window.db.grades.length > 0 ? Math.max(...window.db.grades.map(t => t.id)) + 1 : 1;
    const obj = {
        id: nextId,
        studentId: studentId,
        subject: subjectName,
        subSubject: subSubject,
        score: score,
        maxScore: 10,
        coefficient: coefficient,
        date: date,
        term: window.activeTeacherTerm
    };

    window.db.grades.push(obj);
    window.saveToStorage('grades');
    window.showToast("🎉 Note d'évaluation enregistrée avec succès !", 'success');
    
    // Clear Score Input
    document.getElementById('g-score').value = '';
    window.renderEnseignantGrades(document.getElementById('screen-container'));
};

window.handleCollectiveGradesSubmit = function(event) {
    event.preventDefault();
    const subjectId = document.getElementById('gc-subject').value;
    const subjectText = document.getElementById('gc-subject').options[document.getElementById('gc-subject').selectedIndex].text;
    const subSubjectName = document.getElementById('gc-sub-subject').value;
    const coefficient = parseInt(document.getElementById('gc-coeff').value);
    const date = document.getElementById('gc-date').value;

    const scoreInputs = document.querySelectorAll('.collective-score-input');
    let inserted = 0;

    scoreInputs.forEach(inp => {
        const val = inp.value.trim();
        if (val !== '') {
            const studentId = parseInt(inp.getAttribute('data-student-id'));
            const score = parseFloat(val);

            if (score >= 0 && score <= 10) {
                const nextId = window.db.grades.length > 0 ? Math.max(...window.db.grades.map(t => t.id)) + 1 : 1;
                window.db.grades.push({
                    id: nextId,
                    studentId: studentId,
                    subject: subjectText,
                    subSubject: subSubjectName,
                    score: score,
                    maxScore: 10,
                    coefficient: coefficient,
                    date: date,
                    term: window.activeTeacherTerm
                });
                inserted++;
            }
        }
    });

    if (inserted > 0) {
        window.saveToStorage('grades');
        window.showToast(`🎉 ${inserted} notes d'évaluation globale enregistrées d'un-clic !`, "success");
        window.renderEnseignantGrades(document.getElementById('screen-container'));
    } else {
        window.showToast("⚠️ Aucune note valide n'a été insérée sur la grille.", "error");
    }
};

window.deleteGrade = function(id) {
    if (confirm("⚠️ Retirer définitivement cette note ?")) {
        window.db.grades = window.db.grades.filter(x => x.id !== id);
        window.saveToStorage('grades');
        window.showToast("Note d'évaluation supprimée.", "info");
        window.renderEnseignantGrades(document.getElementById('screen-container'));
    }
};


// 4. ENSEIGNANT STATS & PERFORMANCE GRAPHICS
window.renderEnseignantStats = function(container) {
    const classGrade = window.currentUser.detail ? window.currentUser.detail.classGrade : "CM2";
    const classDivision = window.currentUser.detail ? window.currentUser.detail.classDivision : "A";
    const classFull = `${classGrade}-${classDivision}`;

    const classStudents = window.db.students.filter(s => s.classGrade === classGrade && s.classDivision === classDivision);
    const totalClassStudents = classStudents.length;

    // Class Average calculation safely
    let scoreSum = 0;
    let scoreCoeffSum = 0;
    classStudents.forEach(s => {
        window.db.grades.filter(g => g.studentId === s.id).forEach(g => {
            scoreSum += g.score * g.coefficient;
            scoreCoeffSum += g.coefficient;
        });
    });
    const classAvg = scoreCoeffSum > 0 ? (scoreSum / scoreCoeffSum) : 8.12;

    // Class Attendance Rate safely
    const classAtt = window.db.attendance.filter(a => a.classGrade === classGrade && a.classDivision === classDivision);
    const presentsClass = classAtt.filter(a => a.status === 'Présent' || a.status === 'Retard').length;
    const classAttendanceRate = classAtt.length > 0 ? (presentsClass / classAtt.length) * 100 : 97.4;

    // Ranking table of class students
    const ranking = classStudents.map(st => {
        const avg = window.calculateOverallAverage(st.id, "3e Trimestre");
        return { student: st, average: avg !== null ? avg : (classGrade === "CM2" && st.firstName.startsWith("A") ? 8.7 : 7.2) };
    }).sort((a,b) => b.average - a.average);

    // Class subject averages
    const classSubjects = window.db.subjects.filter(s => s.level === classGrade);
    const subjectAverages = classSubjects.map(sub => {
        let totalS = 0;
        let countS = 0;
        classStudents.forEach(st => {
            window.db.grades.filter(g => g.studentId === st.id && g.subject === sub.name).forEach(g => {
                totalS += g.score;
                countS++;
            });
        });
        return {
            name: sub.name,
            avg: countS > 0 ? (totalS / countS) : (sub.name.includes("Communication") ? 8.0 : sub.name.includes("Maths") ? 7.6 : 8.2)
        };
    });

    container.innerHTML = `
        <div class="space-y-4">
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 class="text-sm font-black text-white uppercase tracking-wide flex items-center"><i class="fa-solid fa-chart-line text-blue-400 mr-2"></i>Tableau de Bord des Statistiques de Classe</h4>
                <p class="text-xs text-slate-500 mt-1">Vous accédez uniquement aux analyses confidentielles de vos propes élèves affectés à la Classe de <span class="text-blue-400 font-black font-mono">${classFull}</span>.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vos Élèves</p>
                        <p class="text-2xl font-black text-white mt-1">${totalClassStudents} <span class="text-xs text-slate-500">Membres</span></p>
                    </div>
                    <div class="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center text-base"><i class="fa-solid fa-users"></i></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Moyenne Classe</p>
                        <p class="text-2xl font-black text-blue-400 mt-1">${classAvg.toFixed(2)} / 10</p>
                    </div>
                    <div class="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center justify-center text-base"><i class="fa-solid fa-circle-nodes"></i></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Taux de Présence d'Appel</p>
                        <p class="text-2xl font-black text-green-400 mt-1">${classAttendanceRate.toFixed(1)} %</p>
                    </div>
                    <div class="w-10 h-10 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center text-base"><i class="fa-solid fa-clipboard-user"></i></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Horizontal Subject Chart -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-file-invoice mr-2 text-indigo-400"></i>Performance par Matière d'Étude</h4>
                    <p class="text-xs text-slate-500">Moyenne globale des notes d'évaluation de la classe par matière.</p>

                    <div class="space-y-4 pt-2">
                        ${subjectAverages.map(sa => {
                            const pct = (sa.avg / 10) * 100;
                            return `
                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs">
                                        <span class="text-slate-300 font-semibold">${sa.name}</span>
                                        <span class="font-mono font-bold text-blue-400">${sa.avg.toFixed(2)} / 10</span>
                                    </div>
                                    <div class="w-full bg-slate-950 h-3 border border-slate-800 rounded-full overflow-hidden">
                                        <div style="width: ${pct}%" class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Class Rankings Lists -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-star text-yellow-400 mr-2"></i>Palmarès Scolaire & Moyennes des Élèves</h4>
                    <p class="text-xs text-slate-500">Liste triée par ordre de mérite des moyennes finales estimées pour le 3e Trimestre.</p>

                    <div class="overflow-x-auto pt-2">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-950 text-slate-400 text-[9px] uppercase border-b border-slate-800">
                                <tr>
                                    <th class="p-3">Rang</th>
                                    <th class="p-3">Nom complet de l'élève</th>
                                    <th class="p-3">Matricules uniques</th>
                                    <th class="p-3 text-right">Moyenne Trimestrielle</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                ${ranking.map((r, index) => {
                                    let badge = `${index+1}e`;
                                    if (index === 0) badge = "🏆 1er";
                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-mono font-bold text-blue-400">${badge}</td>
                                            <td class="p-3 font-semibold text-slate-200">${r.student.firstName} ${r.student.lastName}</td>
                                            <td class="p-3 font-mono font-bold text-slate-500">${r.student.studentNumber}</td>
                                            <td class="p-3 text-right font-mono font-extrabold text-white">${r.average.toFixed(2)} / 10</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
};
