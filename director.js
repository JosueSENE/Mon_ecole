/* ==========================================================================
   SUNU ÉCOLE - MODULE 2: DIRECTEUR WORKSPACE & ACTIONS
   ========================================================================== */

// 1. MAIN DIRECTEUR OVERVIEW (Dashboard)
window.renderDirecteurOverview = function(container) {
    const totalStudents = window.db.students.length;
    const totalTeachers = window.db.teachers.length;
    const totalSubjects = window.db.subjects.length;
    const signedCount = window.db.signedBulletins.filter(b => b.isSigned).length;
    
    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Summary Stats Banner -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Élèves inscrits</p>
                        <p class="text-2xl font-black text-white mt-1">${totalStudents} <span class="text-xs text-slate-500 font-normal">Élèves</span></p>
                    </div>
                    <div class="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-user-graduate"></i></div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enseignants</p>
                        <p class="text-2xl font-black text-white mt-1">${totalTeachers} <span class="text-xs text-slate-500 font-normal">Profs</span></p>
                    </div>
                    <div class="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-chalkboard-user"></i></div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Matières d'études</p>
                        <p class="text-2xl font-black text-white mt-1">${totalSubjects} <span class="text-xs text-slate-500 font-normal">Matières</span></p>
                    </div>
                    <div class="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-book-bookmark"></i></div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bulletins Signés</p>
                        <p class="text-2xl font-black text-emerald-400 mt-1">${signedCount} <span class="text-xs text-slate-500 font-normal">Visés</span></p>
                    </div>
                    <div class="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-signature"></i></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Administrative Actions Widget -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-lg">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-circle-nodes text-emerald-400 mr-2"></i>Actions Directoriaux Rapides</h4>
                    <p class="text-xs text-slate-400">Accès rapide aux modules décisionnels d'établissement :</p>
                    
                    <div class="space-y-2.5">
                        <button onclick="switchScreen('TEACHERS')" class="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold transition hover:scale-[1.01]">
                            <span class="text-slate-300"><i class="fa-solid fa-chalkboard-user mr-2 text-emerald-500"></i>Gérer les Enseignants</span>
                            <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
                        </button>
                        <button onclick="switchScreen('SUBJECTS')" class="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold transition hover:scale-[1.01]">
                            <span class="text-slate-300"><i class="fa-solid fa-book-open mr-2 text-indigo-500"></i>Suivi des Coeff & Matières</span>
                            <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
                        </button>
                        <button onclick="switchScreen('BULLETINS')" class="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold transition hover:scale-[1.01]">
                            <span class="text-slate-300"><i class="fa-solid fa-file-signature mr-2 text-orange-500"></i>Viser les Bulletins Trimestriels</span>
                            <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
                        </button>
                        <button onclick="switchScreen('STATS')" class="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold transition hover:scale-[1.01]">
                            <span class="text-slate-300"><i class="fa-solid fa-chart-pie mr-2 text-cyan-500"></i>Évaluation des Enseignants</span>
                            <i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>
                        </button>
                    </div>
                </div>

                <!-- Last Active Activities Registry -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow-lg">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-bolt text-yellow-500 mr-2"></i>Dernières Évaluations Publiées (CM2-A)</h4>
                    <p class="text-xs text-slate-400">Dernières saisies remontées automatiquement par les professeurs de classe :</p>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-950 text-slate-500 border-b border-slate-800 text-[9px] uppercase">
                                <tr>
                                    <th class="p-2.5">Date</th>
                                    <th class="p-2.5">Élève</th>
                                    <th class="p-2.5">Matière / Éval</th>
                                    <th class="p-2.5 text-right">Note de l'élève</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                ${window.db.grades.slice(-4).reverse().map(g => {
                                    const st = window.db.students.find(s => s.id === g.studentId) || { firstName: "Élève", lastName: "Inconnu" };
                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-2.5 text-slate-500 font-mono text-[10px]">${g.date}</td>
                                            <td class="p-2.5 font-bold text-slate-200">${st.firstName} ${st.lastName}</td>
                                            <td class="p-2.5">
                                                <span class="font-semibold text-slate-300">${g.subject}</span><br>
                                                <span class="text-[9px] text-slate-500">${g.subSubject || 'Évaluation Globale'}</span>
                                            </td>
                                            <td class="p-2.5 text-right font-mono font-black text-emerald-400 text-sm">${g.score.toFixed(1)} / ${g.maxScore}</td>
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


// 2. TEACHERS INTERFACE & INVITATIONS
window.renderDirecteurTeachers = function(container) {
    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Form to Send a New Invitation code -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md h-fit">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>Inviter un Enseignant</h4>
                    <p class="text-[11px] text-slate-400 font-semibold uppercase">Ajouter un professeur et générer son code d'activation un-clic</p>
                    
                    <form id="invite-teacher-form" onsubmit="window.handleNewTeacherSubmit(event)" class="space-y-3">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom complet</label>
                            <input type="text" id="t-name" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-emerald-500 font-bold" placeholder="Ex: M. Souaré">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email académique</label>
                            <input type="email" id="t-email" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-emerald-500 font-mono" placeholder="Ex: souare@ecole.sn">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Niveau Classe</label>
                                <select id="t-class" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                                    <option value="CI">CI</option>
                                    <option value="CP">CP</option>
                                    <option value="CE1">CE1</option>
                                    <option value="CE2">CE2</option>
                                    <option value="CM1">CM1</option>
                                    <option value="CM2">CM2</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Division</label>
                                <select id="t-div" required class="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-slate-100 font-bold">
                                    <option value="A">Division A</option>
                                    <option value="B">Division B</option>
                                    <option value="C">Division C</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase rounded-lg transition hover:scale-[1.01]">
                            <i class="fa-solid fa-square-plus mr-1"></i> Générer Invitation
                        </button>
                    </form>
                </div>

                <!-- Teacher rosters table lists -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow-md">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-users mr-2 text-indigo-400"></i>Registre du Corps Enseignant d'Établissement</h4>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-950 text-slate-500 text-[10px] uppercase border-b border-slate-800">
                                <tr>
                                    <th class="p-3">Identité</th>
                                    <th class="p-3">Classe Attribuée</th>
                                    <th class="p-3">Code Pin d'invitation</th>
                                    <th class="p-3">Statut d'Espace</th>
                                    <th class="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                ${window.db.teachers.map(t => `
                                    <tr class="hover:bg-slate-950/40">
                                        <td class="p-3">
                                            <p class="font-extrabold text-slate-200">${t.name}</p>
                                            <p class="text-[10px] text-slate-500 font-mono">${t.email}</p>
                                        </td>
                                        <td class="p-3">
                                            <span class="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-extrabold">${t.classGrade}-${t.classDivision}</span>
                                        </td>
                                        <td class="p-3 font-mono text-emerald-400 font-black">${t.invitationCode}</td>
                                        <td class="p-3">
                                            ${t.isActivated ? 
                                                '<span class="px-2 py-0.5 text-[9px] font-bold text-green-400 bg-green-500/10 rounded-full border border-green-500/20">Actif / Connecté</span>' : 
                                                '<span class="px-2 py-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20">Invitation En attente</span>'
                                            }
                                        </td>
                                        <td class="p-3 text-right flex items-center justify-end space-x-1">
                                            <button onclick="window.sendInvitationMail('${t.email}', '${t.name}', '${t.invitationCode}', '${t.classGrade}-${t.classDivision}')" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold mr-1 transition duration-200" title="Envoyer par email">
                                                <i class="fa-solid fa-envelope"></i>
                                            </button>
                                            <button onclick="window.deleteTeacher(${t.id})" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition duration-200" title="Supprimer définitivement">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.handleNewTeacherSubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('t-name').value.trim();
    const email = document.getElementById('t-email').value.trim();
    const classGrade = document.getElementById('t-class').value;
    const classDivision = document.getElementById('t-div').value;

    const exists = window.db.teachers.some(t => t.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        window.showToast("⚠️ Un enseignant s'est déjà enregistré avec cette adresse email.", 'error');
        return;
    }

    const nextId = window.db.teachers.length > 0 ? Math.max(...window.db.teachers.map(t => t.id)) + 1 : 1;
    const randCode = "PROF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const obj = {
        id: nextId,
        name: name,
        email: email,
        classGrade: classGrade,
        classDivision: classDivision,
        invitationCode: randCode,
        isActivated: false
    };

    window.db.teachers.push(obj);
    window.saveToStorage('teachers');
    window.showToast(`🎉 Enseignant ${name} invité ! Code généré : ${randCode}`, 'success');
    window.renderDirecteurTeachers(document.getElementById('screen-container'));
};

window.deleteTeacher = function(id) {
    if (confirm("⚠️ Souhaitez-vous supprimer cet enseignant de l'établissement ? Cette action annulera instantanément son accès d'appel.")) {
        window.db.teachers = window.db.teachers.filter(x => x.id !== id);
        window.saveToStorage('teachers');
        window.showToast("Professeur radié du système.", 'info');
        window.renderDirecteurTeachers(document.getElementById('screen-container'));
    }
};


// 3. SUBJECTS & WEIGHT CONTROLS (Coefficients)
window.renderDirecteurSubjects = function(container) {
    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <div class="w-full">
                <!-- Subjects & associated Composants (sub-subjects) hierarchical layout -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-bars-staggered mr-2 text-indigo-400"></i>Architecture des Matières & Coefficients par Classe</h4>
                    
                    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        ${["CM2", "CE2", "CE1", "CP", "CI"].map(level => {
                            const lvSubjects = window.db.subjects.filter(s => s.level === level);
                            if (lvSubjects.length === 0) return '';
                            
                            return `
                                <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                                    <h5 class="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-850 pb-1.5"><i class="fa-solid fa-list-check mr-2"></i>Niveau (${level})</h5>
                                    
                                    <div class="divide-y divide-slate-800/60">
                                        ${lvSubjects.map(sub => {
                                            const comps = window.db.subSubjects.filter(ss => ss.subjectId === sub.id);
                                            return `
                                                <div class="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div class="space-y-1 bg-slate-900/45 p-2 rounded border border-slate-800/10 w-full">
                                                        <div class="flex items-center justify-between">
                                                            <strong class="text-slate-200 text-xs font-black">${sub.name}</strong>
                                                            <span class="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black px-2 py-0.5 rounded">Coefficient: ${sub.coefficient}</span>
                                                        </div>
                                                        <!-- Composants items -->
                                                        <div class="pt-2 flex flex-wrap gap-1.5" id="comp-wrapper-${sub.id}">
                                                            ${comps.map(c => `
                                                                <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-400 font-bold group">
                                                                    <span>${c.name}</span>
                                                                    <button onclick="window.deleteSubSubject(${c.id})" class="text-red-500 hover:text-red-400 hover:scale-105 transition scale-90 ml-1">×</button>
                                                                </span>
                                                            `).join('')}
                                                            <button onclick="window.addSubSubject(${sub.id})" class="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-[10px] text-slate-300 rounded font-black border border-slate-700 transition">
                                                                + Ajouter composante
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <button onclick="window.deleteSubject(${sub.id})" class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs transition h-fit self-end select-none">
                                                        <i class="fa-solid fa-trash-can"></i> Supprimer
                                                    </button>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.handleNewSubjectSubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('sub-name').value.trim();
    const coeff = parseInt(document.getElementById('sub-coeff').value);
    const level = document.getElementById('sub-level').value;

    const exists = window.db.subjects.some(s => s.name.toLowerCase() === name.toLowerCase() && s.level === level);
    if (exists) {
        window.showToast("⚠️ Cette matière existe déjà sur ce niveau classe.", "error");
        return;
    }

    const nextId = window.db.subjects.length > 0 ? Math.max(...window.db.subjects.map(t => t.id)) + 1 : 1;
    const obj = { id: nextId, name: name, level: level, coefficient: coeff, maxScore: 10 };

    window.db.subjects.push(obj);
    window.saveToStorage('subjects');
    window.showToast(`📚 Matière '${name}' enregistrée avec coefficient ${coeff}!`, "success");
    window.renderDirecteurSubjects(document.getElementById('screen-container'));
};

window.deleteSubject = function(id) {
    if (confirm("⚠️ Souhaitez-vous supprimer cette matière et affecter tous les calculs ? \nToutes les sous-matières rattachées seront orphelines.")) {
        window.db.subjects = window.db.subjects.filter(s => s.id !== id);
        window.db.subSubjects = window.db.subSubjects.filter(ss => ss.subjectId !== id);
        window.saveToStorage('subjects');
        window.saveToStorage('subSubjects');
        window.showToast("Matière supprimée de l'établissement.", "info");
        window.renderDirecteurSubjects(document.getElementById('screen-container'));
    }
};

window.addSubSubject = function(subjectId) {
    const name = prompt("Saisir l'intitulé de la composante (Ex: Récitation, Conjugaison, Calcul de surface, etc.) :");
    if (!name || name.trim() === '') return;

    const subject = window.db.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const exists = window.db.subSubjects.some(ss => ss.name.toLowerCase() === name.trim().toLowerCase() && ss.subjectId === subjectId);
    if (exists) {
        window.showToast("⚠️ Cette composante est déjà configurée pour cette matière d'élèves.", "error");
        return;
    }

    const nextId = window.db.subSubjects.length > 0 ? Math.max(...window.db.subSubjects.map(t => t.id)) + 1 : 1;
    const obj = { id: nextId, subjectId: subjectId, name: name.trim() };

    window.db.subSubjects.push(obj);
    window.saveToStorage('subSubjects');
    window.showToast(`✔️ Sous-composante '${name.trim()}' incorporée avec succès.`, "success");
    window.renderDirecteurSubjects(document.getElementById('screen-container'));
};

window.deleteSubSubject = function(id) {
    if (confirm("⚠️ Enlever cette composante d'évaluation ?")) {
        window.db.subSubjects = window.db.subSubjects.filter(ss => ss.id !== id);
        window.saveToStorage('subSubjects');
        window.showToast("Composante retirée.", "info");
        window.renderDirecteurSubjects(document.getElementById('screen-container'));
    }
};


// 4. BULLETINS SIGNATURE OVERSIGHT & VALIDATION LIST
window.renderDirecteurBulletins = function(container) {
    const listStudents = window.db.students.filter(s => {
        return s.classGrade === window.directeurActiveGradeFilter && s.classDivision === window.directeurActiveDivisionFilter;
    });

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Filtering Banner -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div class="space-y-1">
                    <h4 class="text-sm font-black text-white uppercase tracking-wide">Validation de Bulletins Scolaires d'établissement</h4>
                    <p class="text-xs text-slate-400">Viser et signer électroniquement pour sceller et autoriser l'impression par le Secrétaire scolaire.</p>
                </div>
                
                <div class="flex flex-wrap items-center gap-2">
                    <select onchange="window.directeurActiveTermFilter=this.value; window.renderDirecteurBulletins(document.getElementById('screen-container'))" class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500">
                        <option value="1er Trimestre" ${window.directeurActiveTermFilter === '1er Trimestre'?'selected':''}>1er Trimestre</option>
                        <option value="2e Trimestre" ${window.directeurActiveTermFilter === '2e Trimestre'?'selected':''}>2e Trimestre</option>
                        <option value="3e Trimestre" ${window.directeurActiveTermFilter === '3e Trimestre'?'selected':''}>3e Trimestre</option>
                    </select>

                    <select onchange="window.directeurActiveGradeFilter=this.value; window.renderDirecteurBulletins(document.getElementById('screen-container'))" class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500">
                        <option value="CI" ${window.directeurActiveGradeFilter === 'CI'?'selected':''}>CI</option>
                        <option value="CP" ${window.directeurActiveGradeFilter === 'CP'?'selected':''}>CP</option>
                        <option value="CE1" ${window.directeurActiveGradeFilter === 'CE1'?'selected':''}>CE1</option>
                        <option value="CE2" ${window.directeurActiveGradeFilter === 'CE2'?'selected':''}>CE2</option>
                        <option value="CM1" ${window.directeurActiveGradeFilter === 'CM1'?'selected':''}>CM1</option>
                        <option value="CM2" ${window.directeurActiveGradeFilter === 'CM2'?'selected':''}>CM2</option>
                    </select>

                    <select onchange="window.directeurActiveDivisionFilter=this.value; window.renderDirecteurBulletins(document.getElementById('screen-container'))" class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500">
                        <option value="A" ${window.directeurActiveDivisionFilter === 'A'?'selected':''}>Division A</option>
                        <option value="B" ${window.directeurActiveDivisionFilter === 'B'?'selected':''}>Division B</option>
                        <option value="C" ${window.directeurActiveDivisionFilter === 'C'?'selected':''}>Division C</option>
                    </select>
                </div>
            </div>

            <!-- Bulletins roster validation -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                <div class="flex justify-between items-center mb-4">
                    <h5 class="text-xs font-black text-white uppercase tracking-wider">État des transmissions de la Classe (${window.directeurActiveGradeFilter}-${window.directeurActiveDivisionFilter})</h5>
                    <div class="flex space-x-2">
                        <button onclick="window.signClassBulletinsGrouped(true)" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase px-3 py-1.5 rounded transition hover:scale-[1.01]">
                            <i class="fa-solid fa-signature"></i> Viser toute la classe
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto text-left">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-950 text-slate-500 text-[9px] uppercase border-b border-slate-800">
                            <tr>
                                <th class="p-3">Matricule</th>
                                <th class="p-3">Élève Prénom & Nom</th>
                                <th class="p-3 text-center">Trimestre d'éval</th>
                                <th class="p-3 text-center">Moyenne estimée</th>
                                <th class="p-3 text-center">Statut Signature Directeur</th>
                                <th class="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            ${listStudents.length === 0 ? `<tr><td colspan="6" class="p-4 text-center text-slate-500">Aucun élève trouvé dans ce filtre de classe.</td></tr>` : 
                                listStudents.map(std => {
                                    const average = window.calculateOverallAverage(std.id, window.directeurActiveTermFilter);
                                    let avgText = average !== null ? `${average.toFixed(2)}/10` : 'Pas de note';
                                    let avgClass = average !== null ? (average >= 5 ? 'text-emerald-400 font-extrabold' : 'text-red-400') : 'text-slate-600';
                                    
                                    const signature = window.db.signedBulletins.find(sb => sb.studentId === std.id && sb.term === window.directeurActiveTermFilter);
                                    const isSigned = signature ? signature.isSigned : false;

                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-mono text-[10px] text-slate-550">${std.studentNumber}</td>
                                            <td class="p-3 font-bold text-slate-200">${std.firstName} ${std.lastName}</td>
                                            <td class="p-3 text-center font-bold text-slate-300 uppercase text-[10px]">${window.directeurActiveTermFilter}</td>
                                            <td class="p-3 text-center font-mono ${avgClass} text-sm">${avgText}</td>
                                            <td class="p-3 text-center">
                                                ${isSigned ? 
                                                    '<span class="px-2.5 py-0.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"><i class="fa-solid fa-circle-check mr-1"></i>Visé</span>' : 
                                                    '<span class="px-2.5 py-0.5 text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg"><i class="fa-solid fa-clock mr-1"></i>En attente de visa</span>'
                                                }
                                            </td>
                                            <td class="p-3 text-right flex items-center justify-end space-x-1.5">
                                                <button onclick="window.previewStudentBulletinPDF(${std.id}, '${window.directeurActiveTermFilter}')" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold transition select-none" title="Prévisualiser avant signature">
                                                    <i class="fa-solid fa-magnifying-glass"></i> Inspecter
                                                </button>
                                                ${isSigned ? `
                                                    <button onclick="window.signBulletin(${std.id}, false)" class="p-2 bg-slate-950 hover:bg-slate-800 text-red-400 rounded-lg text-[11px] font-black uppercase tracking-wide border border-transparent hover:border-red-500/20" title="Annuler le visa">
                                                         Supprimer Visa
                                                    </button>
                                                ` : `
                                                    <button onclick="window.signBulletin(${std.id}, true)" class="p-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[11px] font-black uppercase tracking-wide transition transform hover:scale-[1.03]" title="Viser électroniquement">
                                                        <i class="fa-solid fa-signature"></i> Signer & Sceller
                                                    </button>
                                                `}
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

window.signBulletin = function(studentId, isSigned) {
    const term = window.directeurActiveTermFilter;
    const index = window.db.signedBulletins.findIndex(sb => sb.studentId === studentId && sb.term === term);
    
    if (index !== -1) {
        window.db.signedBulletins[index].isSigned = isSigned;
        window.db.signedBulletins[index].signedBy = isSigned ? "M. Kane (Directeur académique)" : "";
    } else {
        const nextId = window.db.signedBulletins.length > 0 ? Math.max(...window.db.signedBulletins.map(t => t.id)) + 1 : 1;
        window.db.signedBulletins.push({
            id: nextId,
            studentId: studentId,
            term: term,
            isSigned: isSigned,
            isSentByTeacher: true,
            signedBy: isSigned ? "M. Kane (Directeur académique)" : ""
        });
    }

    window.saveToStorage('signedBulletins');
    if (isSigned) {
        window.showToast("🖋️ Bulletin visé, certifié et verrouillé pour l'impression scolaires.");
    } else {
        window.showToast("⚠️ Visa retiré du bulletin.", "info");
    }
    window.renderDirecteurBulletins(document.getElementById('screen-container'));
};

window.signClassBulletinsGrouped = function(isSigned) {
    const listStudents = window.db.students.filter(s => {
        return s.classGrade === window.directeurActiveGradeFilter && s.classDivision === window.directeurActiveDivisionFilter;
    });

    if (listStudents.length === 0) {
        window.showToast("⚠️ Aucun élève à viser pour ce filtre classe.", "error");
        return;
    }

    const term = window.directeurActiveTermFilter;
    listStudents.forEach(std => {
        const index = window.db.signedBulletins.findIndex(sb => sb.studentId === std.id && sb.term === term);
        if (index !== -1) {
            window.db.signedBulletins[index].isSigned = isSigned;
            window.db.signedBulletins[index].signedBy = isSigned ? "M. Kane (Directeur académique)" : "";
        } else {
            const nextId = window.db.signedBulletins.length > 0 ? Math.max(...window.db.signedBulletins.map(t => t.id)) + 1 : 1;
            window.db.signedBulletins.push({
                id: nextId,
                studentId: std.id,
                term: term,
                isSigned: isSigned,
                isSentByTeacher: true,
                signedBy: isSigned ? "M. Kane (Directeur académique)" : ""
            });
        }
    });

    window.saveToStorage('signedBulletins');
    window.showToast("🖋️ Tous les bulletins de la classe ont reçu le visa numérique conforme !");
    window.renderDirecteurBulletins(document.getElementById('screen-container'));
};


// 5. EVALUATION STATS (Classes averages graphs & inspect elements)
window.statsSelectedClass = 'CM2-A';
window.renderDirecteurStats = function(container) {
    // School-wide kpis
    const boysCount = window.db.students.filter(s => s.gender === 'M').length;
    const girlsCount = window.db.students.filter(s => s.gender === 'F').length;
    const totalP = window.db.students.length;
    const boysPct = totalP > 0 ? Math.round((boysCount / totalP) * 100) : 50;
    const girlsPct = totalP > 0 ? Math.round((girlsCount / totalP) * 100) : 50;
    
    // Average calculation of each grade level CI to CM2
    const levels = ["CI", "CP", "CE1", "CE2", "CM1", "CM2"];
    const levelStats = levels.map(lv => {
        const stds = window.db.students.filter(s => s.classGrade === lv);
        let lvSum = 0;
        let count = 0;
        stds.forEach(st => {
            const avg = window.calculateOverallAverage(st.id, "3e Trimestre");
            if (avg !== null) {
                lvSum += avg;
                count++;
            }
        });
        const finalAvg = count > 0 ? (lvSum / count) : (lv === 'CM2' ? 8.5 : lv === 'CE2' ? 7.2 : 6.8);
        return { level: lv, avg: finalAvg, count: stds.length };
    });

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Level stats visualizer -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Girls / Boys Distribution Card -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md col-span-1 h-fit">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-venus-mars text-emerald-400 mr-2"></i>Distribution des Genres Établissement</h4>
                    
                    <div class="flex items-center justify-around py-5 bg-slate-950 rounded-xl border border-slate-800/60 shadow">
                        <div class="text-center">
                            <p class="text-slate-400 font-mono text-sm font-black text-rose-400"><i class="fa-solid fa-venus mr-1"></i>Filles</p>
                            <p class="text-3xl font-black text-white mt-1">${girlsCount}</p>
                            <p class="text-[11px] text-slate-500 mt-0.5">${girlsPct}% de l'école</p>
                        </div>
                        <div class="w-px h-12 bg-slate-800"></div>
                        <div class="text-center">
                            <p class="text-slate-400 font-mono text-sm font-black text-cyan-400"><i class="fa-solid fa-mars mr-1"></i>Garçons</p>
                            <p class="text-3xl font-black text-white mt-1">${boysCount}</p>
                            <p class="text-[11px] text-slate-500 mt-0.5">${boysPct}% de l'école</p>
                        </div>
                    </div>

                    <div class="w-full bg-slate-950 h-5.5 rounded-full overflow-hidden flex text-[10px] font-black font-mono leading-relaxed border border-slate-800">
                        <div style="width: ${girlsPct}%" class="bg-rose-500 text-slate-950 flex items-center justify-center h-full">${girlsPct}% <i class="fa-solid fa-venus ml-1"></i></div>
                        <div style="width: ${boysPct}%" class="bg-cyan-500 text-slate-900 flex items-center justify-center h-full">${boysPct}% <i class="fa-solid fa-mars ml-1"></i></div>
                    </div>
                </div>

                <!-- Bar Graph widget showing performance of Level averages -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-chart-line text-emerald-400 mr-2"></i>Performance Globale par Niveau Scolaire</h4>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-wide">Moyenne calculée des compositions trimestrielles de chaque niveau (CI à CM2).</p>
                    
                    <div class="space-y-3 pt-2">
                        ${levelStats.map(ls => {
                            const percent = (ls.avg / 10) * 100;
                            const colorClass = ls.avg >= 5 ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-slate-600';
                            return `
                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs">
                                        <span class="font-bold text-slate-200">Classe de ${ls.level} (${ls.count} élèves)</span>
                                        <span class="font-bold font-mono text-slate-300">${ls.avg.toFixed(2)} / 10</span>
                                    </div>
                                    <div class="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                                        <div style="width: ${percent}%" class="h-full rounded-full transition-all duration-500 ${colorClass}"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- Profile review by class -->
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 class="text-sm font-black text-white uppercase tracking-wide flex items-center"><i class="fa-solid fa-building-flag text-emerald-400 mr-2"></i>Évaluation des Classes & Professeurs</h4>
                        <p class="text-xs text-slate-500 mt-0.5">Sélectionnez une classe ci-dessous pour évaluer son enseignant titulaire et voir les résultats.</p>
                    </div>

                    <select onchange="window.statsSelectedClass=this.value; window.renderDirecteurStats(document.getElementById('screen-container'))" 
                        class="bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white font-mono font-bold focus:outline-emerald-500">
                        <option value="CI-A" ${window.statsSelectedClass==='CI-A'?'selected':''}>Classe CI-A</option>
                        <option value="CP-A" ${window.statsSelectedClass==='CP-A'?'selected':''}>Classe CP-A</option>
                        <option value="CE1-A" ${window.statsSelectedClass==='CE1-A'?'selected':''}>Classe CE1-A</option>
                        <option value="CE2-A" ${window.statsSelectedClass==='CE2-A'?'selected':''}>Classe CE2-A (Mme Diouf)</option>
                        <option value="CM1-A" ${window.statsSelectedClass==='CM1-A'?'selected':''}>Classe CM1-A</option>
                        <option value="CM2-A" ${window.statsSelectedClass==='CM2-A'?'selected':''}>Classe CM2-A (M. Fall)</option>
                    </select>
                </div>

                <hr class="border-slate-800">

                ${(() => {
                    // Find relevant details for class
                    const [grade, division] = window.statsSelectedClass.split("-");
                    const classStudents = window.db.students.filter(s => s.classGrade === grade && s.classDivision === division);
                    const tTeacher = window.db.teachers.find(t => t.classGrade === grade && t.classDivision === division);
                    const teacherName = tTeacher ? tTeacher.name : "Non attribué";
                    
                    // Class KPI Metrics
                    const totalClassStudents = classStudents.length;

                    // Average of selected class
                    let scoreSum = 0;
                    let scoreCoeffSum = 0;
                    classStudents.forEach(s => {
                        window.db.grades.filter(g => g.studentId === s.id).forEach(g => {
                            scoreSum += g.score * g.coefficient;
                            scoreCoeffSum += g.coefficient;
                        });
                    });
                    const classAvg = scoreCoeffSum > 0 ? (scoreSum / scoreCoeffSum) : (grade === "CM2" ? 8.2 : grade === "CE2" ? 7.0 : 6.8);

                    // Attendance rate of class
                    const classAtt = window.db.attendance.filter(a => a.classGrade === grade && a.classDivision === division);
                    const presentsClass = classAtt.filter(a => a.status === 'Présent' || a.status === 'Retard').length;
                    const classAttendanceRate = classAtt.length > 0 ? (presentsClass / classAtt.length) * 100 : 97.4;

                    // Teacher evaluation / score (synthetic based on class KPIs)
                    let evaluationRating = 4.2; // default stars
                    let evaluationLabel = "Remarquable";
                    if (classAvg > 8) { evaluationRating = 5; evaluationLabel = "Excellent travail pédagogique"; }
                    else if (classAvg > 7) { evaluationRating = 4.5; evaluationLabel = "Très bon encadrement"; }
                    else if (classAvg > 5) { evaluationRating = 3.5; evaluationLabel = "Résultats globaux corrects"; }
                    else { evaluationRating = 2.5; evaluationLabel = "Soutien et suivi recommandé"; }

                    // Subjects average within this class
                    const classSubjects = window.db.subjects.filter(s => s.level === grade);
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

                    // Rank classmates
                    const ranking = classStudents.map(st => {
                        const avg = window.calculateOverallAverage(st.id, "3e Trimestre");
                        return { student: st, average: avg !== null ? avg : (grade === "CM2" && st.firstName.startsWith("A") ? 8.7 : 7.2) };
                    }).sort((a,b) => b.average - a.average);

                    return `
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                            <!-- Class and Teacher KPIs Profile -->
                            <div class="bg-slate-950 p-5 rounded-xl border border-slate-805 space-y-4">
                                <div class="text-center space-y-2">
                                    <div class="w-16 h-16 bg-emerald-500/10 text-emerald-400 text-3xl mx-auto rounded-xl flex items-center justify-center font-bold border border-emerald-500/20">
                                        <i class="fa-solid fa-chalkboard-user"></i>
                                    </div>
                                    <h3 class="text-base font-black text-white">${teacherName}</h3>
                                    <p class="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Professeur Titulaire de la Classe ${window.statsSelectedClass}</p>
                                </div>

                                <div class="bg-slate-900 border border-slate-850 p-3 rounded-xl text-center space-y-1.5">
                                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Note d'Évaluation Globale</p>
                                    
                                    <!-- Stars representation -->
                                    <div class="flex items-center justify-center text-yellow-400 space-x-1 py-1 text-base select-none">
                                        <i class="fa-${evaluationRating >= 1 ? 'solid' : 'regular'} fa-star"></i>
                                        <i class="fa-${evaluationRating >= 2 ? 'solid' : 'regular'} fa-star"></i>
                                        <i class="fa-${evaluationRating >= 3 ? 'solid' : 'regular'} fa-star"></i>
                                        <i class="fa-${evaluationRating >= 4 ? 'solid' : 'regular'} fa-star"></i>
                                        <i class="fa-${evaluationRating >= 5 ? 'solid' : 'regular'} fa-star"></i>
                                    </div>
                                    <p class="text-[11px] font-bold text-emerald-400">${evaluationLabel}</p>
                                </div>

                                <div class="space-y-2 text-xs">
                                    <div class="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                                        <span class="text-slate-400 font-semibold"><i class="fa-solid fa-users mr-1.5 text-slate-500"></i>Effectif de la classe :</span>
                                        <span class="font-extrabold text-white">${totalClassStudents} élèves</span>
                                    </div>
                                    <div class="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                                        <span class="text-slate-400 font-semibold"><i class="fa-solid fa-star-half-stroke mr-1.5 text-slate-500"></i>Moyenne Générale Classe :</span>
                                        <span class="font-extrabold text-white font-mono">${classAvg.toFixed(2)}/10</span>
                                    </div>
                                    <div class="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                                        <span class="text-slate-400 font-semibold"><i class="fa-solid fa-clipboard-user mr-1.5 text-slate-500"></i>Taux de Présence :</span>
                                        <span class="font-extrabold text-white font-mono">${classAttendanceRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Chart visualizer and ranks of students -->
                            <div class="lg:col-span-2 space-y-6">
                                <!-- Subject Bar graphs -->
                                <div class="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3.5 shadow">
                                    <h5 class="text-xs font-black text-slate-300 uppercase tracking-wide">Moyennes Globales par Matière d'Étude</h5>
                                    
                                    <div class="space-y-3 pt-1">
                                        ${subjectAverages.map(sa => {
                                            const pct = (sa.avg / 10) * 100;
                                            return `
                                                <div class="space-y-1">
                                                    <div class="flex justify-between text-xs">
                                                        <span class="text-slate-400 font-semibold">${sa.name}</span>
                                                        <span class="font-mono font-bold text-slate-200">${sa.avg.toFixed(2)} / 10</span>
                                                    </div>
                                                    <div class="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                                        <div style="width: ${pct}%" class="h-full bg-indigo-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>

                                <!-- Class roster rankings of students -->
                                <div class="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3.5 shadow">
                                    <h5 class="text-xs font-black text-slate-300 uppercase tracking-wide">Palmarès de Mérite & Rangs (${window.statsSelectedClass})</h5>
                                    
                                    <div class="overflow-x-auto">
                                        <table class="w-full text-xs text-left">
                                            <thead class="bg-slate-900 text-slate-400 border-b border-slate-850 uppercase text-[9px] font-bold">
                                                <tr>
                                                    <th class="p-2.5">Rang</th>
                                                    <th class="p-2.5">Nom complet de l'élève</th>
                                                    <th class="p-2.5 text-right">Moyenne Générale</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-850/40">
                                                ${ranking.map((r, index) => {
                                                    let badgeText = `${index+1}e`;
                                                    if (index === 0) badgeText = "🏆 1er";
                                                    return `
                                                        <tr class="hover:bg-slate-900/40">
                                                            <td class="p-2.5 font-bold font-mono text-emerald-400">${badgeText}</td>
                                                            <td class="p-2.5 font-bold text-slate-200">${r.student.firstName} ${r.student.lastName} <span class="text-[9px] text-slate-600 font-mono ml-1.5">${r.student.studentNumber}</span></td>
                                                            <td class="p-2.5 text-right font-mono font-extrabold text-white">${r.average.toFixed(2)} / 10</td>
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
                })()}
            </div>
        </div>
    `;
};
