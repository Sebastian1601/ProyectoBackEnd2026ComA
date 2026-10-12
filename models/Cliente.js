import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;

// export class Cliente {
//     constructor({ id, nombre, telefono, direccion }) {
//         this.id = id;
//         this.nombre = nombre;
//         this.telefono = telefono;
//         this.direccion = direccion;
//     }
// }
