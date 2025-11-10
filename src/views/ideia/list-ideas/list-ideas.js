// list-ideas.js
document.addEventListener("DOMContentLoaded", async () => {
  const ideasContainer = document.querySelector(".ideas-grid") || document.createElement("div");
  ideasContainer.className = "ideas-grid";

  try {
    const token = localStorage.getItem("token"); // pega o token JWT
    if (!token) throw new Error("Token não fornecido.");

    const res = await fetch("/ideia/listar", {
      headers: { "Authorization": token }
    });

    if (!res.ok) {
      throw new Error(`Erro ao listar ideias: ${res.status}`);
    }

    const ideias = await res.json();

    if (ideias.length === 0) {
      document.querySelector(".ideas-container").innerHTML += `
        <p class="no-ideas">Você ainda não enviou nenhuma ideia 😅</p>
        <a href="/ideia/new" class="create-idea-btn">+ Criar nova ideia</a>
      `;
      return;
    }

    ideias.forEach(idea => {
      const card = document.createElement("div");
      card.className = "idea-card";
      card.innerHTML = `
        <h2>${idea.titulo}</h2>
        <p class="idea-desc">${idea.detalhes || ""}</p>
        <div class="idea-footer">
          <span class="idea-author">Por ${idea.criador.nome}</span>
          <a href="/ideia/detalhar/${idea.id}" class="idea-btn">Ver detalhes</a>
        </div>
      `;
      ideasContainer.appendChild(card);
    });

    document.querySelector(".ideas-container").appendChild(ideasContainer);

  } catch (err) {
    console.error(err);
    document.querySelector(".ideas-container").innerHTML += `<p class="error">Erro ao carregar ideias.</p>`;
  }
});
