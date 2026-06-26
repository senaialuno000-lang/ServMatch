const express = require("express");                                                   // Importa o módulo express para criar o servidor;
const app = express();                                                                // Define a porta onde o servidor irá escutar;
const path = require("path");                                                         // Importa o módulo path para lidar com caminhos de arquivos e diretórios;
require('dotenv').config();                                                           // Carrega as variáveis de ambiente do arquivo .env para process.env;
const port = process.env.PORT || 5000;                                                // Define a porta do servidor, usando a variável de ambiente PORT ou 5000 como padrão;

/*==================================================================== 
.................. MIDDLEWARE PARA ENTENDER O JSON ...................
====================================================================*/

app.use(express.json());                                                              // Middleware para interpretar o corpo das requisições como JSON, permitindo que o servidor leia e processe dados enviados em formato JSON;
app.use(express.urlencoded({ extended: true}));                                       // Middleware para interpretar o corpo das requisições com dados codificados em URL, permitindo que o servidor leia e processe dados enviados em formulários HTML; 
app.use(require('cookie-parser')());                                                  // Middleware para analisar os cookies enviados nas requisições, permitindo que o servidor leia e manipule cookies;

/*==================================================================== 
............. CONFIGURAÇÃO DO EJS E PASTAS DO FRONT-END ..............
====================================================================*/

app.set("view engine", "ejs");                                                        // Configura o EJS como a engine de visualização para renderizar arquivos .ejs;
app.set("views", path.join(__dirname, "../client/views"));                            // Define o diretório onde os arquivos de visualização estão localizados;
app.use(express.static(path.join(__dirname, "../client/public")));                    // Configura o diretório para servir arquivos estáticos (CSS, JS, imagens, etc.) a partir do caminho especificado; 

/*==================================================================== 
...................... CRIAÇÃO DE ROTAS PADRÃO .......................
====================================================================*/

app.get("/", (req, res) => {res.status(200).redirect ("/login")});                    // Define uma rota GET para a raiz do servidor ("/") que redireciona para a página de login ("/login");
app.get("/login", (req, res) => {res.render("auth/login")});                          // Define uma rota GET para "/login" que renderiza a página de login usando o arquivo EJS correspondente;
app.get("/cadastro", (req, res) => {res.render("auth/cadastro")});                    // Define uma rota GET para "/cadastro" que renderiza a página de cadastro usando o arquivo EJS correspondente;     
app.get("/recuperarSenha", (req, res) => {res.render("auth/recuperarSenha")});        // Define uma rota GET para "/recuperarSenha" que renderiza a página de recuperação de senha usando o arquivo EJS correspondente;     

/*==================================================================== 
.................... CRIAÇÃO DE ROTAS ESPECÍFICAS ....................
====================================================================*/

const usuariosRoutes = require("./routes/usuarioRoutes.js");                          // Importa as rotas de usuário do arquivo usuarioRoutes.js;
const produtosRouter = require("./routes/produtosRoutes.js");                         // Importa as rotas de produtos do arquivo produtosRouter.js
app.use("/usuarios", usuariosRoutes);                                                 // Usa as rotas de usuário para qualquer caminho que comece com "/usuarios";   
app.use("/produtos", produtosRouter);                                                 // Usa as rotas de produtos para qualquer caminho que comece com "/produtos"

/*==================================================================== 
.................... CONEXÃO COM O BANCO DE DADOS ....................
====================================================================*/

const pool = require("./config/db.js");                                               // Importa a configuração do banco de dados do arquivo db.js para criar uma conexão com o banco de dados;

//Cria uma conexão teste com o banco;
(async () => {
  try {                                                                               // Se o banco de dados estiver ativo, ai sim o servidor será iniciado;
    await pool.getConnection();                                                       // Tenta obter uma conexão com o banco de dados usando o pool de conexões definido no arquivo db.js;
    console.log("Banco conectado");                                                   // Se a conexão for bem-sucedida, exibe uma mensagem no console indicando que o banco de dados está conectado;
    app.listen(port, () => {                                                          // Inicia o servidor na porta definida e exibe uma mensagem no console com o link para acessar o servidor;
      console.log(`Link: http://localhost:${port}`);                                  // Exibe no console o link para acessar o servidor localmente, usando a porta definida na variável port;
      console.log(`Servidor funcionando na porta ${port}`);                           // Exibe no console uma mensagem indicando que o servidor está funcionando na porta definida na variável port;
    });
  } catch (erro) {                                                                    // Se o banco de dados não estiver ativo, o servidor não será iniciado e será exibida uma mensagem de erro no console;
    console.log("Erro ao tentar conectar com o banco de dados");                      // Exibe no console uma mensagem de erro indicando que houve um problema ao tentar conectar com o banco de dados;
    process.exit(1);                                                                  // Encerra o processo do Node.js com um código de saída 1, indicando que ocorreu um erro;
  }
})();



