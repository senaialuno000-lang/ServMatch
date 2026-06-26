const express = require("express");                                                                                           // importação do módulo express;
const router = express.Router();                                                                                              // criação de um roteador do express;
const UsuarioModel = require("../models/usuarioModel.js");                                                                    // importação do model de usuário;
const usuarioController = require("../controllers/usuarioController.js");                                                     // importação do controller de usuário;  
const { verificaAutenticacao, somenteContratante, somenteCandidato } = require("../middlewares/authmiddleware.js");           // Importar o middleware de autenticação;

/*===================================================================
.................. Declaração das rotas do usuário ..................           
===================================================================*/ 

// ROTAS PÚBLICAS
router.post("/login", usuarioController.login);                                                                               // Envia os dados de login;
router.get("/logout", usuarioController.logout);                                                                              // Envia os dados de logout;
router.post("/cadastrar", usuarioController.cadastrar);                                                                       // Envia os dados de cadastro;

// ROTAS PRIVADAS
router.use(verificaAutenticacao);                                                                                             // Aplica o middleware de autenticação para todas as rotas abaixo

// Candidato
router.get("/candidato", verificaAutenticacao, somenteCandidato,   usuarioController.paginaPrincipalCandidato);               // Rota para mostrar a página principal do candidato;

// Contratante
router.get("/contratante", verificaAutenticacao, somenteContratante, usuarioController.paginaContratante);                    // Rota para mostrar a página principal do contratante;
router.get("/vagasContratante", verificaAutenticacao, somenteContratante, usuarioController.vagasContratante);                // Rota para mostrar a página de vagas do contratante;
router.get("/criarVagasContratante", verificaAutenticacao, somenteContratante, usuarioController.criarVagasContratante);      // Rota para mostrar a página de criação de vagas do contratante;


module.exports = router;                                                                                                      // Exporta o roteador para ser usado em outros arquivos do projeto;