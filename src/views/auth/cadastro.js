// src/views/usuario/cadastro.js
const formCadastro = document.querySelector(".auth-form");

formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = formCadastro.nome.value;
  const email = formCadastro.email.value;
  const senha = formCadastro.senha.value;

  try {
    const res = await fetch("/usuario/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

      if (res.ok) {
      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      alert("Cadastro realizado com sucesso!");
      window.location.href = "/ideia"; // Redireciona para lista de ideias
    } else {
      alert(data.message || "Erro ao cadastrar usuário.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar cadastrar.");
  }
});
