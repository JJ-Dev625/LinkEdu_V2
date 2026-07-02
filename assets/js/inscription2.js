document.addEventListener("DOMContentLoaded", () => {
  // === 1. VISIBILITÉ DU MOT DE PASSE ===
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
      eyeIcon.classList.toggle("fa-eye");
      eyeIcon.classList.toggle("fa-eye-slash");
    });
  }

  // === 2. SAUVEGARDE ET REDIRECTION ===
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Création de l'objet candidature avec les données du formulaire
      const nouvelleCandidature = {
        id: Date.now(), // ID unique basé sur le timestamp
        nom: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        telephone: document.getElementById("phone").value,
        role: document.getElementById("role").value,
        // Champs vides pour l'instant, à remplir dans les étapes suivantes (Tele.html)
        classe: "",
        img:
          "https://ui-avatars.com/api/?name=" +
          document.getElementById("fullname").value.split(" ")[0],
        statut: null, // null signifie "En attente de traitement par l'admin"
      };

      // Récupération des candidatures existantes et ajout
      let candidatures = JSON.parse(localStorage.getItem("candidatures")) || [];
      candidatures.push(nouvelleCandidature);
      localStorage.setItem("candidatures", JSON.stringify(candidatures));

      // Stockage de l'ID actuel pour que Tele.html sache quelle candidature compléter
      localStorage.setItem("currentCandidatureId", nouvelleCandidature.id);

      // Redirection vers la page de téléchargement des documents
      window.location.href = "Tele.html";
    });
  }

  // === 3. DIAPORAMA (Logique conservée) ===
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
      img.style.opacity = index === 0 ? "1" : "0";
      img.style.transition = "opacity 3.5s ease-in-out";
      slideshowContainer.appendChild(img);
    });

    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll("img");
      imgs[currentImageIndex].style.opacity = "0";
      currentImageIndex = (currentImageIndex + 1) % imagesList.length;
      imgs[currentImageIndex].style.opacity = "1";
    }, 10000);
  }
});
