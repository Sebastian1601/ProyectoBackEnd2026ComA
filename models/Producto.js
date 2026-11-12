import { Schema, model } from 'mongoose';

// Esquema de Producto: solo define la forma de los datos.
// El acceso a datos vive en controllers/productoController.js.
const productoSchema = new Schema({
    nombre: {
        type: String,
        minLength: [4, 'el nombre debe tener al menos 4 caracteres'],
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        min: [0, 'el precio no puede ser negativo'],
        default: 1
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['verduras', 'lacteos', 'carnes', 'procesados', 'no perecederos', 'sin categoria'],
            message: '{VALUE} no es una categoría válida'
        },
        // El default debe estar dentro del enum, si no la validación falla siempre.
        default: 'sin categoria'
    }
}, { timestamps: true });

export const Producto = model('Producto', productoSchema);
