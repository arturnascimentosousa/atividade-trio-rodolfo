const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const { Ideia, Usuario, Categoria, Voto } = require('../../public/models');
const ideiaController = require('../../public/controllers/ideiaController');

async function setupCategorias() {
  const categorias = [
    { id: 1, nome: 'Inovação e Tecnologia' },
    { id: 2, nome: 'Melhoria de Processos' },
    { id: 3, nome: 'Redução de Custos' },
    { id: 4, nome: 'Novos Produtos ou Serviços' },
    { id: 5, nome: 'Sustentabilidade' },
    { id: 6, nome: 'Experiência do Cliente' },
    { id: 7, nome: 'Cultura e Engajamento' },
    { id: 8, nome: 'Eficiência Operacional' },
    { id: 9, nome: 'Transformação Digital' },
    { id: 10, nome: 'Impacto Social' }
  ];

  await Categoria.bulkCreate(categorias, {
    updateOnDuplicate: ['nome']
  });
}

function isLoggedIn(req, res, next) {
  // Usuário já foi carregado pelo userMiddleware
  if (!req.user) {
    return res.redirect('/login');
  }
  return next();
}


router.get("/", (req, res) => {
  return res.redirect("/ideia");
});

router.get("/login", (req, res) => {
  // Se já estiver logado, redireciona para ideias
  if (req.user) {
    return res.redirect('/ideia');
  }
  
  res.render("auth/login", { 
    layout: "main", 
    title: "Login",
    auth: true // para carregar auth.css
  });
});

router.post("/login", (req, res) => {
  // Esta rota de POST é usada apenas para renderização tradicional;
  // O fluxo principal de login via API está em /usuario/login
  res.redirect("/ideia");
});

router.get("/cadastro", (req, res) => {
  // Se já estiver logado, redireciona para ideias
  if (req.user) {
    return res.redirect('/ideia');
  }

  res.render("auth/cadastro", { 
    layout: "main", 
    title: "Cadastro",
    auth: true // para carregar auth.css
  });
});

router.post("/cadastro", (req, res) => {
  console.log("POST /cadastro body:", req.body);
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  // limpa cookie de autenticação
  res.clearCookie && res.clearCookie('token');
  // também pode remover localStorage via client-side se necessário
  res.redirect('/login');
});


// Middleware para tentar pegar usuário do token sem bloquear acesso
function tryGetUser(req, res, next) {
  try {
    const tokenFromCookie = req.cookies && req.cookies.token;
    const authHeader = req.headers && req.headers.authorization;
    let token = null;

    if (tokenFromCookie) token = tokenFromCookie;
    else if (authHeader) {
      const parts = authHeader.split(' ');
      token = parts.length === 2 ? parts[1] : null;
    }

    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.locals.user = { id: decoded.id, email: decoded.email };
    }
    next();
  } catch (err) {
    // Se token inválido, apenas continua sem user
    next();
  }
}

// Função para garantir que as categorias existam
async function setupCategorias() {
  const { Categoria } = require('../../public/models');
  
  const categoriasBase = [
    "Tecnologia",
    "Educação",
    "Saúde",
    "Meio Ambiente",
    "Empreendedorismo",
    "Social"
  ];

  try {
    // Para cada categoria base
    for (const nome of categoriasBase) {
      // Verifica se já existe
      const existe = await Categoria.findOne({ where: { nome } });
      
      // Se não existe, cria
      if (!existe) {
        await Categoria.create({ nome });
        console.log(`Categoria '${nome}' criada.`);
      }
    }
    
    console.log('Setup de categorias concluído.');
  } catch (err) {
    console.error('Erro no setup de categorias:', err);
  }
}

// Chamar setup de categorias ao iniciar o servidor
setupCategorias();

router.get("/ideia", async (req, res) => {
  const { Ideia, Usuario, Categoria } = require('../../public/models');
  
  try {
    const ideias = await Ideia.findAll({
      include: [
        { 
          model: Usuario, 
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ],
      order: [['id', 'DESC']]
    });

    res.render("ideia/list-ideas/list-ideas", {
      layout: "main",
      title: "Ideias",
      ideias: ideias.map(i => i.get({ plain: true }))
    });
  } catch (err) {
    console.error('Erro ao listar ideias:', err);
    res.render("error/error", {
      layout: "main",
      title: "Erro",
      message: "Erro ao carregar lista de ideias."
    });
  }
});


router.get("/ideia/new", isLoggedIn, async (req, res) => {
  try {
    const { Categoria } = require('../../public/models');
    
    // Buscar todas as categorias para o select
    const categorias = await Categoria.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']]
    });

    console.log('Categorias carregadas:', categorias.length);
    if (categorias.length === 0) {
      // Se não há categorias, tenta fazer o setup novamente
      await setupCategorias();
      // Tenta carregar novamente
      const categoriasRetry = await Categoria.findAll({
        attributes: ['id', 'nome'],
        order: [['nome', 'ASC']]
      });
      console.log('Categorias após retry:', categoriasRetry.length);
      categorias = categoriasRetry;
    }

    // Log das categorias
    console.log('Categorias:', categorias.map(c => ({id: c.id, nome: c.nome})));

    res.render("ideia/create-ideas/create-ideas", { 
      layout: "main", 
      title: "Nova Ideia", 
      user: res.locals.user || null,
      categorias: categorias.map(c => c.get({ plain: true }))
    });
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
    res.render("error/error", {
      layout: "main",
      title: "Erro",
      message: `Erro ao carregar formulário de nova ideia: ${err.message}`
    });
  }
});


router.post("/api/ideia", isLoggedIn, async (req, res) => {
  try {
    const { Ideia, Categoria } = require('../../public/models');
    const { titulo, detalhes, fk_categoria } = req.body;

    // Validações
    if (!titulo || !fk_categoria) {
      return res.status(400).json({
        erro: 'Campos obrigatórios ausentes',
        detalhes: 'Título e categoria são obrigatórios.'
      });
    }

    // Verificar se categoria existe
    const categoria = await Categoria.findByPk(fk_categoria);
    if (!categoria) {
      return res.status(400).json({
        erro: 'Categoria inválida',
        detalhes: `Categoria com ID ${fk_categoria} não existe.`
      });
    }

    // Criar ideia
    const ideia = await Ideia.create({
      titulo,
      detalhes,
      fk_categoria,
      fk_usuario_criador: res.locals.user.id
    });

    res.status(201).json({
      mensagem: 'Ideia criada com sucesso',
      ideia
    });
  } catch (err) {
    console.error('Erro ao criar ideia:', err);
    res.status(500).json({
      erro: 'Erro interno ao criar ideia',
      detalhes: err.message
    });
  }
});


// Rota para votar em uma ideia
router.post("/ideia/:id/votar", isLoggedIn, async (req, res) => {
  try {
    const { Ideia, Voto } = require('../../public/models');
    const ideiaId = req.params.id;
    const userId = res.locals.user.id;

    // Verificar se a ideia existe
    const ideia = await Ideia.findByPk(ideiaId);
    if (!ideia) {
      return res.status(404).json({
        erro: 'Ideia não encontrada'
      });
    }

    // Verificar se já votou
    const votoExistente = await Voto.findOne({
      where: {
        fk_ideia: ideiaId,
        fk_user: userId
      }
    });

    if (votoExistente) {
      // Remove o voto
      await votoExistente.destroy();
    } else {
      // Cria novo voto
      await Voto.create({
        fk_ideia: ideiaId,
        fk_user: userId
      });
    }

    // Retorna contagem atualizada
    const votoCount = await Voto.count({
      where: { fk_ideia: ideiaId }
    });

    res.json({
      mensagem: votoExistente ? 'Voto removido' : 'Voto registrado',
      userVoted: !votoExistente,
      votoCount
    });

  } catch (err) {
    console.error('Erro ao processar voto:', err);
    res.status(500).json({
      erro: 'Erro ao processar voto',
      detalhes: err.message
    });
  }
});

router.get("/ideia/:id", async (req, res) => {
  try {
    const { Ideia, Usuario, Categoria, Voto } = require('../../public/models');
    const ideiaId = req.params.id;

    const ideia = await Ideia.findOne({
      where: { id: ideiaId },
      include: [
        { 
          model: Usuario, 
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!ideia) {
      return res.render("error/error", {
        layout: "main",
        title: "Erro",
        message: "Ideia não encontrada"
      });
    }

    // Buscar quantidade de votos
    const votoCount = await Voto.count({
      where: { fk_ideia: ideiaId }
    });

    // Verificar se o usuário atual já votou
    let userVoted = false;
    if (res.locals.user) {
      const voto = await Voto.findOne({
        where: {
          fk_ideia: ideiaId,
          fk_user: res.locals.user.id
        }
      });
      userVoted = !!voto;
    }

    // Converter para objeto plano e adicionar informações de voto
    const ideiaPlain = ideia.get({ plain: true });
    ideiaPlain.votoCount = votoCount;
    ideiaPlain.userVoted = userVoted;

    res.render("ideia/show-ideas/show-ideas", {
      layout: "main",
      title: ideiaPlain.titulo,
      ideia: ideiaPlain,
      user: res.locals.user || null
    });
  } catch (err) {
    console.error('Erro ao buscar ideia:', err);
    res.render("error/error", {
      layout: "main",
      title: "Erro",
      message: "Erro ao carregar detalhes da ideia"
    });
  }
});

router.get("/ideia/:id/edit", isLoggedIn, async (req, res) => {
  const ideaId = req.params.id;

  try {
    // Buscar todas as categorias para o select
    let categorias = await Categoria.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']]
    });

    if (categorias.length === 0) {
      // Se não há categorias, tenta fazer o setup novamente
      await setupCategorias();
      // Tenta carregar novamente
      categorias = await Categoria.findAll({
        attributes: ['id', 'nome'],
        order: [['nome', 'ASC']]
      });
    }

    // Buscar a ideia
    const ideia = await Ideia.findOne({
      where: { 
        id: ideaId,
        fk_usuario_criador: res.locals.user.id // Garante que o usuário é o criador
      }
    });

    if (!ideia) {
      return res.status(404).render("error/error", {
        layout: "main",
        title: "Erro",
        message: "Ideia não encontrada ou você não tem permissão para editá-la"
      });
    }

    console.log('Categorias carregadas:', categorias);
    res.render("ideia/edit-ideas/edit-ideas", {
      layout: "main",
      title: `Editar - ${ideia.titulo}`,
      idea: ideia,
      user: res.locals.user || null,
      categorias: categorias.map(c => c.get({ plain: true }))
    });
  } catch (error) {
    console.error('Erro ao carregar formulário de edição:', error);
    res.status(500).send('Erro ao carregar formulário de edição.');
  }
});


router.post("/ideia/atualizar/:id", isLoggedIn, async (req, res) => {
  try {
    // Passa o user do middleware para o controller
    req.user = res.locals.user;
    req.params.id = req.params.id; // Garantir que o id está disponível para o controller
    
    // Define o header de Content-Type como JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Usa o controller para atualizar a ideia
    return await ideiaController.atualizar(req, res);
  } catch (error) {
    console.error('Erro ao atualizar ideia:', error);
    return res.status(500).json({
      erro: 'Erro interno ao atualizar ideia',
      detalhes: error.message
    });
  }
});


router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    // Importa modelos já inicializados com associações
    const { Usuario, Ideia } = require('../../public/models');

    // Busca usuário com suas ideias
    const userFromDb = await Usuario.findOne({
      where: { id: res.locals.user.id },
      include: [{
        model: Ideia,
        as: 'ideias',
        attributes: ['id', 'titulo', 'detalhes']
      }]
    });

    if (!userFromDb) {
      return res.redirect('/login');
    }

    // Prepara dados para a view
    const user = {
      id: userFromDb.id,
      email: userFromDb.email,
      nome: userFromDb.nome
    };

    const userIdeas = userFromDb.ideias.map(ideia => ({
      id: ideia.id,
      title: ideia.titulo,
      description: ideia.detalhes
    }));

    res.render("profile/index", {
      layout: "main",
      title: "Meu Perfil",
      user,
      userIdeas
    });
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    res.status(500).render('error/error', {
      layout: 'main',
      title: 'Erro',
      message: 'Erro ao carregar perfil. Tente novamente.'
    });
  }
});

module.exports = router;

