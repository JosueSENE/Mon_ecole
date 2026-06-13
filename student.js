/* ==========================================================================
   SUNU ÉCOLE - MODULE 5: STUDENT AND PARENTS DATA WORKSPACE
   ========================================================================== */

// 1. ACTIVE TERM PICKER (Initially shown if not set)
window.renderStudentActiveTermPicker = function(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in text-center my-10">
            <div class="w-16 h-16 bg-blue-500/10 text-blue-400 text-3xl mx-auto rounded-2xl flex items-center justify-center font-bold border border-blue-500/20 shadow">
                <i class="fa-solid fa-graduation-cap"></i>
            </div>
            
            <div class="space-y-1.5">
                <h4 class="text-sm font-black text-white uppercase tracking-wider">Espace Parent - Choisir un Trimestre</h4>
                <p class="text-xs text-slate-400">Pour consulter le livret de notes et l'historique de présence de votre enfant, veuillez sélectionner la période académique :</p>
            </div>

            <div class="grid grid-cols-1 gap-3 pt-2">
                <button onclick="window.setStudentActiveTerm('1er Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-805 text-slate-100 rounded-xl font-bold transition flex items-center justify-between px-4 uppercase text-xs">
                    <span>🍂 1er Trimestre (Clôturé)</span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                </button>
                <button onclick="window.setStudentActiveTerm('2e Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-805 text-slate-100 rounded-xl font-bold transition flex items-center justify-between px-4 uppercase text-xs">
                    <span>❄️ 2e Trimestre (Clôturé)</span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                </button>
                <button onclick="window.setStudentActiveTerm('3e Trimestre')" class="w-full py-3 bg-slate-950 border border-slate-800 hover:bg-slate-805 text-slate-100 rounded-xl font-bold transition flex items-center justify-between px-4 uppercase text-xs">
                    <span>🌱 3e Trimestre (En cours)</span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                </button>
            </div>
        </div>
    `;
};

window.setStudentActiveTerm = function(term) {
    window.activeStudentTerm = term;
    window.renderActiveScreen();
    if (term) {
        window.showToast(`📅 Consultation initialisée : ${term}`, 'info');
    }
};


// 2. MAIN STUDENT PROGRESS OVERVIEW (Dashboard)
window.renderStudentOverview = function(container) {
    if (!window.activeStudentTerm) {
        window.renderStudentActiveTermPicker(container);
        return;
    }

    const std = window.currentUser.student;
    const grades = window.db.grades.filter(g => g.studentId === std.id && g.term === window.activeStudentTerm);
    const average = window.calculateOverallAverage(std.id, window.activeStudentTerm);
    const absCount = window.db.attendance.filter(a => a.studentId === std.id && a.status === 'Absent').length;
    const lateCount = window.db.attendance.filter(a => a.studentId === std.id && a.status === 'Retard').length;

    // Check signed / visa
    const signature = window.db.signedBulletins.find(sb => sb.studentId === std.id && sb.term === window.activeStudentTerm);
    const isSigned = signature ? signature.isSigned : false;

    let progressRatingText = "Passable";
    let progressColor = "text-yellow-500";
    if (average >= 8.5) { progressRatingText = "Excellent Travail ! Félicitations."; progressColor = "text-emerald-450"; }
    else if (average >= 7.0) { progressRatingText = "Très Bon Trimestre"; progressColor = "text-indigo-400"; }
    else if (average >= 5.0) { progressRatingText = "Résultats satisfaisants"; progressColor = "text-blue-450"; }
    else if (average !== null) { progressRatingText = "Doit redoubler d'efforts"; progressColor = "text-rose-500"; }
    else progressRatingText = "En attente de relevés trimestriels";

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Selected Trimestre banner with action to change -->
            <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex items-center justify-between shadow">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-400">Période consultée :</span>
                    <span class="text-xs font-black text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"><i class="fa-solid fa-calendar mr-1.5"></i>${window.activeStudentTerm}</span>
                </div>
                <button onclick="window.setStudentActiveTerm(null)" class="text-[10px] bg-slate-800 hover:bg-slate-705 font-bold px-3 py-1.5 rounded-lg text-slate-300 transition hover:scale-[1.02]">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Changer de période
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Moyenne Générale</p>
                        <p class="text-2xl font-black text-white mt-1">${average !== null ? `${average.toFixed(2)}/10` : '-- / 10'}</p>
                    </div>
                    <div class="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-chart-line"></i></div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Absences enregistrées</p>
                        <p class="text-2xl font-black text-rose-500 mt-1">${absCount} <span class="text-xs text-slate-500 font-normal">jours absents</span></p>
                    </div>
                    <div class="w-10 h-10 bg-red-500/10 text-red-550 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-circle-exclamation"></i></div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                    <div>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Retards signalés</p>
                        <p class="text-2xl font-black text-amber-500 mt-1">${lateCount} <span class="text-xs text-slate-500 font-normal">enregistrements</span></p>
                    </div>
                    <div class="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center justify-center text-lg"><i class="fa-solid fa-business-time"></i></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Academic Appreciation and Visa validation state -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md col-span-1 h-fit">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-graduation-cap text-indigo-400 mr-2"></i>Synthèse de la Direction</h4>
                    
                    <div class="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5 text-center shadow">
                        <span class="text-[10px] text-slate-500 font-black uppercase tracking-wider">Mention Académique Estimée</span>
                        <p class="text-base font-black ${progressColor}">${progressRatingText}</p>
                        
                        <div class="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                            <div class="h-full bg-indigo-500" style="width: ${average !== null ? (average / 10) * 100 : 0}%"></div>
                        </div>
                    </div>

                    <div class="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <span class="text-slate-400 font-bold uppercase text-[9px]">Visa Signature Directeur :</span>
                        ${isSigned ? 
                            '<span class="text-green-400 font-black uppercase text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20"><i class="fa-solid fa-signature mr-1"></i>Visé Conforme</span>' : 
                            '<span class="text-amber-500 font-black uppercase text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"><i class="fa-solid fa-clock mr-1"></i>En attente de visa</span>'
                        }
                    </div>
                </div>

                <!-- Last grades listings widget -->
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2 shadow-md">
                    <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-list-check mr-2 text-emerald-400"></i>Détail des notes obtenues par matière (${window.activeStudentTerm})</h4>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-950 text-slate-500 border-b border-slate-800 text-[10px] uppercase font-bold">
                                <tr>
                                    <th class="p-2.5">Matière / Composante</th>
                                    <th class="p-2.5">Date</th>
                                    <th class="p-2.5 text-center">Coef</th>
                                    <th class="p-2.5 text-right">Note obtenues / 10</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                ${grades.length === 0 ? `<tr><td colspan="4" class="p-4 text-center text-slate-500">Aucun relevé d'évaluation publié pour ce trimestre.</td></tr>` : 
                                    grades.map(g => `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-2.5">
                                                <p class="font-extrabold text-slate-200">${g.subject}</p>
                                                <p class="text-[9px] text-slate-500 font-medium">${g.subSubject || 'Évaluation Globale'}</p>
                                            </td>
                                            <td class="p-2.5 font-mono text-[10px] text-slate-500">${g.date}</td>
                                            <td class="p-2.5 text-center font-bold text-slate-400">${g.coefficient}</td>
                                            <td class="p-2.5 text-right font-mono font-black text-blue-400 text-sm">${g.score.toFixed(2)}</td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
};


// 3. STUDENT DETAILED BULLETINS CARD (Livret de Notes)
window.renderStudentBulletins = function(container) {
    if (!window.activeStudentTerm) {
        window.renderStudentActiveTermPicker(container);
        return;
    }

    const std = window.currentUser.student;
    const grades = window.db.grades.filter(g => g.studentId === std.id && g.term === window.activeStudentTerm);
    const average = window.calculateOverallAverage(std.id, window.activeStudentTerm);

    // Check signed / visa status
    const signature = window.db.signedBulletins.find(sb => sb.studentId === std.id && sb.term === window.activeStudentTerm);
    const isSigned = signature ? signature.isSigned : false;

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Selected Trimestre banner with action to change -->
            <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex items-center justify-between shadow">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-400">Période consultée :</span>
                    <span class="text-xs font-black text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"><i class="fa-solid fa-calendar mr-1.5"></i>${window.activeStudentTerm}</span>
                </div>
                <button onclick="window.setStudentActiveTerm(null)" class="text-[10px] bg-slate-800 hover:bg-slate-750 font-bold px-3 py-1.5 rounded-lg text-slate-300 transition hover:scale-[1.02]">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Changer de période
                </button>
            </div>

            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                    <div class="space-y-1">
                        <h4 class="text-sm font-black text-white uppercase tracking-wider">Bulletin Scolaire Électronique Officiel</h4>
                        <p class="text-[10px] text-slate-500 font-bold uppercase">${std.firstName} ${std.lastName} • Classe : ${std.classGrade}-${std.classDivision}</p>
                    </div>

                    ${isSigned ? `
                        <button onclick="window.previewStudentBulletinPDF(${std.id}, '${window.activeStudentTerm}')" 
                            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase rounded shadow transition hover:scale-[1.015]">
                            <i class="fa-solid fa-print mr-1"></i> Imprimer le Bulletin Officiel (PDF)
                        </button>
                    ` : `
                        <button disabled class="px-3 py-2 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded cursor-not-allowed border border-slate-805">
                            <i class="fa-solid fa-lock mr-1"></i> Impression déverrouillée après Visa
                        </button>
                    `}
                </div>

                <div class="overflow-x-auto text-left">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-805">
                            <tr>
                                <th class="p-3">Matière d'Éval</th>
                                <th class="p-3">Détails Composante (Sous-Matière)</th>
                                <th class="p-3 text-center">Coef</th>
                                <th class="p-3 text-center">Note sur /10</th>
                                <th class="p-3 text-center">Note Pondérée</th>
                                <th class="p-3 text-right">Appréciation Pédagogique</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            ${grades.length === 0 ? `<tr><td colspan="6" class="p-4 text-center text-slate-500">Aucune évaluation n'a été saisie pour ce trimestre.</td></tr>` : 
                                grades.map(g => {
                                    const score10 = (g.score / g.maxScore) * 10;
                                    const weighted = score10 * g.coefficient;
                                    let appreciation = "Moyen";
                                    let appreciationColor = "text-yellow-500";
                                    if (score10 >= 8.5) { appreciation = "Très Bien / Excellent"; appreciationColor = "text-emerald-450"; }
                                    else if (score10 >= 7) { appreciation = "Bien"; appreciationColor = "text-indigo-400"; }
                                    else if (score10 >= 5) { appreciation = "Assez Bien"; appreciationColor = "text-blue-450"; }
                                    else appreciationColor = "text-rose-500";

                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-extrabold text-slate-100">${g.subject}</td>
                                            <td class="p-3 text-[10px] text-slate-400 font-medium">${g.subSubject || 'Évaluation globale'}</td>
                                            <td class="p-3 text-center font-bold text-slate-400 font-mono">${g.coefficient}</td>
                                            <td class="p-3 text-center font-extrabold text-slate-300 font-mono">${score10.toFixed(2)} / 10</td>
                                            <td class="p-3 text-center font-extrabold text-white font-mono">${weighted.toFixed(2)}</td>
                                            <td class="p-3 text-right font-black ${appreciationColor} text-[10px] uppercase tracking-wide font-sans">${appreciation}</td>
                                        </tr>
                                    `;
                                }).join('')
                            }
                        </tbody>
                    </table>
                </div>

                <!-- Weighted Totals Summary for single student -->
                ${grades.length === 0 ? '' : `
                    <div class="pt-4 flex flex-col sm:flex-row items-end justify-between border-t border-slate-800 gap-4">
                        <div class="text-xs text-slate-500 self-start">
                            <span class="block">* Les moyennes périodiques et les coefficients appliqués sont conformes aux barèmes de l'Académie de Dakar.</span>
                            <span class="block mt-0.5">* Visa réglementaire accordé uniquement après validation en Conseil d'établissement.</span>
                        </div>
                        
                        <div class="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2 w-full sm:w-80 shadow shadow-indigo-500/5">
                            <div class="flex justify-between text-xs">
                                <span class="text-slate-400 font-semibold">Total coefficients :</span>
                                <span class="font-extrabold text-white font-mono">${grades.reduce((a,c)=>a+c.coefficient,0)}</span>
                            </div>
                            <div class="flex justify-between text-xs">
                                <span class="text-slate-400 font-semibold">Total points pondérés :</span>
                                <span class="font-extrabold text-white font-mono">${grades.reduce((acc,c)=>acc+((c.score/c.maxScore)*10*c.coefficient),0).toFixed(2)}</span>
                            </div>
                            <hr class="border-slate-850">
                            <div class="flex justify-between text-base">
                                <span class="text-slate-300 font-extrabold">Moyenne Générale :</span>
                                <span class="font-black text-emerald-450 font-mono text-lg">${average !== null ? `${average.toFixed(2)} / 10` : '-- / 10'}</span>
                            </div>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
};


// 4. STUDENT PRESENCE REGISTRY HISTORY (Registre de présence personnel)
window.renderStudentAttendance = function(container) {
    if (!window.activeStudentTerm) {
        window.renderStudentActiveTermPicker(container);
        return;
    }

    const std = window.currentUser.student;
    const history = window.db.attendance.filter(a => a.studentId === std.id);

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Selected Trimestre banner with action to change -->
            <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl flex items-center justify-between shadow">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-400">Période consultée :</span>
                    <span class="text-xs font-black text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"><i class="fa-solid fa-calendar mr-1.5"></i>${window.activeStudentTerm}</span>
                </div>
                <button onclick="window.setStudentActiveTerm(null)" class="text-[10px] bg-slate-800 hover:bg-slate-750 font-bold px-3 py-1.5 rounded-lg text-slate-300 transition hover:scale-[1.02]">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i> Changer de période
                </button>
            </div>

            <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-md max-w-xl mx-auto">
                <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center"><i class="fa-solid fa-clipboard-user mr-2 text-indigo-400"></i>Registre d'Appel de l'enfant (${std.firstName} ${std.lastName})</h4>
                <p class="text-xs text-slate-400">Suivi rigoureux de l'assiduité dans l'établissement scolaire en temps réel :</p>

                <div class="overflow-x-auto text-left">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-950 text-slate-500 text-[10px] uppercase border-b border-slate-800 font-bold">
                            <tr>
                                <th class="p-3">Date d'appel</th>
                                <th class="p-3">Classe</th>
                                <th class="p-3 text-right">Statut / Présence</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            ${history.length === 0 ? `<tr><td colspan="3" class="p-4 text-center text-slate-500">Aucune trace de présence signalée ou l'élève a été présent tous les autres jours.</td></tr>` : 
                                history.map(h => {
                                    let statusColorClass = "text-green-400 bg-green-500/10 border-green-500/20";
                                    if (h.status === 'Absent') statusColorClass = "text-red-500 bg-red-500/10 border-red-500/20";
                                    if (h.status === 'Retard') statusColorClass = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";

                                    return `
                                        <tr class="hover:bg-slate-950/40">
                                            <td class="p-3 font-mono text-slate-205">${h.date}</td>
                                            <td class="p-3 font-bold text-slate-400">${h.classGrade}-${h.classDivision}</td>
                                            <td class="p-3 text-right">
                                                <span class="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${statusColorClass}">${h.status}</span>
                                            </td>
                                        </tr>
                                    `;
                                }).reverse().join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};
