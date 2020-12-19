const fs = require('fs'); /**para carpetas y archivos */
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const borrarIMG = (path) => {
  if (fs.existsSync(path)) {
    /**borrar img anterior */
    fs.unlinkSync(path);
  }
}

const actualizarFile = async(tipo, id, nombreArchivo) => {
  let pathViejo = '';
  switch (tipo) {
    case 'medicos':
      const medico = await Medico.findById(id);
      if (!medico) {
        return false; /**no se subio el archivo */
      }

      /**validar si ya tiene una img*/
      pathViejo = `./uploads/medicos/${ medico.foto }`;
      borrarIMG(pathViejo);

      medico.foto = nombreArchivo;
      await medico.save();
      return true;

      break;

    case 'hospitales':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return false; /**no se subio el archivo */
      }

      /**validar si ya tiene una img*/
      pathViejo = `./uploads/hospitales/${ hospital.foto }`;
      borrarIMG(pathViejo);

      hospital.foto = nombreArchivo;
      await hospital.save();
      return true;

      break;

    case 'usuarios':
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return false; /**no se subio el archivo */
      }

      /**validar si ya tiene una img*/
      pathViejo = `./uploads/usuarios/${ usuario.foto }`;
      borrarIMG(pathViejo);

      usuario.foto = nombreArchivo;
      await usuario.save();
      return true;

      break;

    default:
      break;
  }
}

module.exports = {
  actualizarFile
}