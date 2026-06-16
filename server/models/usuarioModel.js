// importa a configuração do banco
const db = require("../config/db.js")

module.exports = {
    // Busca o usuário na tabela, com o email fornecido
    buscarPorEmail: async (email) =>{       
        
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM Usuario WHERE email = ?'
        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query, [email])
        
        // Retorna pro controller o resultado, nesse caso o usuário encontrado
        return linhas[0]
    }
    ,
    // CRUD
    // CREATE
    criarUsuario : async (nome, email, senha, celular, perfil) =>{
        // Query pra fazer a consulta no banco
        const query = `INSERT INTO Usuario (nome, email, senha, celular, perfil)
                       VALUES (?,?,?,?,?)`
        // Guarda o resultado da consulta na variável
        const [resultado] = await db.execute(query, [nome, email, senha, celular, perfil])
        // Retorna pro controller o resultado, nesse caso o id do usuário inserido
        return resultado.insertId 
    }
    ,

    buscarPerfil : async (perfil, email) => {
        // Query pra fazer a consulta no banco
        const query = `SELECT perfil FROM Usuario WHERE email = ?`
        // Guarda o resultado da consulta na variável
        const [resultado] = await db.execute(query, [email])
        // Retorna pro controller o resultado, nesse caso o id do usuário inserido
        return resultado[0] 
    }
}