const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = formLogin.email.value;
  const senha = formLogin.senha.value;

  try {
    const res = await fetch("/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // garante que cookies enviados pelo servidor sejam aceitos pelo browser
      credentials: 'same-origin',
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok) {
      // token também veio em cookie HTTP-only; guardamos em localStorage para chamadas API se desejar
      localStorage.setItem("token", data.token);
      // redireciona para o perfil do usuário
      window.location.href = "/profile";
    } else {
      alert(data.message); // mostra erro
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar logar.");
  }
});
