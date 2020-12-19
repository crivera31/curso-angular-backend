/**
 * ruta -> /api/uploads
 * es PUT porq se asignara una img a un registro q ya existe en la db 
 * */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { fileUploadIMG, RetornaImagen } = require('../controllers/uploadController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use(expressFileUpload());

router.put("/:tipo/:id",validarJWT, fileUploadIMG);
router.get("/:tipo/:foto", RetornaImagen);

/**exportamos el router */
module.exports = router;