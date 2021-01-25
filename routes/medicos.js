/**
 * ruta -> /api/medicos
 * */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico,obtenerMedicoPorId } = require('../controllers/medicoController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get("/",validarJWT, getMedicos);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio.').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser válido.').isMongoId(),
    validarCampos
  ],
  crearMedico
);

router.put(
  "/:id",
  [
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio.').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser válido.').isMongoId(),
    validarCampos
  ],
  actualizarMedico
);

router.delete("/:id",validarJWT, borrarMedico);

router.get("/:id",validarJWT, obtenerMedicoPorId);

/**exportamos el router */
module.exports = router;