================================================================================
           SUITE DE GESTION SCOLAIRE "SUNU ÉCOLE" — GUIDE D'ALIMENTATION XAMPP
================================================================================

Ce guide vous explique pas à pas comment installer la VERSION WEB de l'application
dans votre installation locale de XAMPP afin de la tester sur n'importe quel autre 
appareil (ordinateur, tablette, ou iPhone) de votre réseau wifi.

--------------------------------------------------------------------------------
1. ÉTAPES D'INSTALLATION SUR XAMPP (Ordinateur PC ou Mac)
--------------------------------------------------------------------------------

1. Ouvrez le dossier d'installation de XAMPP sur votre machine :
   - Sur Windows : C:\xampp\htdocs\
   - Sur macOS : /Applications/XAMPP/htdocs/

2. Téléchargez ou copiez le dossier "web_version" complet depuis ce projet et
   collez-le directement dans votre dossier `htdocs` :
   C:\xampp\htdocs\web_version\

   Ce dossier doit contenir les fichiers suivants :
   - index.html
   - manifest.json
   - sw.js
   - README_XAMPP.txt

3. Démarrez les modules Apache dans le panneau de contrôle XAMPP (XAMPP Control Panel).
   Cliquez sur le bouton "Start" à côté d'Apache.

--------------------------------------------------------------------------------
2. TROUVER L'ADRESSE IP LOCALE DE VOTRE ORDINATEUR
--------------------------------------------------------------------------------

Pour tester sur d'autres machines (comme votre iPhone ou un autre PC), vous devez
connaître l'adresse IP locale de votre ordinateur hébergeant XAMPP.

Sur Windows :
   1. Ouvrez le menu Démarrer, tapez "cmd" et appuyez sur Entrée pour ouvrir l'invite de commande.
   2. Tapez la commande suivante et appuyez sur Entrée :
      ipconfig
   3. Recherchez la ligne "Adresse IPv4". Elle ressemble à ceci : 192.168.1.50 (ou 10.0.0.X).

Sur macOS/Linux :
   1. Ouvrez le Terminal.
   2. Tapez :
      ifconfig | grep "inet "
   3. Identifiez votre adresse réseau locale (souvent sous `en0` ou `wlan0`), par exemple 192.168.1.50.

--------------------------------------------------------------------------------
3. ACCÈS DEPUIS UN IPHONE OU AUTRE MACHINE DU RÉSEAU
--------------------------------------------------------------------------------

1. Assurez-vous que votre ordinateur XAMPP et votre iPhone sont connectés
   exactement au MÊME réseau Wifi.

2. Sur votre iPhone, ouvrez l'application Safari.

3. Dans la barre d'adresse de Safari, saisissez l'URL de votre ordinateur hébergeur :
   http://<ADRESSE_IP_LOCALE>/web_version/

   Exemple :
   http://192.168.1.50/web_version/

--------------------------------------------------------------------------------
4. COMMENT INSTALLER SUR L'IPHONE ET EN FAIRE UNE APP COMPLÈTE (PWA)
--------------------------------------------------------------------------------

Une fois sur le site via Safari sur votre iPhone :
1. Appuyez sur l'icône de "Partager" (le carré avec une flèche pointant vers le haut).
2. Faites défiler vers le bas et sélectionnez :
   "Sur l'écran d'accueil" (Add to Home Screen).
3. Modifiez ou confirmez le nom "SunuÉcole" et appuyez sur "Achever" ou "Ajouter".

L'application apparaîtra maintenant sur le bureau de votre iPhone comme une application
indépendante de Safari, s'ouvrira en plein écran (sans barre de navigation de navigateur)
et fonctionnera de manière ultra-fluide avec stockage local intégré !

--------------------------------------------------------------------------------
5. IDENTIFIANTS DE TEST DÉMO (SYNCHRONISÉS AVEC L'APPLICATION ANDROID)
--------------------------------------------------------------------------------

* DIRECTEUR (Administration Générale) :
  - Email : directeur@sunuecole.sn
  - Code d'accès : 1234
  - (Sert à inviter des profs, configurer les matières, signer les bulletins globaux)

* SECRÉTAIRE (Onboarding & Inscriptions) :
  - Email : secretaire@sunuecole.sn
  - Code d'accès : 5678
  - (Sert à enregistrer, mettre à jour, supprimer ou promouvoir les élèves)

* ENSEIGNANTS (Notes & Appel journalier) :
  - Email : fall@ecole.sn (Mot de passe/Code : PROF-ABC123)
  - (Sert à faire l'appel de présence et à entrer les notes par niveau)

* PARENTS D'ÉLÈVES :
  - Email : abdoulaye.ndiaye@ecole.sn (Mot de passe/Matricule : SN-2026-001)
  - (Sert à consulter l'appel de son enfant, ses notes et voir son bulletin signé)
