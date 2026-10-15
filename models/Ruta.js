import { Schema, model } from 'mongoose';

const RutaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la ruta es obligatorio'],
        trim: true
    },
    origen: {
        type: String,
        trim: true
    },
    destino: {
        type: String,
        trim: true
    },
    duracionEstimada: {
        type: Number,
        min: [0, 'La duración estimada no puede ser negativa']
    },
    distanciaEstimada: {
        type: Number,
        min: [0, 'La distancia estimada no puede ser negativa']
    },
    idChoferAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Chofer',
        default: null
    }
});

RutaSchema.methods.asignarChofer = function (idChofer) {
    if (this.idChoferAsignado) {
        return { success: false, message: 'La ruta ya tiene un chofer asignado.' };
    } else {
        this.idChoferAsignado = idChofer;
        return { success: true, message: 'Chofer asignado correctamente a la ruta.' };
    }
};

RutaSchema.methods.liberarChofer = function () {
    if (!this.idChoferAsignado) {
        return { success: false, message: 'La ruta no tiene un chofer asignado y no puede ser liberada.' };
    } else {
        this.idChoferAsignado = null;
        return { success: true, message: 'Chofer liberado correctamente de la ruta.' };
    }
};

export default model('Ruta', RutaSchema);