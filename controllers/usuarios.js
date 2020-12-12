const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

/**importando mis modelos */
const Usuario = require('../models/usuario')

const getUsuarios = async(req, res) => {
  const lstUsuarios = await Usuario.find({enabled: '1'},'nombre email role enabled google');
  res.json({
    ok: true,
    usuarios: lstUsuarios
    // uid: req.uid
  });
}

const crearUsuario = async(req, res = response) => {
  const { email,password,nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if(existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El email ingresado ya esta registrado.'
      });
    }

    const usuario = new Usuario(req.body)
    /**encriptar contraseña */
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save(); /**es una promesa, puede q lo haga rapido o demore */
    /**generar token JWT */
    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      msg: 'Usuario creado con éxito.',
      usuario: usuario,
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs!'
    })
  }
}

const actualizarUsuario = async(req, res = response) => {
  /**validar token y comprobar si el usuario es correcto */
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if(!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario con ese ID en la DB.'
      })
    }

    /**actualizar data */
    const { password, google, email, ...campos } = req.body; /**desestructuramos lo q viene en el request body, campos q no se usaran para actualizar */
    if(usuarioDB.email != email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email.'
        })
      }
    }
    campos.email = email; /**email a actualizar */
    /**campos q no desea actualizar
     * esto lo desestructuramos en line 63
    */
    // delete campos.password;
    // delete campos.google;

    /**te arroja el usuario antes de actualizar, agregar new: true */
    /**ver min 13 */
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});


    res.json({
      ok: true,
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado!'
    })
  }
}

const borrarUsuario = async(req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if(!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario con ese ID en la DB.'
      })
    }
    
    if (usuarioDB.enabled === '1') {
      await Usuario.findByIdAndUpdate(uid, {enabled: '0'}, {new: true});
      res.json({
        ok: true,
        msg: 'Usuario deshabilitado.'
      });
    } else {
      await Usuario.findByIdAndUpdate(uid, {enabled: '1'}, {new: true});
      res.json({
        ok: true,
        msg: 'Usuario habilitado.'
      });
    }
    // await Usuario.findByIdAndDelete(uid);
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'error al borrar...' 
    });
  }
}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario
}