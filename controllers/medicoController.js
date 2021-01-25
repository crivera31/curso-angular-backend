const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
  const medicos = await Medico.find({enabled: '1'}).populate('usuario', 'nombre foto').populate('hospital', 'nombre foto');
  res.json({
    ok: true,
    medicos
  });
}

const crearMedico = async(req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body
  });
  
  try {
    const medicoSave = await medico.save();
    res.json({
      ok: true,
      msg: 'Médico creado con éxito.',
      medico: medicoSave
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al crear médico.'
    });
  }
}

const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid; /**id del usuario q modificara */
  try {
    const medicolDB = await Medico.findById(id);
    if (!medicolDB) {
      return res.status(404).json({
        ok: true,
        msg: "Médico no encontrado.",
      });
    }
    /**formas de actualizar campos */
    // hospital.nombre = req.body.nombre;
    const cambiosMedico = {
      /**extraemos todo lo q viene del body */
      ...req.body,
      usuario: uid /**con esto lo establecemos */,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Se actualizó correctamente.",
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error a actualizar medico.",
    });
  }
}

const borrarMedico = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const medicoDB = await Medico.findById(uid);
    if(!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un medico con ese ID en la DB.'
      })
    }

    if (medicoDB.enabled === '1') {
      await Medico.findByIdAndUpdate(uid, {enabled: '0'}, {new: true});
      res.json({
        ok: true,
        msg: 'Medico deshabilitado.'
      });
    } else {
      await Medico.findByIdAndUpdate(uid, {enabled: '1'}, {new: true});
      res.json({
        ok: true,
        msg: 'Medico habilitado.'
      });
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'error al borrar medico.' 
    });
  }
}

const obtenerMedicoPorId = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id).populate('usuario', 'nombre foto').populate('hospital', 'nombre foto');
    res.json({
      ok: true,
      medico
    });
  } catch (error) {
    console.log(error)
    res.json({
      ok: false,
      'msg': 'Médico no encontrado.'
    });
  } 
}

module.exports = {
  getMedicos, crearMedico, actualizarMedico, borrarMedico, obtenerMedicoPorId
}