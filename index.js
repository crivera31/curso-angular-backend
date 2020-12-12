require('dotenv').config();/*importanto variable de entornos */
const express = require('express') /**importando express */
const cors = require('cors')

const { dbConnection } = require('./database/config');

const app = express();/**crear el servidor express */

/**el use es in middleware, q es un funcion q se va a ejutar para todas las lineas q se ejecuta debajo */
app.use(cors()) /**config. cors */

app.use(express.json()); /**lectura y parseo del body */

/**llamando a dbconection */
dbConnection();

/**rutas */
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

/*iniciar el servidor*/
/**port: 3000 */
app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en puerto ' +process.env.PORT);
})