/* Rubriques et liste des jeux du site.
   Pour ajouter un jeu : un fichier dans /jeux et une entrée dans MESJEUX_GAMES.
   Les codes ne sont jamais écrits en clair : on garde leur empreinte (SHA-256).
   Pour changer un code, demande à Claude de recalculer l'empreinte. */
window.MESJEUX_SECTIONS = [
  { id: "bts", title: "BTS", classes: ["BTS MCO JV1"] },
  { id: "premiere", title: "Première", classes: ["1STMG1"] },
  { id: "terminale", title: "Terminale", classes: ["TSTMG1"] },
  { id: "perso", title: "Perso", digits: 4, codeHash: "b78d125addc643d00a0fc62475ec89306f435505efd996a34bdfbd725b7fa637" }
];

window.MESJEUX_GAMES = [
  {
    id: "franchise",
    section: "bts",
    title: "Le Franchisé",
    file: "jeux/franchise.html",
    codeHash: "91f142bd09b5fede03a12146c666b452d28d2686e57d703cd76f7fa1a25219dc",
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
    id: "drh-festival",
    section: "terminale",
    title: "Le DRH du Festival",
    file: "jeux/drh-festival.html",
    blurb: "Tu deviens DRH d'un festival de musique et tu dois le faire tourner pendant trois éditions : recrutements, contrats, entretiens. Trésorerie, ambiance et conformité : si l'une tombe à zéro, c'est la fin du concert.",
    scoreLabel: "Score",
    unit: " pts",
    bg: "#1a0b3b", fg: "#ffd23f",
    detail: function (r) {
      var d = r.details || {};
      return (d.ending || "") + (d.cls ? " · " + d.cls : "");
    }
  },
  {
    id: "saint-gratien",
    section: "perso",
    title: "Direction Saint-Gratien",
    file: "jeux/saint-gratien.html",
    blurb: "Le 31 au soir, tu pars de Cormeilles avec 20 € pour rejoindre Yann. Rapporte de quoi boire, de quoi manger et une surprise avant minuit.",
    rank: "endings",          /* classement par nombre de fins différentes découvertes */
    scoreLabel: "Fins",
    unit: " fins",
    bg: "#0d1530", fg: "#ffc629",
    detail: function (r) {
      var d = r.details || {};
      return d.title || "";
    }
  }
];
