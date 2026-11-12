import { Schema, model } from 'mongoose';

// Esquema de Cliente: solo define la forma de los datos.
// El acceso a datos (consultas y escrituras) vive en controllers/clientesController.js.
const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        minlength: [3, 'El teléfono debe tener al menos 3 caracteres'],
        trim: true
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        minlength: [3, 'La dirección debe tener al menos 3 caracteres'],
        trim: true
    }
}, { timestamps: true });

export default model('Cliente', clienteSchema);
