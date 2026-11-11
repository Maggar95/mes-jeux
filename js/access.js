/* Codes d'accès : un code pour la rubrique Perso, un code par jeu si le jeu en a un.
   C'est une barrière douce, pas une vraie sécurité : elle guide les élèves,
   elle n'empêche pas quelqu'un de très motivé de retrouver l'adresse d'un jeu. */
(function () {
  "use strict";
  var SALT = "mesjeux:";
  var sections = window.MESJEUX_SECTIONS || [], games = window.MESJEUX_GAMES || [];

  function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function set(store, k, v) { try { window[store].setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  function section(id) { return sections.filter(function (s) { return s.id === id; })[0]; }
  function game(id) { return games.filter(function (g) { return g.id === id; })[0]; }

  function sha(str) {
    if (!(window.crypto && crypto.subtle)) return Promise.resolve("");
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    });
  }
  function norm(c) { return String(c || "").trim().toLowerCase(); }

  /* La rubrique Perso reste ouverte sur cet appareil ; le code d'un jeu ne vaut que pour l'onglet en cours. */
  function sectionOpen(s) { return !s || !s.codeHash || get("localStorage", "mj-sec-" + s.id) === s.codeHash; }
  function gameOpen(g) { return !g.codeHash || get("sessionStorage", "mj-game-" + g.id) === g.codeHash; }

  function tryCode(kind, obj, code) {
    return sha(SALT + norm(code)).then(function (h) {
      if (!h || h !== obj.codeHash) return false;
      if (kind === "sec") set("localStorage", "mj-sec-" + obj.id, h); else set("sessionStorage", "mj-game-" + obj.id, h);
      return true;
    });
  }

  var CSS = ".mj-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:#fbfaf6;color:#1d2233;font:17px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    ".mj-gate form{width:100%;max-width:360px}.mj-gate h2{margin:0 0 6px;font-size:26px;line-height:1.15}.mj-gate p{margin:0 0 16px;color:#5d6482}" +
    ".mj-gate input{width:100%;font:inherit;font-size:22px;letter-spacing:.2em;text-align:center;padding:12px;border:2px solid #1b2a8a;border-radius:6px;background:#fff;color:#1d2233}" +
    ".mj-gate button{width:100%;margin-top:12px;font:600 17px/48px system-ui,sans-serif;border:0;border-radius:6px;background:#1b2a8a;color:#fff;cursor:pointer}" +
    ".mj-gate .err{min-height:24px;margin:8px 0 0;color:#b3261e;font-size:15px}.mj-gate a{color:#1b2a8a}" +
    "@media (prefers-color-scheme:dark){.mj-gate{background:#10152b;color:#e9ecf8}.mj-gate p{color:#9aa3c7}.mj-gate input{background:#161d3b;color:#e9ecf8;border-color:#a9baff}.mj-gate button{background:#a9baff;color:#10152b}.mj-gate a{color:#a9baff}.mj-gate .err{color:#ff8a80}}";

  /* Demande le code avant d'ouvrir une page de jeu */
  function gate(id) {
    var g = game(id); if (!g) return;
    var s = section(g.section), need = null;
    if (!sectionOpen(s)) need = { kind: "sec", obj: s, title: "Partie " + s.title.toLowerCase(), numeric: !!s.digits, max: s.digits };
    else if (!gameOpen(g)) need = { kind: "game", obj: g, title: g.title, numeric: false, max: 24 };
    if (!need) return;

    var style = document.createElement("style"); style.textContent = CSS;
    var box = document.createElement("div"); box.className = "mj-gate";
    box.innerHTML = '<form><h2></h2><p>Entre le code pour continuer.</p>' +
      '<input id="mj-code" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Code">' +
      '<div class="err" role="alert"></div><button type="submit">Entrer</button>' +
      '<p style="margin:16px 0 0;font-size:15px"><a href="../index.html">Retour aux jeux</a></p></form>';
    box.querySelector("h2").textContent = need.title;
    var input = box.querySelector("input"), err = box.querySelector(".err");
    if (need.numeric) { input.inputMode = "numeric"; input.pattern = "[0-9]*"; }
    if (need.max) input.maxLength = need.max;
    document.head.appendChild(style); document.body.appendChild(box);
    document.documentElement.style.overflow = "hidden";
    input.focus();
    box.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      tryCode(need.kind, need.obj, input.value).then(function (ok) {
        if (!ok) { err.textContent = "Code incorrect. Réessaie."; input.select(); return; }
        box.remove(); style.remove(); document.documentElement.style.overflow = "";
        gate(id);
      });
    });
  }

  window.Access = { sections: sections, games: games, section: section, game: game, sectionOpen: sectionOpen, gameOpen: gameOpen, tryCode: tryCode, gate: gate };

  if (window.MESJEUX_GAME) {
    if (document.body) gate(window.MESJEUX_GAME);
    else document.addEventListener("DOMContentLoaded", function () { gate(window.MESJEUX_GAME); });
  }
})();
