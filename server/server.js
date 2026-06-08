// Importação do módulo express;
const express = require("express");                                                 // Importa o módulo express para criar o servidor
const app = express();                                                               // Define a porta onde o servidor irá escutar
const path = require("path");

require('dotenv').config()

const port = process.env.PORT || 5000;
// Importa o módulo path para lidar com caminhos de arquivos e diretórios

// MIDDLEWARE PARA ENTENDER O JSON
// Lê os dados em JSON
app.use(express.json()) 
// Servidor está apto a ler os dados dos formulário
app.use(express.urlencoded({ extended: true })) 
// Permite ler cookies e alterar também
app.use(require('cookie-parser')())

// Configuração do EJS e pastas do Front-end;
// Define o EJS como engine do front;
app.set("view engine", "ejs");                                                      // Configura o EJS como a engine de visualização para renderizar arquivos .ejs
app.set("views", path.join(__dirname, "../client/views"));                          // Define o diretório onde os arquivos de visualização estão localizados
app.use(express.static(path.join(__dirname, "../client/public")));                  // Configura o diretório para servir arquivos estáticos (CSS, JS, imagens, etc.) a partir do caminho especificado 

// Criação de rotas padrão;
app.get("/", (req, res) => {                                                        // Define uma rota GET para a raiz "/"
    res.status(200).redirect ("/login");                                            // Redireciona a requisição para a rota "/login" com status 200 (OK)                  
});

app.get("/login", (req, res) => {                                                   // Define uma rota GET para "/login" (a função de callback está vazia, o que significa que não há resposta definida para essa rota)
    res.render("auth/login");                                                       // Tenta renderizar um arquivo EJS como resposta, mas há um erro de sintaxe aqui (falta o parâmetro 'res' na função de callback)
}); 

app.get("/cadastro", (req, res) => {                                                // Define uma rota GET para "/cadastro" (a função de callback está vazia, o que significa que não há resposta definida para essa rota)
    res.render("auth/cadastro");                                                    // Tenta renderizar um arquivo EJS  como resposta, mas há um erro de sintaxe aqui (falta o parâmetro 'res' na função de callback)
}); 

app.get("/main", (req, res) => {                                                    // Define uma rota GET para "/main" (a função de callback está vazia, o que significa que não há resposta definida para essa rota)
    res.render("auth/main");                                                        // Tenta renderizar um arquivo EJS  como resposta, mas há um erro de sintaxe aqui (falta o parâmetro 'res' na função de callback)
}); 

// Importar as rotas de usuário;
const usuariosRoutes = require("./routes/usuarioRoutes.js");                        // Importa as rotas de usuário do arquivo usuarioRoutes.js
app.use("/usuarios", usuariosRoutes);                                               // Usa as rotas de usuário para qualquer caminho que comece com "/usuarios"   

const produtosRouter = require("./routes/produtosRoutes.js");                       // Importa as rotas de produtos do arquivo produtosRouter.js
app.use("/produtos", produtosRouter);                                               // Usa as rotas de produtos para qualquer caminho que comece com "/produtos"

const pool = require("./config/db.js");
//Cria uma conexão teste com o banco
(async () => {
  try {
    // Se o banco de dados estiver ativo, ai sim o servidor será iniciado
    await pool.getConnection();
    console.log("Banco conectado");
    // Se o banco de dados estiver ativo, ai sim o servidor será iniciado
    app.listen(port, () => {
      console.log(`Link: http://localhost:${port}`);
      console.log(`Servidor funcionando na porta ${port}`);
    });
  } catch (erro) {
    // Se deu erro, avisa e encerra a tentativa
    console.log("Erro ao tentar conectar com o banco de dados");
    process.exit(1);
  }
})();



