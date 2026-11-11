/* Liste des jeux du site. Pour ajouter un jeu : un fichier dans /jeux
   et une entrée ici. L'accueil et le classement se mettent à jour seuls. */
window.MESJEUX_GAMES = [
  {
    id: "franchise",
    title: "Le Franchisé",
    file: "jeux/franchise.html",
    blurb: "Tu ouvres un restaurant sous franchise et tu le gères cinq ans. Chaque décision de droit fait bouger ta trésorerie.",
    scoreLabel: "Note",
    max: 100,
    bg: "#14213d", fg: "#ffffff",
    detail: function (r) {
      var d = r.details || {};
      if (d.good == null) return "";
      return d.good + "/" + d.total + " bonnes réponses · " + d.cash + " k€" + (d.cls ? " · " + d.cls : "");
    }
  },
  {
    id: "saint-gratien",
    title: "Direction Saint-Gratien",
    file: "jeux/saint-gratien.html",
    blurb: "Le 31 au soir, tu pars de Cormeilles avec 20 € pour rejoindre Yann. Rapporte de quoi boire, de quoi manger et une surprise avant minuit.",
    scoreLabel: "Score",
    max: 100,
    bg: "#0d1530", fg: "#ffc629",
    detail: function (r) {
      var d = r.details || {};
      return d.title || "";
    }
  }
];
