const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = formLogin.email.value;
  const senha = formLogin.senha.value;

  try {
    const res = await fetch("/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'same-origin',
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/profile";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar logar.");
  }
});
