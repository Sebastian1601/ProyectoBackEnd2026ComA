import { Schema, model } from 'mongoose';

const RutaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    origen: {
        type: String
    },
    destino: {
        type: String
    },
    duracionEstimada: { //es correcto el tipo? o asignamos number?
        type: String
    },
    distanciaEstimada: {
        type: String
    },
    idChoferAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Chofer'
    }
});

RutaSchema.methods.asignarChofer = function (idChofer) {
    if (this.idChoferAsignado) {
        return { success: false, message: 'La ruta ya tiene un chofer asignado.' };
    }
    else {
        this.idChoferAsignado = idChofer;
        return { success: true, message: 'Chofer asignado correctamente a la ruta.' };
    }
};

RutaSchema.methods.liberarChofer = function () {
    if (!this.idChoferAsignado) {
        return { success: false, message: 'La ruta no tiene un chofer asignado y no puede ser liberada.' };
    }
    else {
        this.idChoferAsignado = null;
        return { success: true, message: 'Chofer liberado correctamente de la ruta.' };
    }
};



export default model('Ruta', RutaSchema);

// export class Ruta {
//     constructor({ id, nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado }) {
//         this.id = id;
//         this.nombre = nombre;
//         this.origen = origen;
//         this.destino = destino;
//         this.duracionEstimada = duracionEstimada;
//         this.distanciaEstimada = distanciaEstimada;
//         this.idChoferAsignado = idChoferAsignado;
//     }

//     asignarChofer(idChofer) {
//         if (this.idChoferAsignado) {
//             return { success: false, message: 'La ruta ya tiene un chofer asignado.' };
//         }
//         else {
//             this.idChoferAsignado = idChofer;
//             return { success: true, message: 'Chofer asignado correctamente a la ruta.' };
//         }
//     }

//     liberarChofer() {
//         if (!this.idChoferAsignado) {
//             return { success: false, message: 'La ruta no tiene un chofer asignado y no puede ser liberada.' };
//         }
//         else {
//             this.idChoferAsignado = null;
//             return { success: true, message: 'Chofer liberado correctamente de la ruta.' };
//         }
//     }
// }