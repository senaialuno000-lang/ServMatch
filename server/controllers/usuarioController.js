/*====================================================================
........................... IMPORTA PACOTES ..........................
====================================================================*/

const usuarioModel = require("../models/usuarioModel.js");                                                      // importa o model de usuário para poder usar suas funções;                                                                                                                
const bcrypt = require('bcrypt');                                                                               // Importa o pacote bcrypt para realizar o hash de senhas, garantindo que as senhas dos usuários sejam armazenadas de forma segura no banco de dados;
const jwt = require('jsonwebtoken');                                                                            // Importa o pacote jsonwebtoken para criar e verificar tokens JWT, permitindo a autenticação e autorização de usuários em rotas protegidas;

/*====================================================================
........................ MÓDULO DE USUÁRIO ...........................
====================================================================*/  

module.exports = {                                                                                              // Exporta um objeto contendo funções relacionadas ao usuário, permitindo que outras partes do aplicativo acessem essas funcionalidades;    
    // FUNÇÕES DE LOGIN
    login: async (req,res) =>{                                                                                  // Função assíncrona para lidar com o login do usuário, recebendo a requisição e a resposta como parâmetros;
        try{                                                                                                    // Bloco try-catch para capturar erros durante o processo de login;
            const { email, senha } = req.body;                                                                  // Desestruturação do corpo da requisição para obter o email e a senha fornecidos pelo usuário;
            const usuario = await usuarioModel.buscarPorEmail(email);                                           // Chama a função do modelo para buscar o usuário no banco de dados com base no email fornecido, aguardando a resposta;
            
            if (!usuario) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"});          // Se o usuário não for encontrado, retorna uma resposta de erro 404 e renderiza a página de erro com uma mensagem específica;
            const senhaValida = await bcrypt.compare(senha, usuario.senha);                                     // Compara a senha fornecida pelo usuário com a senha armazenada no banco de dados usando bcrypt, aguardando o resultado da comparação;     
            
            if (!senhaValida) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"});      // Se a senha não for válida, retorna uma resposta de erro 404 e renderiza a página de erro com uma mensagem específica;

            const token = jwt.sign(                                                                             // Cria um token JWT contendo informações do usuário, usando a chave secreta definida nas variáveis de ambiente e definindo um tempo de expiração para o token;
                {id: usuario.id, perfil: usuario.perfil, nome: usuario.nome},                                   // Define o payload do token JWT, incluindo o ID do usuário, o perfil e o nome;
                process.env.JWT_SECRET,                                                                         // Usa a chave secreta definida nas variáveis de ambiente para assinar o token JWT, garantindo que ele seja seguro e possa ser verificado posteriormente;
                {expiresIn: '2h'}                                                                               // Define o tempo de expiração do token JWT como 2 horas, após o qual o token não será mais válido e o usuário precisará fazer login novamente;
            );

            res.cookie('token', token, { httpOnly: true });                                                     // Define um cookie chamado 'token' contendo o token JWT gerado, com a opção httpOnly definida como true para aumentar a segurança, impedindo que o cookie seja acessado por scripts do lado do cliente;

            if(usuario.perfil === "Contratante") return res.redirect("/usuarios/contratante");                  // Se o perfil do usuário for "Contratante", redireciona para a página de contratante;
            if(usuario.perfil === "Candidato") return res.redirect("/usuarios/candidato");                      // Se o perfil do usuário for "Candidato", redireciona para a página de candidato;
        }
        catch(erro){                                                                                            // Bloco catch para capturar erros que possam ocorrer durante o processo de login, como problemas de conexão com o banco de dados ou erros inesperados;
            res.status(500).render('erro', { mensagem: "Erro interno no servidor"});                            // Retorna uma resposta de erro 500 e renderiza a página de erro com uma mensagem específica, indicando que ocorreu um erro interno no servidor;
        }
    },

    // FUNÇÃO DE LOGOUT
    logout: (req,res) => {                                                                                      // Função para lidar com o logout do usuário, recebendo a requisição e a resposta como parâmetros;
        res.clearCookie('token');                                                                               // Limpa o cookie chamado 'token', removendo o token JWT armazenado no navegador do usuário, efetivamente encerrando a sessão do usuário;
        res.redirect("/login");                                                                                 // Redireciona o usuário para a página de login após o logout, permitindo que ele faça login novamente se desejar;
    },

    // FUNÇÕES DE CADASTRO
    renderizarCadastro: (req, res) => {res.render("usuario/cadastrar")},                                        // Função para renderizar a página de cadastro de usuário, recebendo a requisição e a resposta como parâmetros e chamando o método render para exibir o arquivo EJS correspondente;

    // FUNÇÃO DE CADASTRO DE USUÁRIO
    cadastrar: async (req, res) => {                                                                            // Função assíncrona para lidar com o cadastro de um novo usuário, recebendo a requisição e a resposta como parâmetros; 
        try {                                                                                                   // Bloco try-catch para capturar erros durante o processo de cadastro do usuário;
            const {nome, email, senha, celular, perfil} = req.body;                                             // Desestruturação do corpo da requisição para obter os dados fornecidos pelo usuário durante o cadastro, incluindo nome, email, senha, celular e perfil;
            const senhaHash = await bcrypt.hash(senha, 10);                                                     // Hash da senha usando bcrypt com um salt de 10 rounds;     
            await usuarioModel.criarUsuario(nome, email, senhaHash, celular, perfil);                           // Chama a função do modelo para criar um novo usuário no banco de dados com os dados fornecidos;
            let redirecionadoPara = "/login";                                                                   // Define a rota padrão para redirecionamento após o cadastro, inicialmente configurada para a página de login;

            if (req.cookies && req.cookies.token) {                                                             // Verifica se o usuário está autenticado verificando a presença do token no cookie;
                try {                                                                                           // Bloco try-catch para capturar erros durante a verificação do token JWT;
                    const decodificado = jwt.verify(req.cookies.token, process.env.JWT_SECRET);                 // Verifica e decodifica o token JWT usando a chave secreta;
                    if (decodificado.perfil === "Contratante") {                                                // Verifica se o perfil do usuário autenticado é "administrador";
                        redirecionadoPara = "/usuarios";                                                        // Se o perfil do usuário autenticado for "administrador", redireciona para a página de administração de usuários;
                    }
                } catch {                                                                                       // Bloco catch para capturar erros que possam ocorrer durante a verificação do token JWT, como token inválido ou expirado;

                }
            }

            res.redirect(redirecionadoPara);                                                                    // Redireciona o usuário para a página apropriada após o cadastro, dependendo do perfil do usuário autenticado ou para a página de login se não estiver autenticado; 
        } catch (erro) {                                                                                        // Bloco catch para capturar erros que possam ocorrer durante o processo de cadastro do usuário, como problemas de conexão com o banco de dados ou erros inesperados;
            console.error(erro);                                                                                // Loga o erro no console para depuração;
            res.status(500).render("erro", { mensagem: "Erro ao cadastrar o usuário" });                        // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de cadastro do usuário;
        }
    },

    // FUNÇÕES DE PÁGINA PRINCIPAL CANDIDATO
    paginaPrincipalCandidato: async (req, res) => {                                                             // Função assíncrona para renderizar a página principal do candidato, recebendo a requisição e a resposta como parâmetros;
        try{                                                                                                    // Bloco try-catch para capturar erros durante o processo de renderização da página principal do candidato;
            const vagas = await usuarioModel.listarVagas();                                                     // Chama a função do modelo para listar as vagas disponíveis no banco de dados, aguardando a resposta;
            res.render('usuarios/candidato/candidatoPaginaInicial', {vagas});                                   // Renderiza a página principal do candidato, passando o objeto com a lista de vagas disponíveis para o arquivo EJS correspondente;
        }
        catch(erro){                                                                                            // Bloco catch para capturar erros que possam ocorrer durante o processo de renderização da página principal do candidato, como problemas de conexão com o banco de dados ou erros inesperados;
            res.status(500).render('erro', {mensagem: "Erro ao listar vagas"});                                 // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de renderização da página principal do candidato;       
        }
    },

    // FUNÇÕES DE PÁGINA PRINCIPAL CONTRATANTE
    paginaContratante: async (req, res) => {                                                                    // Função assíncrona para renderizar a página principal do contratante, recebendo a requisição e a resposta como parâmetros;
        try{                                                                                                    // Bloco try-catch para capturar erros durante o processo de renderização da página principal do contratante;
            const usuarios = await usuarioModel.listarUsuarios();                                               // Chama a função do modelo para listar os usuários disponíveis no banco de dados, aguardando a resposta;
            res.render('usuarios/contratante/paginaContratante', { usuarios });                                 // Renderiza a página principal do contratante, passando o objeto com a lista de usuários disponíveis para o arquivo EJS correspondente;
        }
        catch(erro){                                                                                            // Bloco catch para capturar erros que possam ocorrer durante o processo de renderização da página principal do contratante, como problemas de conexão com o banco de dados ou erros inesperados;
            res.status(500).render('erro', {mensagem: "Erro ao listar usuários"});                              // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de renderização da página principal do contratante;
        }
    },

    // FUNÇÕES DE PÁGINA VAGAS CONTRATANTE
    vagasContratante: async (req, res) => {                                                                     // Função assíncrona para renderizar a página de vagas do contratante, recebendo a requisição e a resposta como parâmetros;
        try{                                                                                                    // Bloco try-catch para capturar erros durante o processo de renderização da página de vagas do contratante;
            res.render('usuarios/contratante/vagasContratante');                                                // Renderiza a página de vagas do contratante, chamando o método render para exibir o arquivo EJS correspondente;
        } catch(erro) {                                                                                         // Bloco catch para capturar erros que possam ocorrer durante o processo de renderização da página de vagas do contratante, como problemas de conexão com o banco de dados ou erros inesperados;
            res.status(500).render('erro', {mensagem: "Erro ao mostrar vagas do contratante"});                 // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de renderização da página de vagas do contratante;
        }
    },

    // FUNÇÕES DE PÁGINA CRIAR VAGAS CONTRATANTE
    criarVagasContratante: async (req, res) => {                                                               // Função assíncrona para renderizar a página de criação de vagas do contratante, recebendo a requisição e a resposta como parâmetros;
        try{                                                                                            
            res.render('usuarios/contratante/criarVagasContratante');                                          // Renderiza a página de criação de vagas do contratante, chamando o método render para exibir o arquivo EJS correspondente;
        } catch(erro) {
            res.status(500).render('erro', {mensagem: "Erro ao mostrar criar vagas do contratante"});          // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de renderização da página de criação de vagas do contratante;           
        }
    }
}