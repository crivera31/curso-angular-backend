const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarFile } = require('../helpers/actualizar-foto');


const fileUploadIMG = async(req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  /**validar tipos*/
  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'El tipo no es válido.'
    })
  }
  /**validar que exista archivo */
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se cargo ningún archivo.'
    });
  }
  /**procesar archivo */
  /**archivo es del formulario del front */
  const file = req.files.archivo;
  const nombre = file.name.split('.'); /**myphoto.1.1.png */
  const extensionFile = nombre[nombre.length - 1]; /**con esto ya de obtiene png, jpg, etc */
  
  /**validar extension */
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
  if (!extensionesValidas.includes(extensionFile)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es una extensión válida.'
    });
  }

  /**generar el nombre del archivo */
  const nombreArchivo = `${ uuidv4() }.${ extensionFile }`;

  /**path para guardar el archivo */
  const path = `./uploads/${ tipo }/${ nombreArchivo }`;

  /**mover el archivo */
   // Use the mv() method to place the file somewhere on your server
   file.mv(path, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        ok: false,
        msg: 'Error al mover el archivo.'
      });
    }

    /**actualizar db */
    actualizarFile(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: 'Archivo subido.',
      nombreArchivo
    });
  });
}

const RetornaImagen = async(req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
  /**asignar img por defecto si no existe el pathImg*/
  if(fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/img_not_found.png`);
    res.sendFile(pathImg);
  }

}

module.exports = {
  fileUploadIMG,
  RetornaImagen
}