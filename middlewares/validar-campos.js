const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    /**validando errores */
    const errores = validationResult(req);
    if(!errores.isEmpty()) { /**si no esta vacio errores */
       return res.status(400).json({
         ok: false,
         errors: errores.mapped()
       });
    }
    next();
}

module.exports = {
  validarCampos
}