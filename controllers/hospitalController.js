const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {
  const hospitales = await Hospital.find({enabled: '1'}).populate('usuario', 'nombre');
  res.json({
    ok: true,
    hospitales
  });
}

const crearHospital = async(req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {
    const hospitalSave = await hospital.save()
    res.json({
      ok: true,
      msg: 'Hospital creado con éxito.',
      msg: hospitalSave
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al crear hospital.'
    });
  }
}

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid; /**id del usuario q modificara */
  try {
    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      return res.status(404).json({
        ok: true,
        msg: "Hospital no encontrado.",
      });
    }
    /**formas de actualizar campos */
    // hospital.nombre = req.body.nombre;
    const cambiosHospital = {
      /**extraemos todo lo q viene del body */
      ...req.body,
      usuario: uid /**con esto lo establecemos */,
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Se actualizó correctamente.",
      hopsital: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error a actualizar hospital.",
    });
  }
}

const borrarHospital = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const hospitalDB = await Hospital.findById(uid);
    if(!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un hospital con ese ID en la DB.'
      })
    }

    if (hospitalDB.enabled === '1') {
      await Hospital.findByIdAndUpdate(uid, {enabled: '0'}, {new: true});
      res.json({
        ok: true,
        msg: 'Hospital deshabilitado.'
      });
    } else {
      await Hospital.findByIdAndUpdate(uid, {enabled: '1'}, {new: true});
      res.json({
        ok: true,
        msg: 'Hospital habilitado.'
      });
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'error al borrar hospital.' 
    });
  }
}


module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
}