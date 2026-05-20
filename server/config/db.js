const mysql = require('mysql2/promise')

//cria uma pool de conexão, varias conexões de uma vez, para evitar erros no banco
const pool = mysql.createPool({
    host: process.env.DB_HOST,//onde o banco esta
    user: process.env.DB_USER,//usuario que fara a conexao
    password: process.env.DB_PASSWORD,//senha do usuario
    database: process.env.DB_NAME,//banco ao qual deseja se conectar
    waitForConnections: true, //se todas conexões estiverem ocupadas, sem dar erro
    connectionLimit: 10,//quantidade maxima de conexões ao mesmo tempo
    queueLimit: 0 //0 = ilimitado
})

//exporta as informações do banco, pros models utilizarem
module.exports = pool;