# Mes petits jeux

Site de petits jeux avec classements, jouable sans compte.

## Contenu

- `index.html` : accueil, par rubrique (BTS, Première, Terminale, Perso), avec le podium de chaque jeu
- `classement.html` : classements complets, un onglet par jeu (meilleur score de chaque joueur, ou toutes les parties)
- `jeux/` : un fichier par jeu
- `js/games.js` : les rubriques et la liste des jeux (titre, description, couleurs, empreinte du code)
- `js/access.js` : les codes d'accès
- `js/endings.js` : classement par fins découvertes (Saint-Gratien)
- `js/scores.js` : enregistrement et lecture des scores
- `js/qrcode.js` : petite bibliothèque libre (MIT, « qrcode-generator ») qui dessine les QR codes ; rien à régler
- `js/config.js` : adresse et clé publique de la base Supabase
- `css/site.css` : style de l'accueil et du classement

## QR codes

Chaque jeu affiche son QR code dans son menu déroulant de l'accueil. Il est calculé automatiquement à partir de l'adresse du site et du fichier du jeu : un nouveau jeu ajouté dans `js/games.js` a donc son QR sans rien faire de plus. Il ouvre la page du jeu ; si le jeu ou sa rubrique a un code, la page le redemande (le QR ne contourne rien). Le QR reste noir sur blanc en mode sombre pour bien se scanner. Pour le projeter ou l'imprimer, une capture d'écran suffit.

## Codes d'accès

- La rubrique **Perso** est fermée par un code à 4 chiffres. Ses jeux n'apparaissent ni sur l'accueil ni dans les classements tant que le code n'a pas été saisi.
- Un jeu peut avoir son **propre code** (champ `codeHash`). La page du jeu le demande avant de s'ouvrir.
- Les codes ne sont jamais écrits en clair dans le dépôt : on garde leur empreinte (SHA-256). C'est une barrière douce, qui guide les élèves mais ne protège pas contre quelqu'un de très motivé.
- Pour changer un code, il suffit de recalculer l'empreinte : `sha256("mesjeux:" + code en minuscules)`.

## Scores

Chaque partie envoie son score à la table `scores` de Supabase (colonnes `game`, `player`, `score`, `details`, `created_at`). Chaque partie jouée ajoute une ligne au classement ; la page `classement.html` permet aussi de n'afficher que le meilleur score de chaque joueur.

| Jeu | Score sur 100 |
| --- | --- |
| Le Franchisé | 70 % de bonnes réponses + 30 % de trésorerie finale |
| Direction Saint-Gratien | pas de points : classement au nombre de **fins différentes découvertes** (à égalité, le premier arrivé). Un clic sur son prénom affiche ses fins, uniquement depuis l'appareil où il a joué (liste gardée dans son navigateur) |

## Classes

Chaque rubrique a sa classe, définie dans `js/games.js` (champ `classes`) : BTS MCO JV1, 1STMG1, TSTMG1. Dans Le Franchisé, l'élève choisit sa classe et saisit son prénom suivi de l'initiale de son nom (jamais le nom complet). Les classements se filtrent par classe.

## Ajouter un jeu

1. Déposer le fichier du jeu dans `jeux/`.
2. Ajouter une entrée dans `js/games.js`, avec sa rubrique (`section`) et, si besoin, `codeHash`.
3. Dans la page du jeu, charger `games.js` et `access.js`, et déclarer `window.MESJEUX_GAME = "identifiant"`.
4. À la fin de la partie, appeler `MesJeux.save("identifiant", pseudo, score, details)`.
