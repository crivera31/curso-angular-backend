require('dotenv').config();/*importanto variable de entornos */
const morgan = require('morgan');
const publicIp = require('public-ip');
const ip2loc = require("ip2location-nodejs");
const express = require('express') /**importando express */
const cors = require('cors')

ip2loc.IP2Location_init("./IP2LOCATION-LITE-DB1.BIN");

const { dbConnection } = require('./database/config');

const app = express();/**crear el servidor express */

app.use(morgan('combined'));

/**el use es in middleware, q es un funcion q se va a ejutar para todas las lineas q se ejecuta debajo */
app.use(cors()) /**config. cors */

app.use(express.json()); /**lectura y parseo del body */

/**llamando a dbconection */
dbConnection();

/**directorio publico */
app.use(express.static('public'));


/**rutas */
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.use('/api/hospitales', require('./routes/hospitales'));

app.use('/api/medicos', require('./routes/medicos'));

app.use('/api/todo', require('./routes/busquedas'));

app.use('/api/uploads', require('./routes/upload'));

app.get('/test', (req, res) =>{
	(async () => {
        const ip = await publicIp.v4()
        return res.send({
            myIp: ip,
            country_short: ip2loc.IP2Location_get_all(ip).country_short,
            country_long: ip2loc.IP2Location_get_all(ip).country_long,
        })
    })();
});

/*iniciar el servidor*/
/**port: 3000 */
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo en puerto: ' +process.env.PORT);
})