document.addEventListener("DOMContentLoaded", () => {
  // --- 1. GESTION DU SÉLECTEUR DE PROFIL ---
  let selectedRole = "eleve";

  window.selectRole = (element) => {
    // Retirer la classe active
    document
      .querySelectorAll(".profile-card")
      .forEach((el) => el.classList.remove("active"));
    // Ajouter la classe active au bouton cliqué
    element.classList.add("active");

    // Mettre à jour le rôle
    selectedRole = element.getAttribute("data-role");

    // Mise à jour dynamique du placeholder
    const input = document.getElementById("identifier");
    const placeholders = {
      eleve: "Ex: LE-2026-045",
      enseignant: "Ex: ENS-2026-001",
      parent: "Email ou ID Parent",
      admin: "Identifiant administrateur",
    };
    if (input) input.placeholder = placeholders[selectedRole] || "Identifiant";
  };

  // --- 2. VISIBILITÉ DU MOT DE PASSE ---
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      // Basculer les classes FontAwesome
      eyeIcon.className = isPassword
        ? "toggle-password fa fa-eye-slash"
        : "toggle-password fa fa-eye";
    });
  }

  // --- 3. SOUMISSION DU FORMULAIRE ---
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const identifierValue = document
        .getElementById("identifier")
        .value.trim();

      if (!identifierValue) {
        alert("Veuillez entrer votre identifiant.");
        return;
      }

      localStorage.setItem("username", identifierValue);
      localStorage.setItem("userRole", selectedRole);

      const routes = {
        admin: "./assets/pages/admin2.html",
        enseignant: "./assets/pages/prof.html",
        parent: "./assets/pages/parent.html",
        eleve: "./assets/pages/dashboard1.html",
      };

      window.location.href = routes[selectedRole] || "../../index.html";
    });
  }

  // --- 4. DIAPORAMA D'ARRIÈRE-PLAN ---
  const slideshowContainer = document.getElementById("app-slideshow");
  const imagesList = [
    "./assets/images/etu1.jpg",
    "./assets/images/etu2.jpg",
    "./assets/images/el1.jpg",
    "./assets/images/el2.jpg",
    "./assets/images/ens.jpg",
    "./assets/images/pri1.jpg",
  ];

  if (slideshowContainer) {
    let currentImageIndex = 0;

    imagesList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "bg-slide";
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.opacity = index === 0 ? "1" : "0";
      img.style.transition = "opacity 1.5s ease-in-out";
      img.style.zIndex = "-2";
      slideshowContainer.appendChild(img);
    });

    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll(".bg-slide");
      if (imgs.length > 0) {
        imgs[currentImageIndex].style.opacity = "0";
        currentImageIndex = (currentImageIndex + 1) % imgs.length;
        imgs[currentImageIndex].style.opacity = "1";
      }
    }, 5000);
  }
});
