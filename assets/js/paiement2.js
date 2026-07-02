document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DIAPORAMA D'ARRIÈRE-PLAN
  // ==========================================
  const slideshowContainer = document.getElementById("app-slideshow");
  const imagesList = [
    "../images/etu1.jpg",
    "../images/etu2.jpg",
    "../images/el1.jpg",
    "../images/el2.jpg",
    "../images/ens.jpg",
    "../images/pri1.jpg",
  ];

  if (slideshowContainer) {
    let currentImageIndex = 0;
    imagesList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      img.style.opacity = index === 0 ? "1" : "0";
      img.style.transition = "opacity 3.5s ease-in-out";
      img.style.zIndex = "-2";
      img.style.display = "block";
      slideshowContainer.appendChild(img);
    });

    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll("img");
      if (imgs.length === 0) return;
      imgs[currentImageIndex].style.opacity = "0";
      currentImageIndex = (currentImageIndex + 1) % imagesList.length;
      imgs[currentImageIndex].style.opacity = "1";
    }, 10000);
  }

  // ==========================================
  // 2. TARIFS & RÉCAPITULATIF
  // ==========================================
  const scolariteLabel = document.getElementById("scolarite-label");
  const scolaritePrice = document.getElementById("scolarite-price");
  const totalPrice = document.getElementById("total-price");
  const pricingPlan = {
    creche: { label: "Frais de scolarité (Crèche)", amount: "10 000 FCFA" },
    primaire: { label: "Frais de scolarité (Primaire)", amount: "15 000 FCFA" },
    secondaire: {
      label: "Frais de scolarité (Collège / Lycée)",
      amount: "25 000 FCFA",
    },
    superieur: {
      label: "Frais de scolarité (Supérieur)",
      amount: "50 000 FCFA",
    },
  };

  const savedLevel = localStorage.getItem("selectedStudyLevel") || "secondaire";
  if (pricingPlan[savedLevel]) {
    if (scolariteLabel)
      scolariteLabel.textContent = pricingPlan[savedLevel].label;
    if (scolaritePrice)
      scolaritePrice.textContent = pricingPlan[savedLevel].amount;
    if (totalPrice) totalPrice.textContent = pricingPlan[savedLevel].amount;
  }

  // ==========================================
  // 3. GESTION FORMULAIRE & PAIEMENT
  // ==========================================
  const paymentForm = document.getElementById("payment-form");
  const modalContainer = document.getElementById("payment-modal");
  const modalStatus = document.getElementById("modal-status");
  const pinForm = document.getElementById("pin-form");
  const pinInput = document.getElementById("pin-input");

  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      modalContainer.classList.remove("hidden");
      pinForm.style.display = "none";
      modalStatus.innerHTML = `<div class="spinner"></div><h3 style="color: #1F3962; font-weight: 700; font-size: 14px;">Initialisation...</h3>`;

      setTimeout(() => {
        modalStatus.innerHTML = `<h3 style="color: #1F3962; font-weight: 800; font-size: 16px;">Autorisation Requise</h3>
                                 <p style="font-size: 12px; margin-bottom: 8px;">Entrez votre code PIN à 4 chiffres :</p>`;
        pinForm.style.display = "flex";
      }, 2500);
    });
  }

  // ==========================================
  // 4. VALIDATION PIN & SYNC ADMIN (Lien vers admin2.js)
  // ==========================================
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      pinForm.style.display = "none";
      modalStatus.innerHTML = `<div class="spinner"></div><h3 style="color: #1F3962; font-weight: 700;">Traitement...</h3>`;

      setTimeout(() => {
        // --- MISE À JOUR DU STATUT POUR L'ADMIN ---
        const currentId = localStorage.getItem("currentCandidatureId");
        if (currentId) {
          let candidatures =
            JSON.parse(localStorage.getItem("candidatures")) || [];
          const index = candidatures.findIndex((c) => c.id == currentId);
          if (index !== -1) {
            candidatures[index].statut = "Validé"; // L'élève est maintenant officiellement inscrit
            localStorage.setItem("candidatures", JSON.stringify(candidatures));
          }
        }
        // ------------------------------------------

        modalStatus.innerHTML = `<div class="success-icon">✓</div><h3>Paiement Réussi !</h3>`;
        setTimeout(() => {
          window.location.href = "./dashboard1.html";
        }, 2000);
      }, 3000);
    });
  }

  document
    .getElementById("cancel-btn")
    ?.addEventListener("click", () => modalContainer.classList.add("hidden"));
});
