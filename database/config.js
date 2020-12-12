const mongoose = require('mongoose');

/**se pone un async porq se hara un await ya q trabajaremos con promesas */
/**al poner un async hara que la funcion retorne una promesa */
const dbConnection = async() => {
  try {
    /**await -> espera a q esto pase(mongoose.conec......) nos ayuda a trabajar se manera sincrona */
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, /**esto requiere mongo o nodejs para conectarte bn a la db */
      useFindAndModify: false
    });
    console.log('DB Online');
  } catch (error) {
    console.warn(error);
    throw new Error('Error a la hora de iniciar la DB');
  }
}

module.exports = {
  dbConnection
}