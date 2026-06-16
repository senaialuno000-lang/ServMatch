const jwt = require('jsonwebtoken');

function verificaAutenticacao(req, res, next) {
    const token = req.cookies?.token;

    if(!token) {
        return res.redirect("/login");
    }

    try {
       const dados = jwt.verify(token, process.env.JWT_SECRET);
       req.usuario = dados;
       res.locals.usuario = dados;
       next();
    }  catch (erro) {
        res.clearCookie('token') // apaga o token inválido
        return res.redirect('/login') // vai pra tela de login
    }
}

function somenteContratante(req, res, next) {
    if(req.usuario.perfil !== "Contratante"){
        return res.status(403).render('erro', 
            { mensagem: "Acesso negado: Área para Contratantes" }
        )    
    }
    next()
}
// Apenas interessados
function somenteCandidato(req, res, next){
    if(req.usuario.perfil !== "Candidato"){
        return res.status(403).render('erro', 
            { mensagem: "Acesso negado: Área exclusiva para Candidatos" }
        )    
    }
    next()
}

module.exports = {
    verificaAutenticacao,
    somenteContratante,
    somenteCandidato
}