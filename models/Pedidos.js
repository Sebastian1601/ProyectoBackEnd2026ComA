import { ValidationError } from "../ErrorControl/Errores.js";
import { Schema, model } from 'mongoose';

const pedidoSchema = new Schema({
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
    },
    fecha: {
        type: Date,
        required: true,
        trim: true
    },
    productos: {
        type: [String],
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'],
        default: 'Pendiente'
    }
});

pedidoSchema.methods.obtenerEstado = function () {
    return this.estado;
}

pedidoSchema.methods.actualizarEstado = function (nuevoEstado) {
    const estadosValidos = ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new ValidationError(`Estado inválido. Los estados válidos son: ${estadosValidos.join(', ')}`, 'estado');
    }
    this.estado = nuevoEstado;
}

export default model('Pedido', pedidoSchema);

/*export class Pedido {
    static estados_validos = ["pendiente", "en proceso", "completada", "cancelada"]
    constructor({ id, cliente, fecha, productos, estado = "pendiente" }) {
        this.id = id;
        this.cliente = cliente;
        this.fecha = fecha;
        this.productos = productos;
        this.estado = estado; //pendiente, En Proceso, Completada, Cancelada
    }

    get estado() {
        return this._estado;
    }
    set estado(valor) {
        if (!Pedido.estados_validos.includes(valor.trim().toLowerCase())) {
            throw new ValidationError(`Error al ingresar estado, debería ser una de las opciones ${Pedido.estados_validos.join(", ")}`, valor);
        };
        this._estado = valor;
    }

    toJSON() {
        return {
            id: this.id,
            cliente: this.cliente,
            fecha: this.fecha,
            estado: this._estado,
            productos: this.productos
        }
    }
};*/


//creo que la clase Entrega, sería la que se crea y queda registrada con los datos del transporte, como se puso en el constructor, que a su vez, en esa instancia, se guardan los datos de los PEDIDOS que llevan esta estructura, porque un transporte puede llevar varios pedidos.