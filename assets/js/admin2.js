document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector(".content");
  const sidebar = document.getElementById("sidebar");

  // --- MOTEUR DE VUES ---
  const render = (view) => {
    const candidatures = JSON.parse(localStorage.getItem("candidatures")) || [];
    const enseignants = JSON.parse(localStorage.getItem("enseignants")) || [];

    mainContent.innerHTML = "";

    // DASHBOARD
    if (view === "dashboard") {
      mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>Tableau de bord</h3>
                    <div class="stats-container">
                        <div class="stat-box"><h4>${candidatures.length}</h4><p>Total</p></div>
                        <div class="stat-box"><h4>${candidatures.filter((c) => c.statut === "Validé").length}</h4><p>Inscrits</p></div>
                        <div class="stat-box"><h4>${enseignants.length}</h4><p>Enseignants</p></div>
                    </div>
                </div>`;
    }
    // CANDIDATURES
    else if (["traitement", "valides", "refuses"].includes(view)) {
      const title =
        view === "traitement"
          ? "Dossiers en attente"
          : view === "valides"
            ? "Inscrits"
            : "Refusés";
      const list =
        view === "traitement"
          ? candidatures.filter((c) => !c.statut)
          : view === "valides"
            ? candidatures.filter((c) => c.statut === "Validé")
            : candidatures.filter((c) => c.statut === "Refusé");

      mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>${title} (${list.length})</h3>
                    <table>
                        <thead><tr><th>Élève</th><th>Classe</th><th>Actions</th></tr></thead>
                        <tbody>${
                          list
                            .map(
                              (c) => `<tr>
                            <td>${c.nom} ${c.prénom}</td>
                            <td>${c.classeDemandee}</td>
                            <td>${
                              view === "traitement"
                                ? `
                                <button class="btn-action" onclick="voirDetails(${c.id})">Info</button>
                                <button class="btn-action btn-valider" onclick="validerDossier(${c.id})">Valider</button>
                                <button class="btn-action btn-refuser" onclick="refuserDossier(${c.id})">Refuser</button>`
                                : view === "valides"
                                  ? `<span style="font-family:monospace;">${c.matricule}</span> 
                                <button class="btn-action" onclick="envoyerConfirmation(${c.id})"><i class="fa-brands fa-whatsapp"></i></button>`
                                  : `<span>${c.motifRefus || "Refusé"}</span>`
                            }
                            </td>
                        </tr>`,
                            )
                            .join("") ||
                          '<tr><td colspan="3" style="text-align:center">Aucun dossier</td></tr>'
                        }</tbody>
                    </table>
                </div>`;
    }
    // ENSEIGNANTS
    else if (view === "enseignants") {
      mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>Corps Enseignant</h3>
                    <button class="btn-action" style="margin-bottom:15px; background:var(--primary-vert)" onclick="gererEnseignant()">+ Ajouter Enseignant</button>
                    <table>
                        <thead><tr><th>Nom</th><th>Matière</th><th>Classes</th><th>Actions</th></tr></thead>
                        <tbody>${enseignants
                          .map(
                            (e) => `<tr>
                            <td>${e.nom}</td><td>${e.matiere}</td><td>${e.classes}</td>
                            <td>
                                <button class="btn-action" onclick="gererEnseignant(${e.id})">Modifier</button>
                                <button class="btn-action" style="background:#ef4444" onclick="supprimerEnseignant(${e.id})">X</button>
                            </td>
                        </tr>`,
                          )
                          .join("")}</tbody>
                    </table>
                </div>`;
    }
  };

  // --- LOGIQUE ACTIONS ---
  window.validerDossier = (id) => {
    let list = JSON.parse(localStorage.getItem("candidatures"));
    const idx = list.findIndex((c) => c.id == id);
    list[idx].statut = "Validé";
    list[idx].matricule = `LE-2026-${String(list[idx].id).padStart(3, "0")}`;
    localStorage.setItem("candidatures", JSON.stringify(list));
    render("traitement");
  };

  window.refuserDossier = (id) => {
    const motif = prompt("Motif du refus :");
    if (motif) {
      let list = JSON.parse(localStorage.getItem("candidatures"));
      const idx = list.findIndex((c) => c.id == id);
      list[idx].statut = "Refusé";
      list[idx].motifRefus = motif;
      localStorage.setItem("candidatures", JSON.stringify(list));
      render("traitement");
    }
  };

  window.gererEnseignant = (id = null) => {
    let ens = JSON.parse(localStorage.getItem("enseignants")) || [];
    let item = id
      ? ens.find((x) => x.id === id)
      : { id: Date.now(), nom: "", matiere: "", classes: "" };
    const nom = prompt("Nom de l'enseignant :", item.nom);
    const matiere = prompt("Matière :", item.matiere);
    const classes = prompt("Classes (ex: 6e A, 5e B) :", item.classes);
    if (nom && matiere && classes) {
      if (id) {
        const idx = ens.findIndex((x) => x.id === id);
        ens[idx] = { id, nom, matiere, classes };
      } else {
        ens.push({ id: Date.now(), nom, matiere, classes });
      }
      localStorage.setItem("enseignants", JSON.stringify(ens));
      render("enseignants");
    }
  };

  window.supprimerEnseignant = (id) => {
    if (confirm("Supprimer cet enseignant ?")) {
      let ens = JSON.parse(localStorage.getItem("enseignants")).filter(
        (x) => x.id !== id,
      );
      localStorage.setItem("enseignants", JSON.stringify(ens));
      render("enseignants");
    }
  };

  window.envoyerConfirmation = (id) => {
    const c = JSON.parse(localStorage.getItem("candidatures")).find(
      (x) => x.id == id,
    );
    window.open(
      `https://wa.me/${c.telephone.replace(/\s+/g, "")}?text=${encodeURIComponent("Bonjour, votre inscription est validée. Matricule: " + c.matricule)}`,
      "_blank",
    );
  };

  window.voirDetails = (id) => {
    const c = JSON.parse(localStorage.getItem("candidatures")).find(
      (x) => x.id == id,
    );
    alert(
      `Dossier : ${c.nom} ${c.prénom}\nNiveau : ${c.niveau}\nTel : ${c.telephone}`,
    );
  };

  // --- NAVIGATION ---
  document.addEventListener("click", (e) => {
    const item = e.target.closest("li[data-target]");
    if (item) render(item.dataset.target);
    if (e.target.closest("#burger-menu")) sidebar.classList.toggle("active");
    if (item && window.innerWidth <= 768) sidebar.classList.remove("active");
  });

  render("dashboard");
});
