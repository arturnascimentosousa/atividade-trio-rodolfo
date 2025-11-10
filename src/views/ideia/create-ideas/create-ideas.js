document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createIdeaForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const formData = {
        titulo: form.titulo.value.trim(),
        detalhes: form.detalhes.value.trim(),
        fk_categoria: parseInt(form.fk_categoria.value)
      };

      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/ideia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(formData),
        credentials: 'same-origin'
      });

      const data = await response.json();

      if (response.ok) {
        successMessage.style.display = "block";
        successMessage.textContent = "Ideia criada com sucesso!";
        
        form.reset();
        
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      } else {
        throw new Error(data.erro || "Erro ao criar ideia");
      }
    } catch (err) {
      alert(err.message || "Erro ao criar ideia. Tente novamente.");
      console.error("Erro:", err);
    }
  });
});
