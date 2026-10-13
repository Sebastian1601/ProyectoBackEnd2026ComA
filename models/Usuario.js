//importo el método para crear esquemas
import { Schema, model } from 'mongoose';


const usuarioSchema = new Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    claveHash: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'administracion', 'pedidos', 'invitado'],
        default: "invitado"
    },
    activo: {
        type: Boolean,
        default: true
    },
    creado: {
        type: Date,
        default: Date.now()
    },
})

export default model('Usuario', usuarioSchema);

