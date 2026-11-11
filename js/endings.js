/* Classement des fins découvertes (Direction Saint-Gratien).
   Le classement compte, pour chaque joueur, le nombre de fins différentes trouvées.
   La liste détaillée de ses fins n'est lisible que par le joueur concerné, sur l'appareil
   où il a joué : elle est gardée dans son navigateur, pas affichée aux autres. */
(function () {
  "use strict";
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function key(p) { return "dsg-found:" + String(p || "").trim().toLowerCase(); }
  function found(p) {
    try { var m = JSON.parse(localStorage.getItem(key(p)) || "null"); return m && typeof m === "object" ? m : null; } catch (e) { return null; }
  }

  /* Joueurs triés par nombre de fins différentes ; à égalité, celui qui a atteint ce nombre le premier */
  function rank(rows) {
    var by = {};
    rows.slice().sort(function (a, b) { return a.created_at < b.created_at ? -1 : 1; }).forEach(function (r) {
      var id = r.details && r.details.ending; if (!id) return;
      var k = String(r.player).toLowerCase();
      var o = by[k] || (by[k] = { player: r.player, set: {}, count: 0, last: r.created_at });
      if (!o.set[id]) { o.set[id] = 1; o.count++; o.last = r.created_at; }
    });
    return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) {
      return (b.count - a.count) || (a.last < b.last ? -1 : 1);
    });
  }

  var CSS = ".en-name{background:none;border:0;padding:0;font:inherit;font-weight:600;color:inherit;text-align:left;cursor:pointer;text-decoration:underline dotted;text-underline-offset:4px}" +
    ".en-name:focus-visible{outline:3px solid currentColor;outline-offset:3px}" +
    ".en-detail td{padding:6px 10px 14px!important;font-size:14px;line-height:22px}" +
    ".en-detail ul{margin:6px 0 4px;padding-left:20px}.en-detail p{margin:0 0 4px!important;max-width:none}";

  /* Tableau cliquable : un clic sur un nom déroule ses fins, si c'est bien toi */
  function renderBoard(box, rows, opt) {
    opt = opt || {};
    if (!document.getElementById("en-css")) { var st = document.createElement("style"); st.id = "en-css"; st.textContent = CSS; document.head.appendChild(st); }
    var list = rank(rows), total = 0;
    rows.forEach(function (r) { var t = r.details && r.details.total; if (t > total) total = t; });
    box.textContent = "";
    if (!list.length) { var p = document.createElement("p"); p.className = "note small"; p.textContent = "Aucune fin découverte pour l’instant."; box.appendChild(p); return; }
    var table = document.createElement("table"); table.className = opt.cls || "board";
    table.innerHTML = '<thead><tr><th class="rk">#</th><th>Joueur</th><th class="num">Fins</th></tr></thead>';
    var body = document.createElement("tbody"); table.appendChild(body);
    list.slice(0, opt.limit || 100).forEach(function (o, i) {
      var tr = document.createElement("tr");
      if (opt.me && o.player.toLowerCase() === String(opt.me).toLowerCase()) tr.className = "me";
      var btn = '<button type="button" class="en-name" aria-expanded="false">' + esc(o.player) + "</button>";
      tr.innerHTML = '<td class="rk">' + (i + 1) + '</td><td class="nm">' + btn + '</td><td class="num">' + o.count + (total ? " / " + total : "") + "</td>";
      body.appendChild(tr);
      var detail = null, b = tr.querySelector("button");
      b.addEventListener("click", function () {
        if (detail) { detail.remove(); detail = null; b.setAttribute("aria-expanded", "false"); return; }
        var mine = found(o.player), keys = mine ? Object.keys(mine) : [];
        detail = document.createElement("tr"); detail.className = "en-detail";
        var td = document.createElement("td"); td.colSpan = 3;
        if (keys.length) {
          td.innerHTML = "<p>Tes fins trouvées sur cet appareil (" + keys.length + ") :</p><ul>" +
            keys.map(function (k) { return mine[k]; }).sort(function (a, b) { return String(a).localeCompare(String(b), "fr"); })
              .map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
        } else {
          td.innerHTML = "<p>Seul le joueur concerné peut voir ses fins, depuis l’appareil où il a joué.</p>";
        }
        detail.appendChild(td); tr.after(detail); b.setAttribute("aria-expanded", "true");
      });
    });
    box.appendChild(table);
    var n = document.createElement("p"); n.className = "note small"; n.textContent = list.length + " joueur" + (list.length > 1 ? "s" : "") + ". Un clic sur ton nom affiche tes fins.";
    box.appendChild(n);
  }

  window.Endings = { rank: rank, found: found, key: key, renderBoard: renderBoard };
})();
