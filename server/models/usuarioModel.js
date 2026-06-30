const db = require("../config/db.js");                                                                          // Importa a configuração/objeto de conexão com o banco de dados (usa as funções de execução de queries)

module.exports = {                                                                                                  // Exporta as funções do modelo de usuário
    // Busca o usuário na tabela, com o email fornecido
    buscarPorEmail: async (email) =>{                                                                               // Define função assíncrona para buscar usuário por email
        
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM Usuario WHERE email = ?';                                                      // Define consulta SQL de seleção do usuário por email
        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query, [email]);                                                          // Executa a query e captura o resultado
        
        // Retorna pro controller o resultado, nesse caso o usuário encontrado
        return linhas[0];                                                                                            // Retorna o primeiro registro encontrado
    }
    ,
    // CRUD
    // CREATE
    criarUsuario : async (nome, email, senha, celular, perfil) =>{                                                   // Define função assíncrona para criar um novo usuário
        // Query pra fazer a consulta no banco
        const query = `INSERT INTO Usuario (nome, email, senha, celular, perfil)
                       VALUES (?,?,?,?,?)`;                                                                           // Define query SQL de inserção de usuário
        // Guarda o resultado da consulta na variável
        const [resultado] = await db.execute(query, [nome, email, senha, celular, perfil]);                           // Executa a query de insert
        // Retorna pro controller o resultado, nesse caso o id do usuário inserido
        return resultado.insertId;                                                                                   // Retorna o id inserido
    }
    ,

    buscarPerfil : async (perfil, email) => {                                                                        // Define função assíncrona para buscar perfil do usuário
        // Query pra fazer a consulta no banco
        const query = `SELECT perfil FROM Usuario WHERE email = ?`;                                                   // Define query SQL de seleção do perfil por email
        // Guarda o resultado da consulta na variável
        const [resultado] = await db.execute(query, [email]);                                                         // Executa a query e captura o resultado
        // Retorna pro controller o resultado, nesse caso o id do usuário inserido
        return resultado[0];                                                                                         // Retorna o perfil encontrado
    },

    listarVagas : async (perfil, email) => {                                                                         // Define função assíncrona para listar vagas
        // Query pra fazer a consulta no banco
        const query = `SELECT tituloVaga, localidadeVaga, salario, descricaoVaga FROM Vagas`;                         // Define query SQL para listar todas as vagas
        // Guarda o resultado da consulta na variável
        const [linhas] = await db.execute(query);                                                                    // Executa a query de seleção das vagas

        return linhas;                                                                                                // Retorna a lista de vagas
    }, 

    listarUsuarios : async (perfil, email) => {                                                                      // Define função assíncrona para listar usuários candidatos
        const query = `SELECT nome FROM Usuario WHERE perfil = 'Candidato'`;                                          // Define query SQL para listar nomes de candidatos
        const [linhas] = await db.execute(query);                                                                    // Executa a query de seleção dos candidatos
        return linhas;                                                                                                // Retorna a lista de candidatos
    }

};                                                                                                                    // Fecha a exportação do módulo