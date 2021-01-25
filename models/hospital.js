const { Schema, model} = require('mongoose');

const HospitalSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  enabled: {
    type: String,
    default: 1
  },
  foto: {
    type: String
  },
  usuario: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, { collection: 'hospitales' });

/**modificando _id, _v1 */
HospitalSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  // object.uid = _id;
  return object;
})


/**implementamos el modelo
 * exponer hacia fuero para usarlo
 */
module.exports = model('Hospital', HospitalSchema)