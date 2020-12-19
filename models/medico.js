const { Schema, model} = require('mongoose');

const MedicoSchema = Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  }
});

/**modificando _id, _v1 */
MedicoSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
})


/**implementamos el modelo
 * exponer hacia fuero para usarlo
 */
module.exports = model('Medico', MedicoSchema)