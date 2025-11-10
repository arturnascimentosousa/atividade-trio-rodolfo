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
      alert("Cadastro realizado com sucesso! Faça login.");
      window.location.href = "/usuario/login";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar cadastrar.");
  }
});
