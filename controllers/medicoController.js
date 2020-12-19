const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
  const medicos = await Medico.find().populate('usuario', 'nombre').populate('hospital', 'nombre');
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
      medico: medicoSave
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

  
}

const actualizarMedico = (req, res = response) => {
  res.json({
    ok: true,
    hospitales: 'actualizarMedico'
  });
}

const borrarMedico = (req, res = response) => {
  res.json({
    ok: true,
    hospitales: 'borrarMedico'
  });
}


module.exports = {
  getMedicos, crearMedico, actualizarMedico, borrarMedico
}