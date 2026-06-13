/* ==========================================================================
   SUNU ÉCOLE - MODULE 6: CENTRAL ROUTER, SIDEBAR NAVIGATION & ENGINE HUB
   ========================================================================== */

// 1. ACTOR SCREEN DEFINITIONS & MAPS
const DIRECTEUR_SCREENS = [
    { id: 'DASHBOARD', label: 'Vue d\'ensemble', icon: 'fa-gauge' },
    { id: 'TEACHERS', label: 'Enseignants', icon: 'fa-chalkboard-user' },
    { id: 'SUBJECTS', label: 'Matières & Coeff', icon: 'fa-book-open' },
    { id: 'BULLETINS', label: 'Viser Bulletins', icon: 'fa-file-signature' },
    { id: 'STATS', label: 'Évaluation & Stats', icon: 'fa-chart-pie' }
];

const SECRETAIRE_SCREENS = [
    { id: 'INSCRIPTION', label: 'Inscrire Élève', icon: 'fa-user-plus' },
    { id: 'STUDENTS', label: 'Registre des Élèves', icon: 'fa-address-book' },
    { id: 'BULLETINS', label: 'Tirage Bulletins', icon: 'fa-print' }
];

const ENSEIGNANT_SCREENS = [
    { id: 'BOARD', label: 'Saisie Appel', icon: 'fa-clipboard-user' },
    { id: 'GRADES', label: 'Saisie Notes', icon: 'fa-marker' },
    { id: 'STATS', label: 'Analyses de Classe', icon: 'fa-chart-pie' }
];

const STUDENT_SCREENS = [
    { id: 'DASHBOARD', label: 'Mon Espace', icon: 'fa-house-user' },
    { id: 'BULLETINS', label: 'Livret de Notes', icon: 'fa-medal' },
    { id: 'ATTENDANCE', label: 'Suivi Présences', icon: 'fa-clipboard-list' }
];


// 2. CENTRAL SCREEN STATE NAVIGATION ROUTING
window.switchScreen = function(screen) {
    window.currentScreen = screen;
    
    // Update active nav button layouts
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-slate-950', 'text-emerald-400');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`nav-btn-${screen}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-slate-950', 'text-emerald-400');
        activeBtn.classList.remove('text-slate-400');
    }

    // Render the selected view layout
    window.renderActiveScreen();
};


// 3. MAIN WORKSPACE DESIGN RENDERER ROUTINES
window.renderActiveScreen = function() {
    const container = document.getElementById('screen-container');
    if (!container) return; // Silent guard
    container.innerHTML = ''; // Fresh state clear

    if (window.currentRole === 'DIRECTEUR') {
        if (window.currentScreen === 'DASHBOARD') window.renderDirecteurOverview(container);
        else if (window.currentScreen === 'TEACHERS') window.renderDirecteurTeachers(container);
        else if (window.currentScreen === 'SUBJECTS') window.renderDirecteurSubjects(container);
        else if (window.currentScreen === 'BULLETINS') window.renderDirecteurBulletins(container);
        else if (window.currentScreen === 'STATS') window.renderDirecteurStats(container);
    } else if (window.currentRole === 'SECRETAIRE') {
        if (window.currentScreen === 'INSCRIPTION') window.renderSecretaireInscription(container);
        else if (window.currentScreen === 'STUDENTS') window.renderSecrétaireStudents(container);
        else if (window.currentScreen === 'BULLETINS') window.renderSecretaireBulletins(container);
    } else if (window.currentRole === 'ENSEIGNANT') {
        if (window.currentScreen === 'BOARD') window.renderEnseignantAttendance(container);
        else if (window.currentScreen === 'GRADES') window.renderEnseignantGrades(container);
        else if (window.currentScreen === 'STATS') window.renderEnseignantStats(container);
    } else if (window.currentRole === 'PARENT_ELEVE') {
        if (window.currentScreen === 'DASHBOARD') window.renderStudentOverview(container);
        else if (window.currentScreen === 'BULLETINS') window.renderStudentBulletins(container);
        else if (window.currentScreen === 'ATTENDANCE') window.renderStudentAttendance(container);
    }
};


// 4. NAVIGATION BAR CONSTRUCTS FOR ROLES
window.renderNavigationBar = function() {
    const navBar = document.getElementById('navigation-bar');
    if (!navBar) return;
    navBar.innerHTML = ''; // Hard reset

    let screens = [];
    if (window.currentRole === 'DIRECTEUR') screens = DIRECTEUR_SCREENS;
    else if (window.currentRole === 'SECRETAIRE') screens = SECRETAIRE_SCREENS;
    else if (window.currentRole === 'ENSEIGNANT') screens = ENSEIGNANT_SCREENS;
    else if (window.currentRole === 'PARENT_ELEVE') screens = STUDENT_SCREENS;

    screens.forEach(s => {
        const isActive = s.id === window.currentScreen;
        const activeClass = isActive ? 'bg-slate-950 text-emerald-400' : 'text-slate-400';
        
        navBar.innerHTML += `
            <button id="nav-btn-${s.id}" onclick="window.switchScreen('${s.id}')" 
                class="nav-btn flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-950 hover:text-slate-200 transition ${activeClass}">
                <i class="fa-solid ${s.icon} text-sm"></i>
                <span class="truncate">${s.label}</span>
            </button>
        `;
    });
};


// 5. WORKSPACE CONTEXT INITIALIZATION
window.setupWorkspace = function(user) {
    // Determine target initial page on load
    if (user.role === 'DIRECTEUR') {
        window.currentScreen = 'DASHBOARD';
    } else if (user.role === 'SECRETAIRE') {
        window.currentScreen = 'INSCRIPTION';
    } else if (user.role === 'ENSEIGNANT') {
        window.currentScreen = 'BOARD';
    } else if (user.role === 'PARENT_ELEVE') {
        window.currentScreen = 'DASHBOARD';
    }

    // Sync views
    window.renderNavigationBar();
    window.renderActiveScreen();
};


// 6. INITIAL APPLICATION LOADER
window.addEventListener('load', () => {
    // 1. Initial Storage setup
    window.initStorage();

    // 2. Select default login role representation
    window.selectLoginRole('DIRECTEUR');

    // 3. Process potential direct deep links in emails or SMS chats
    window.handleUrlParametersOnLoad();

    // 4. Hook central Login Form Listener
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', window.handleLoginSubmit);
    }
});


// 7. PWA SERVICE WORKER REGISTRATION (Cache offline capability check)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log("SunuÉcole Service Worker Registered successfully.");
        }).catch(err => {
            console.log("Service Worker Registration failed : ", err);
        });
    });
}
