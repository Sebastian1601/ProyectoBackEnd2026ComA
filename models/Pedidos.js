import { ValidationError } from "../ErrorControl/Errores.js";
import { Schema, model } from 'mongoose';

const pedidoSchema = new Schema({
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El idCliente es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    productos: {
        type: [String],
        required: [true, 'Debe especificar al menos un producto']
    },
    estado: {
        type: String,
        enum: {
            values: ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'Pendiente'
    }
});

pedidoSchema.methods.obtenerEstado = function () {
    return this.estado;
};

pedidoSchema.methods.actualizarEstado = function (nuevoEstado) {
    const estadosValidos = ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new ValidationError(`Estado inválido. Los estados válidos son: ${estadosValidos.join(', ')}`, 'estado');
    }
    this.estado = nuevoEstado;
};

export default model('Pedido', pedidoSchema);