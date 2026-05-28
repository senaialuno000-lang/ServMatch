// importação do model
const UsuarioModel = require("../models/usuarioModel.js")

// importar pacotes
// para criptrograffia
const bcrypt = require('bcrypt')
// para lidar com cookies
const jwt = require('jsonwebtoken')
const usuarioModel = require("../models/usuarioModel.js")

module.exports = {
    //FUNÇÕES DE LOGIN
    login: async (req,res) =>{
        try{
            // Pega as infomações das caixinhas da view, de acordo com o name delas
            const { email, senha } = req.body
            
            // Executa a função de busca no model
            const usuario = await usuarioModel.buscarPorEmail(email)
            // Se não existir, mensagem de erro
            if (!usuario) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})
                            console.log(senha);

            // compara a senha que o usuário digitou, com a senha do usuario retornado no banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha); 
            console.log(senhaValida);
            
            // Se senhas não coincidirem, mensagem de erro
            if (!senhaValida) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})

            // Gera o token de acesso, contendo o perfil 
            const token = jwt.sign(
                {id: usuario.id, perfil: usuario.perfil, nome: usuario.nome},
                process.env.JWT_SECRET,
                {expiresIn: '2h'}       
            )

            // Guardar o token nos cookies do navegador
            res.cookie('token', token, { httpOnly: true })

            // Redirecionamento de acordo com o perfil
            if(usuario.perfil === "Contratante") return res.redirect("/produtos/meus-produtos")
            if(usuario.perfil === "Contratado") return res.redirect("/produtos/vitrine")
        }
        catch(erro){
            res.status(500).render('erro', { mensagem: "Erro interno no servidor"})
        }
    },

    logout: (req,res) =>{
        //Limpa o token dos cookies
        res.clearCookie('token')
        // Volta pra tela de login
        res.redirect("/login")
    },

    renderizarCadastro: (req, res) => {                                                                         // Função para renderizar a página de cadastro de usuário
        res.render("usuario/cadastrar");                                                                        // Renderiza a página de cadastro de usuário
    },

    cadastrar: async (req, res) => { 
        try {
            const {nome, email, senha, celular, telefone, perfil} = req.body;

            console.log(nome, email, senha, celular, telefone, perfil)
            if (perfil === "Contratante") {                                                                   // Verifica se o perfil selecionado é "administrador"
                return res.status(403).render("erro", { mensagem: "Você não possui acesso" });                  // Renderiza a página de erro com uma mensagem de acesso negado se o perfil for "administrador"
            }

            const senhaHash = await bcrypt.hash(senha, 10);                                                         // Hash da senha usando bcrypt com um salt de 10 rounds     
            await usuarioModel.criarUsuario(nome, email, senhaHash, celular, telefone, perfil);            // Chama a função do modelo para criar um novo usuário no banco de dados com os dados fornecidos
            let redirecionadoPara = "/login";

            if (req.cookies && req.cookies.token) {                                                                 // Verifica se o usuário está autenticado verificando a presença do token no cookie
                try {
                    const decodificado = jwt.verify(req.cookies.token, process.env.JWT_SECRET);                 // Verifica e decodifica o token JWT usando a chave secreta  
                    if (decodificado.perfil === "Contratante") {                                              // Verifica se o perfil do usuário autenticado é "administrador"
                        redirecionadoPara = "/usuarios";                                                        // Se o perfil do usuário autenticado for "administrador", redireciona para a página de administração de usuários
                    }
                } catch {

                }
            }
            res.redirect(redirecionadoPara); 
        } catch (erro) {
            console.error(erro);                                                                                // Loga o erro no console para depuração
            res.status(500).render("erro", { mensagem: "Erro ao cadastrar o usuário" });                        // Renderiza a página de erro com uma mensagem específica se ocorrer um erro durante o processo de cadastro do usuário
        }
    }

}