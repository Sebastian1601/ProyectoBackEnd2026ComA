import { Schema, model } from 'mongoose';

const choferSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    dni: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    numeroRegistro: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    idVehiculoAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Vehiculo',
        trim: true
    },
    idRutaActual: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        trim: true
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Ocupado', 'Inactivo'],
        required: true,
        default: 'Disponible'
    },
    fechaIngreso: {
        type: Date,
        required: true,
        trim: true
    },
})

choferSchema.methods.asignarVehiculo = function (idVehiculo) {
    if (this.estado !== 'Disponible') {
        return { success: false, message: 'El chofer no está disponible y no puede ser asignado a un vehículo.' };
    }
    else if (this.idVehiculoAsignado) {
        return { success: false, message: 'El chofer ya tiene un vehículo asignado.' };
    }
    else {
        this.idVehiculoAsignado = idVehiculo;
        return { success: true, message: 'Vehículo asignado correctamente.' };
    }
}

choferSchema.methods.asignarRuta = function (idRuta) {
    if (this.estado !== 'Disponible') {
        return { success: false, message: 'El chofer no está disponible y no puede ser asignado a una ruta.' };
    }
    else if (this.idRutaActual) {
        return { success: false, message: 'El chofer ya tiene una ruta asignada.' };
    }
    else if (!this.idVehiculoAsignado) {
        return { success: false, message: 'El chofer no tiene un vehículo asignado y no puede ser asignado a una ruta.' };
    }
    else {
        this.idRutaActual = idRuta;
        this.estado = 'Ocupado'; // Cambiamos el estado del chofer a Ocupado al asignarle una ruta
        return { success: true, message: 'Ruta asignada correctamente.' };
    }
}

choferSchema.methods.liberarVehiculo = function () {
    if (!this.idVehiculoAsignado) {
        return { success: false, message: 'El chofer no tiene un vehículo asignado y no puede ser liberado.' };
    }
    if (this.estado === 'Ocupado') {
        return { success: false, message: 'El chofer está en una ruta y no puede liberar su vehículo asignado.' };
    }
    else {
        this.idVehiculoAsignado = null;
        return { success: true, message: 'Vehículo liberado correctamente.' };
    }
}

choferSchema.methods.finalizarRuta = function () {
    if (this.estado !== 'Ocupado') {
        return { success: false, message: 'El chofer no está en una ruta y no puede finalizarla.' };
    }
    else {
        this.idRutaActual = null;
        this.estado = 'Disponible'; // Cambiamos el estado del chofer a Disponible al finalizar la ruta
        return { success: true, message: 'Ruta finalizada correctamente.' };
    }
}

choferSchema.methods.estadoChofer = function () {
    return this.estado;
}

export default model('Chofer', choferSchema);
