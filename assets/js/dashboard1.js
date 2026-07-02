document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // CONFIGURATION DU PROFIL ÉLÈVE POUR LE PAIEMENT
  // ==========================================
  localStorage.setItem("userStudyLevel", "Licence 2"); 
  localStorage.setItem("userMatricule", "LE-2026-0941");

  // Éléments de l'interface
  const banner = document.getElementById("promo-banner");
  const timerDisplay = document.getElementById("countdown-timer");
  const userRole = document.getElementById("user-status");
  const bannerBtn = document.querySelector(".banner-btn");
  
  // Boutons de simulation de la Démo
  const btnSimFree = document.getElementById("btn-sim-free");
  const btnSimLocked = document.getElementById("btn-sim-locked");

  const sectionsToLock = [
    { id: "sec-stats", text: "🔒 Contenu Verrouillé" },
    { id: "sec-downloads", text: "🔒 Documents indisponibles" },
    { id: "sec-schedule", text: "🔒 Emploi du temps indisponible" }
  ];

  // DATE CIBLE DE LA RENTRÉE : 28 Septembre 2026 à 00:00:00
  const targetDate = new Date("September 28, 2026 00:00:00").getTime();
  let countdownInterval = null;

  // ==========================================
  // A. ACTIONS VISUELLES (VERROU / ACCÈS TOTAL)
  // ==========================================
  function verrouillerDashboard() {
    if (timerDisplay) timerDisplay.textContent = "Expiré 🛑";
    if (banner) {
      banner.style.background = "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)";
      banner.style.borderColor = "#EF4444";
    }
    if (userRole) {
      userRole.textContent = "Élève • Accès Restreint";
      userRole.style.backgroundColor = "#FEE2E2";
      userRole.style.color = "#EF4444";
    }

    sectionsToLock.forEach(sec => {
      const element = document.getElementById(sec.id);
      if (element && !element.classList.contains("locked")) {
        element.classList.add("locked");
        
        const overlay = document.createElement("div");
        overlay.className = "locked-overlay";
        overlay.innerHTML = `<span>${sec.text}</span>`;
        element.appendChild(overlay);

        overlay.addEventListener("click", triggerAlertAnimation);
      }
    });
  }

  function appliquerAccesTotal(estInscrit = false) {
    if (banner) banner.style.display = estInscrit ? "none" : "flex";
    if (banner && !estInscrit) {
      banner.style.background = ""; 
      banner.style.borderColor = "";
    }
    
    if (userRole) {
      userRole.textContent = estInscrit ? "Élève • Trimestre 1 (Inscrit)" : "Élève • Statut : En attente";
      userRole.style.backgroundColor = estInscrit ? "#E6F7F0" : "#F3F4F6";
      userRole.style.color = estInscrit ? "#10B881" : "#6B7280";
    }

    sectionsToLock.forEach(sec => {
      const element = document.getElementById(sec.id);
      if (element) {
        element.classList.remove("locked");
        const overlay = element.querySelector(".locked-overlay");
        if (overlay) overlay.remove();
      }
    });
  }

  function triggerAlertAnimation(e) {
    e.preventDefault();
    if (bannerBtn) {
      bannerBtn.style.transform = "scale(1.15)";
      bannerBtn.style.backgroundColor = "#EF4444";
      bannerBtn.style.transition = "all 0.2s ease";
      setTimeout(() => {
        bannerBtn.style.transform = "";
        bannerBtn.style.backgroundColor = "";
      }, 500);
    }
  }

  // ==========================================
  // B. COMPTE À REBOURS RÉEL
  // ==========================================
  function initRealCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0 || localStorage.getItem("demoForceState") === "locked") {
        clearInterval(countdownInterval);
        verrouillerDashboard();
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (timerDisplay) {
          timerDisplay.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
        }
      }
    }, 1000);
  }

  // ==========================================
  // C. BOUTONS DE SIMULATION DE LA DÉMO
  // ==========================================
  btnSimFree.addEventListener("click", () => {
    localStorage.setItem("demoForceState", "free");
    localStorage.removeItem("statutReinscription"); 
    appliquerAccesTotal(false);
    initRealCountdown(); 
  });

  btnSimLocked.addEventListener("click", () => {
    localStorage.setItem("demoForceState", "locked");
    clearInterval(countdownInterval);
    verrouillerDashboard();
  });

  // ==========================================
  // D. INITIALISATION AU CHARGEMENT
  // ==========================================
  const currentSavedState = localStorage.getItem("demoForceState");
  const paiementValide = localStorage.getItem("statutReinscription");

  if (paiementValide === "valide") {
    appliquerAccesTotal(true);
  } else if (currentSavedState === "locked") {
    verrouillerDashboard();
  } else {
    appliquerAccesTotal(false);
    initRealCountdown();
  }
});
