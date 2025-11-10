const express = require("express");const router = express.Router();

function isLoggedIn(req, res, next) {

}


router.get("/", (req, res) => {
  return res.redirect("/ideia");
});

router.get("/login", (req, res) => {
  res.render("usuario/login", { layout: "main", title: "Login" });
});

router.post("/login", (req, res) => {

  console.log("POST /login body:", req.body);
  res.redirect("/ideia");
});

router.get("/cadastro", (req, res) => {
  res.render("usuario/cadastro", { layout: "main", title: "Cadastro" });
});

router.post("/cadastro", (req, res) => {
  console.log("POST /cadastro body:", req.body);
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  res.redirect("/login");
});


router.get("/ideia", async (req, res) => {

  res.render("ideia/list-ideas/list-ideas", {
    layout: "main",
    title: "Ideias",
    user: res.locals.user || null
  });
});


router.get("/ideia/new", isLoggedIn, (req, res) => {
  res.render("ideia/create-ideas/create-ideas", { layout: "main", title: "Nova Ideia", user: res.locals.user || null });
});


router.post("/ideia", isLoggedIn, (req, res) => {
  console.log("POST /ideia", req.body);
  res.redirect("/ideia");
});


router.get("/ideia/:id", async (req, res) => {
  const ideaId = req.params.id;
  const idea = {
    _id: ideaId,
    title: `Ideia ${ideaId}`,
    description: "Descrição de exemplo",
    category: "Geral",
    votesCount: 0,
    author: { _id: "u1", name: "Autor Exemplo" },
    authorId: "u1"
  };

  res.render("ideia/show-ideas/show-ideas", {
    layout: "main",
    title: idea.title,
    idea,
    user: res.locals.user || null
  });
});

router.get("/ideia/:id/edit", isLoggedIn, async (req, res) => {
  const ideaId = req.params.id;
  const idea = {
    _id: ideaId,
    title: `Ideia ${ideaId}`,
    description: "Descrição de exemplo",
    category: "Geral",
  };

  res.render("ideia/edit-ideas/edit", {
    layout: "main",
    title: `Editar - ${idea.title}`,
    idea,
    user: res.locals.user || null
  });
});


router.put("/ideia/:id", isLoggedIn, (req, res) => {
  const ideaId = req.params.id;

  console.log("PUT /ideia/:id", ideaId, req.body);
  res.redirect(`/ideia/${ideaId}`);
});


router.get("/profile", isLoggedIn, (req, res) => {
  const user = res.locals.user || { _id: "u1", name: "Matheus (demo)", email: "matheus@example.com" };
  const userIdeas = [
    { _id: "1", title: "Minha ideia 1" },
    { _id: "3", title: "Minha ideia 2" }
  ];

  res.render("profile/index", {
    layout: "main",
    title: "Meu Perfil",
    user,
    userIdeas
  });
});

module.exports = router;

