const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {
  const { email, password } = req.body;
  try {
    /**verificar email */
    const usuarioDB = await Usuario.findOne({enabled: '1', email});
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe.' /**usuario deshabilitado*/
      });
    }

    /**verificar contraseña */
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña no es válida.'
      });
    }

    /**generar token JWT */
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      msg: 'Usuario '+usuarioDB.email+' autenticado.',
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    });
  }
}

const googleSingIn = async(req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if(!usuarioDB) {
      /**si no existe el usuario */
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        foto: picture,
        google: true
      })
    } else {
      /**existe usuario */
      usuario = usuarioDB;
      usuario.google = true;
    }
    /**guarda en db */
    await usuario.save();

    /**generar token JWT */
    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      msg: 'Google Sing-In',
      token
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: 'Token no es correcto'
    });
  }
}

const renewToken = async(req, res = response) => {
  /**generar nuevo token */
  const uid = req.uid;
  const token = await generarJWT(uid);
  res.json({
    ok: true,
    token
  })
}
module.exports = {
  login,
  googleSingIn,
  renewToken
}