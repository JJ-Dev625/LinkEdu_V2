document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // CONFIGURATION DU PROFIL ÉLÈVE POUR LE PAIEMENT
  // ==========================================
  localStorage.setItem("userStudyLevel", "Licence 2"); 
  localStorage.setItem("userMatricule", "LE-2026-0941");

  // Éléments UI
  const banner = document.getElementById("promo-banner");
  const timerDisplay = document.getElementById("countdown-timer");
  const bannerBtn = document.querySelector(".banner-btn");
  const libraryGrid = document.getElementById("sec-library");
  
  // Boutons de simulation de la Démo
  const btnSimFree = document.getElementById("btn-sim-free");
  const btnSimLocked = document.getElementById("btn-sim-locked");

  // Filtres d'onglets
  const filterButtons = document.querySelectorAll(".filter-btn");
  const courseCards = document.querySelectorAll(".course-card");

  // DATE DE RENTRÉE (IDENTIQUE AU DASHBOARD)
  const targetDate = new Date("September 28, 2026 00:00:00").getTime();
  let countdownInterval = null;

  // ==========================================
  // 1. LOGIQUE DE FILTRAGE DES COURS
  // ==========================================
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      courseCards.forEach(card => {
        if (filterValue === "all" || card.getAttribute("data-type") === filterValue) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================
  // 2. LOGIQUE DE SÉCURITÉ ET RESTRICTION
  // ==========================================
  function verrouillerBibliotheque() {
    if (timerDisplay) timerDisplay.textContent = "Expiré 🛑";
    if (banner) {
      banner.style.background = "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)";
      banner.style.borderColor = "#EF4444";
    }

    if (libraryGrid && !libraryGrid.classList.contains("locked")) {
      libraryGrid.classList.add("locked");
      
      const overlay = document.createElement("div");
      overlay.className = "locked-overlay";
      overlay.innerHTML = `<span>🔒 Médiathèque verrouillée. Régularisez vos frais.</span>`;
      libraryGrid.appendChild(overlay);

      overlay.addEventListener("click", triggerAlertAnimation);
    }
  }

  function débloquerBibliotheque(estInscrit = false) {
    if (banner) banner.style.display = estInscrit ? "none" : "flex";
    if (banner && !estInscrit) {
      banner.style.background = ""; 
      banner.style.borderColor = "";
    }

    if (libraryGrid) {
      libraryGrid.classList.remove("locked");
      const overlay = libraryGrid.querySelector(".locked-overlay");
      if (overlay) overlay.remove();
    }
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
  // 3. COMPTE À REBOURS ET INTERCONNEXION STORAGE
  // ==========================================
  function initRealCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0 || localStorage.getItem("demoForceState") === "locked") {
        clearInterval(countdownInterval);
        verrouillerBibliotheque();
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

  // Événements boutons démo du jury
  btnSimFree.addEventListener("click", () => {
    localStorage.setItem("demoForceState", "free");
    localStorage.removeItem("statutReinscription");
    débloquerBibliotheque(false);
    initRealCountdown();
  });

  btnSimLocked.addEventListener("click", () => {
    localStorage.setItem("demoForceState", "locked");
    clearInterval(countdownInterval);
    verrouillerBibliotheque();
  });

  // Analyse du statut au chargement
  const currentSavedState = localStorage.getItem("demoForceState");
  const paiementValide = localStorage.getItem("statutReinscription");

  if (paiementValide === "valide") {
    débloquerBibliotheque(true);
  } else if (currentSavedState === "locked") {
    verrouillerBibliotheque();
  } else {
    débloquerBibliotheque(false);
    initRealCountdown();
  }
});
