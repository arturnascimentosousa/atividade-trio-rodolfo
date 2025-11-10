// navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      const confirmLogout = confirm("Tem certeza que deseja sair?");
      if (!confirmLogout) e.preventDefault();
    });
  }

  console.log("Navbar carregada com sucesso!");
});
