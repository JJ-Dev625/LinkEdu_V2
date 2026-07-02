document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DIAPORAMA D'ARRIÈRE-PLAN (10s)
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
      slideshowContainer.appendChild(img);
    });

    function startSlideshow() {
      setInterval(() => {
        const imgs = slideshowContainer.querySelectorAll("img");
        if (imgs.length === 0) return;
        imgs[currentImageIndex].style.opacity = "0";
        currentImageIndex = (currentImageIndex + 1) % imagesList.length;
        imgs[currentImageIndex].style.opacity = "1";
      }, 10000);
    }

    // Lancement du diaporama
    startSlideshow();
  }

  // ==========================================
  // 2. SÉLECTEURS ET DICTIONNAIRE
  // ==========================================
  const studyLevelSelect = document.getElementById("study-level");
  const prevClassSelect = document.getElementById("prev-class");
  const targetClassSelect = document.getElementById("target-class");
  const uploadForm = document.getElementById("upload-form");

  const classesData = {
    creche: ["Petite Section", "Moyenne Section", "Grande Section"],
    primaire: ["CONE", "CP", "CE1", "CE2", "CM1", "CM2"],
    secondaire: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
    superieur: [
      "Licence 1",
      "Licence 2",
      "Licence 3",
      "Master 1",
      "Master 2",
      "Doctorat",
    ],
  };

  // ==========================================
  // 3. LOGIQUE DYNAMIQUE DES OPTIONS
  // ==========================================
  if (studyLevelSelect) {
    studyLevelSelect.addEventListener("change", () => {
      const classesList = classesData[studyLevelSelect.value] || [];
      prevClassSelect.disabled = false;
      targetClassSelect.disabled = false;
      prevClassSelect.innerHTML =
        '<option value="" disabled selected>Classe</option>';
      targetClassSelect.innerHTML =
        '<option value="" disabled selected>Visée</option>';

      classesList.forEach((className) => {
        prevClassSelect.innerHTML += `<option value="${className}">${className}</option>`;
        targetClassSelect.innerHTML += `<option value="${className}">${className}</option>`;
      });
    });
  }

  // ==========================================
  // 4. SOUMISSION & LIEN AVEC ADMIN2.JS
  // ==========================================
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Récupération de l'ID de la candidature en cours
      const currentId = localStorage.getItem("currentCandidatureId");

      if (currentId) {
        let candidatures =
          JSON.parse(localStorage.getItem("candidatures")) || [];
        const index = candidatures.findIndex((c) => c.id == currentId);

        if (index !== -1) {
          // Mise à jour de l'objet candidature avec les infos de cette page
          candidatures[index].niveau = studyLevelSelect.value;
          candidatures[index].ecoleOrigine =
            document.getElementById("school-origin").value;
          candidatures[index].classePrecedente = prevClassSelect.value;
          candidatures[index].classeDemandee = targetClassSelect.value;
          candidatures[index].statut = null; // S'assure que c'est bien considéré comme "à traiter" par l'admin

          localStorage.setItem("candidatures", JSON.stringify(candidatures));
        }
      }

      // Stockage pour la page suivante et redirection
      localStorage.setItem("selectedStudyLevel", studyLevelSelect.value);
      window.location.href = "../pages/paiement.html";
    });
  }
});
