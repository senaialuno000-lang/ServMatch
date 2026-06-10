// importação do módulo express
const express = require("express");
const router = express.Router();

// Importar o controller do usuario
const usuarioController = require("../controllers/usuarioController.js")

// Declaração das rotas do usuário
// ROTAS PÚBLICAS
// Envia os dados de login
router.post("/login", usuarioController.login)

// Rota de saida
router.get("/logout", usuarioController.logout)
router.post("/cadastrar", usuarioController.cadastrar); 

// ROTAS PRIVADAS

// Obtém a lista de usuários
router.get("/", (req, res) => {
  res.json({ mensagem: "Peguei a lista de usuários" });
});

//Retornar a página de cadastro
router.get("/cadastro", (req, res) => {
  res.status(200).render('usuarios/cadastrar');
});

router.get("/main", (req, res) => {
  res.json({ mensagem: "Estou na página main" });
});


module.exports = router