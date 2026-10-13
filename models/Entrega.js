import { Schema, model } from 'mongoose';

const entregaSchema = new Schema({
    idRuta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
    },
    idChofer: {
        type: Schema.Types.ObjectId,
        ref: 'Chofer',
    },
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
    },
    fechaEntrega: {
        type: Date,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'],
        default: 'Pendiente'
    }
});

export default model('Entrega', entregaSchema);

/*const Entrega = model('Entrega', entregaSchema);
export default Entrega;

        this.idChofer = idChofer;
        this.idCliente = idCliente;
        this.fechaEntrega = fechaEntrega;
        this.descripcion = descripcion;
        this.estado = estado;// Seteemos estados con inicio en mayúscula: Pendiente, En Proceso, Completada, Cancelada
    }
};*/
