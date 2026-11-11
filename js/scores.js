/* Enregistrement et lecture des scores (Supabase, via l'API REST).
   Utilisé par les jeux, l'accueil et la page de classement. */
(function () {
  "use strict";
  var cfg = window.MESJEUX_CONFIG || {};
  var PENDING = "mj-pending";

  function ready() { return !!(cfg.supabaseUrl && cfg.supabaseKey); }
  function endpoint() { return cfg.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/scores"; }
  function headers(extra) {
    var h = { apikey: cfg.supabaseKey, Authorization: "Bearer " + cfg.supabaseKey };
    for (var k in extra) h[k] = extra[k];
    return h;
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }

  function post(row) {
    return fetch(endpoint(), {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(row)
    }).then(function (r) { if (!r.ok) throw new Error("http " + r.status); return true; });
  }

  function queue(row) {
    var q = []; try { q = JSON.parse(lsGet(PENDING) || "[]"); } catch (e) { q = []; }
    q.push(row); lsSet(PENDING, JSON.stringify(q.slice(-20)));
  }

  /* Renvoie les scores restés en attente (connexion coupée) */
  function flush() {
    if (!ready()) return Promise.resolve();
    var q = []; try { q = JSON.parse(lsGet(PENDING) || "[]"); } catch (e) { q = []; }
    if (!q.length) return Promise.resolve();
    lsSet(PENDING, "[]");
    return q.reduce(function (p, row) {
      return p.then(function () { return post(row).catch(function () { queue(row); }); });
    }, Promise.resolve());
  }

  /* Résultat : {ok:true} ou {ok:false, reason:"config"|"data"|"network"} */
  function save(game, player, score, details) {
    if (!ready()) return Promise.resolve({ ok: false, reason: "config" });
    player = String(player || "").replace(/\s+/g, " ").trim().slice(0, 30);
    score = Number(score);
    if (!player || !isFinite(score)) return Promise.resolve({ ok: false, reason: "data" });
    var row = { game: game, player: player, score: score, details: details || null };
    return post(row).then(function () { flush(); return { ok: true }; },
                          function () { queue(row); return { ok: false, reason: "network" }; });
  }

  /* Toutes les parties d'un jeu, meilleurs scores d'abord */
  function list(game, limit) {
    if (!ready()) return Promise.reject(new Error("config"));
    var url = endpoint() + "?select=player,score,details,created_at&order=score.desc,created_at.asc&limit=" + (limit || 500) +
              (game ? "&game=eq." + encodeURIComponent(game) : "");
    return fetch(url, { headers: headers() }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    });
  }

  /* Garde la meilleure partie de chaque joueur */
  function bestPerPlayer(rows) {
    var seen = {}, out = [];
    rows.slice().sort(function (a, b) {
      return (b.score - a.score) || (a.created_at < b.created_at ? -1 : 1);
    }).forEach(function (r) {
      var k = String(r.player).toLowerCase();
      if (!seen[k]) { seen[k] = 1; out.push(r); }
    });
    return out;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  window.MesJeux = { ready: ready, save: save, list: list, bestPerPlayer: bestPerPlayer, flush: flush, esc: esc };
  flush();
})();
