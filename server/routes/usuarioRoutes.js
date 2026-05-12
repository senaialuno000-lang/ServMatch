const express = require("express"); // Importação do módulo express;
const router = express.Router(); // Cria um roteador para definir as rotas relacionadas aos usuários

// Obtém a lista de usuários e define as rotas para usuários;
router.get("/", (req, res) => {
    res.json({"mensagem": "Peguei a lista de usuários"}); // Responde com um objeto JSON contendo uma mensagem;
});

// Retorna a página de cadastro de usuários;
router.get("/cadastro", (req, res) => {
    res.json({"mensagem": "Página de cadastro de usuários"});
});

module.exports = router; // Exporta o roteador para ser utilizado em outros arquivos, como o server.js