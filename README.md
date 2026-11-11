# Mes petits jeux

Site de petits jeux avec classements, jouable sans compte.

## Contenu

- `index.html` : accueil, par rubrique (BTS, Première, Terminale, Perso), avec le podium de chaque jeu
- `classement.html` : classements complets, un onglet par jeu (meilleur score de chaque joueur, ou toutes les parties)
- `jeux/` : un fichier par jeu
- `js/games.js` : les rubriques et la liste des jeux (titre, description, couleurs, empreinte du code)
- `js/access.js` : les codes d'accès
- `js/scores.js` : enregistrement et lecture des scores
- `js/config.js` : adresse et clé publique de la base Supabase
- `css/site.css` : style de l'accueil et du classement

## Codes d'accès

- La rubrique **Perso** est fermée par un code à 4 chiffres. Ses jeux n'apparaissent ni sur l'accueil ni dans les classements tant que le code n'a pas été saisi.
- Un jeu peut avoir son **propre code** (champ `codeHash`). La page du jeu le demande avant de s'ouvrir.
- Les codes ne sont jamais écrits en clair dans le dépôt : on garde leur empreinte (SHA-256). C'est une barrière douce, qui guide les élèves mais ne protège pas contre quelqu'un de très motivé.
- Pour changer un code, il suffit de recalculer l'empreinte : `sha256("mesjeux:" + code en minuscules)`.

## Scores

Chaque partie envoie son score à la table `scores` de Supabase (colonnes `game`, `player`, `score`, `details`, `created_at`). Toutes les parties sont gardées.

| Jeu | Score sur 100 |
| --- | --- |
| Le Franchisé | 70 % de bonnes réponses + 30 % de trésorerie finale |
| Direction Saint-Gratien | fin perdue : 0 · fin gagnante : 50 à 95 selon la surprise rapportée · « liste complète » : 100 · fin cachée : 75 |

## Ajouter un jeu

1. Déposer le fichier du jeu dans `jeux/`.
2. Ajouter une entrée dans `js/games.js`, avec sa rubrique (`section`) et, si besoin, `codeHash`.
3. Dans la page du jeu, charger `games.js` et `access.js`, et déclarer `window.MESJEUX_GAME = "identifiant"`.
4. À la fin de la partie, appeler `MesJeux.save("identifiant", pseudo, score, details)`.
