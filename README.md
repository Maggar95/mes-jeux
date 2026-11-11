# Mes petits jeux

Site de petits jeux avec classements, jouable sans compte.

## Contenu

- `index.html` : accueil, liste des jeux et podium de chacun
- `classement.html` : classements complets (meilleur score de chaque joueur, ou toutes les parties)
- `jeux/` : un fichier par jeu
- `js/games.js` : la liste des jeux (titre, description, couleurs)
- `js/scores.js` : enregistrement et lecture des scores
- `js/config.js` : adresse et clé publique de la base Supabase
- `css/site.css` : style de l'accueil et du classement

## Scores

Chaque partie envoie son score à la table `scores` de Supabase (colonnes `game`, `player`, `score`, `details`, `created_at`). Toutes les parties sont gardées.

| Jeu | Score sur 100 |
| --- | --- |
| Le Franchisé | 70 % de bonnes réponses + 30 % de trésorerie finale |
| Direction Saint-Gratien | fin perdue : 0 · fin gagnante : 50 à 95 selon la surprise rapportée · « liste complète » : 100 · fin cachée : 75 |

## Ajouter un jeu

1. Déposer le fichier du jeu dans `jeux/`.
2. Ajouter une entrée dans `js/games.js`.
3. À la fin de la partie, appeler `MesJeux.save("identifiant-du-jeu", pseudo, score, details)`.
