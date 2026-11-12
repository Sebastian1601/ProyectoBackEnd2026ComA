import { Schema, model } from 'mongoose';

const VehiculoSchema = new Schema({
    patente: {
        type: String,
        required: true,
        unique: true
    },
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true,
    },
    capacidad: {
        type: String,
        required: true,
        enum: ['Pequeño', 'Mediano', 'Grande']
    },
    estado: {
        type: String,
        default: "Disponible",
        enum: ['Disponible', 'Asignado', 'En mantenimiento', 'Fuera de servicio']
    },
    idChoferAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Chofer',
    }
});

VehiculoSchema.methods.asignarChofer = function (idChofer) {
    if (this.estado !== 'Disponible') {
        return { success: false, message: 'El vehículo no está disponible y no puede ser asignado a un chofer.' };

    }
    else if (this.idChoferAsignado || this.estado === 'Asignado') {
        return { success: false, message: 'El vehículo ya tiene un chofer asignado.' };
    }
    else {
        this.idChoferAsignado = idChofer;
        this.estado = 'Asignado'; // Cambio el estado del vehículo a Asignado al asignarle un chofer
        return { success: true, message: 'Chofer asignado correctamente.' };
    }
};

VehiculoSchema.methods.liberarChofer = function () {
    if (!this.idChoferAsignado || this.estado !== 'Asignado') {
        return { success: false, message: 'El vehículo no tiene un chofer asignado y no puede ser liberado.' };
    }
    else {
        this.idChoferAsignado = null;
        this.estado = 'Disponible'; // Quito chofer y libero el estado
        return { success: true, message: 'Chofer liberado correctamente.' };
    }
};

export default model('Vehiculo', VehiculoSchema);
