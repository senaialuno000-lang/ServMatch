const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let pastaDestino = "gerais"

        if(req.originalUrl.includes("/usuarios")){

            pastaDestino = "usuarios"

        }else if(req.originalUrl.includes("/produtos")){

            pastaDestino = "produtos"

        }

        const uploadPath = path.join(__dirname, `../../client/public/uploads/${pastaDestino}`)

        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true})
        }

        cb(null, uploadPath)

        filename: (req, file, cb) => {
            const timestamp = Date.now()
            
            const numeroAleatorio = Math.round(Math.random() * 1E9)
            const extendaoDoArquivo = path.extname(file.originalname)

            const nomeFinalSeguro = `${timestamp}-${numeroAleatorio}${extendaoDoArquivo}`

            cb(null, nomeFinalSeguro)
        }
    }
})

const upload = multer( {storage: storage} )

module.exports = upload;