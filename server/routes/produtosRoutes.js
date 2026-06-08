const express = require("express");                                                                                                         // Importa o módulo express
const router = express.Router();                                                                                                            // Cria uma instância do router do express


router.get("/meus-produtos", (req, res) => {res.status(404).render("erro", {mensagem: "Essa pagina ainda não existe"})});                  // Define rota GET para "/meus-produtos" que retorna erro 404 com página não existe
router.get("/vitrine", (req, res) => {res.status(404).render("erro", {mensagem: "Essa pagina ainda não existe"})});                        // Define rota GET para "/vitrine" que retorna erro 404 com página não existe

module.exports = router;                                                                                                                    // Exporta o router para uso em outros arquivos