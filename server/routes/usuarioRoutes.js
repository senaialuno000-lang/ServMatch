// importação do módulo express
const express = require("express");
const router = express.Router();
const UsuarioModel = require("../models/usuarioModel.js")


// Importar o controller do usuario
const usuarioController = require("../controllers/usuarioController.js")

// Importar o middleware de autenticação
const { verificaAutenticacao, somenteContratante, somenteCandidato } = require("../middlewares/authmiddleware.js");


// Declaração das rotas do usuário
// ROTAS PÚBLICAS
// Envia os dados de login
router.post("/login", usuarioController.login)

// Rota de saida
router.get("/logout", usuarioController.logout)
router.post("/cadastrar", usuarioController.cadastrar); 

router.use(verificaAutenticacao) // Aplica a autenticação a todas as rotas abaixo

// if(UsuarioModel.perfil === "Contratante"){
//   router.use(somenteContratante) // Aplica a restrição de contratante a todas as rotas abaixo
// } else if (UsuarioModel.perfil === "Candidato") {
//   router.use(somenteCandidato) // Aplica a restrição de candidato a todas as rotas abaixo
// }

// CORRETO - aplica middleware por rota
router.get("/contratante", verificaAutenticacao, somenteContratante, usuarioController.paginaContratante)
router.get("/candidato",   verificaAutenticacao, somenteCandidato,   usuarioController.paginaPrincipalCandidato)

// ROTAS PRIVADAS

// Obtém a lista de usuários
router.get("/", usuarioController.paginaPrincipalCandidato);

//Retornar a página de cadastro
router.get("/cadastro", (req, res) => {
  res.status(200).render('usuarios/cadastrar');
});

router.get("/main", (req, res) => {
  res.json({ mensagem: "Estou na página main" });
});


module.exports = router