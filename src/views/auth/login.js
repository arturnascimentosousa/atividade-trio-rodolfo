const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = formLogin.email.value;
  const senha = formLogin.senha.value;

  try {
    const res = await fetch("/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // guarda JWT
      window.location.href = "/ideia"; // redireciona manualmente
    } else {
      alert(data.message); // mostra erro
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar logar.");
  }
});
