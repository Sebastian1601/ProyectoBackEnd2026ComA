import { Schema, model } from 'mongoose';

const clienteSchema = new Schema({
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
    cuil:{
        type:Number,
        required:true,
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    }
});

const Cliente = model('Cliente', clienteSchema);

export default Cliente;

// export class Cliente {
//     constructor({ id, nombre, telefono, direccion }) {
//         this.id = id;
//         this.nombre = nombre;
//         this.telefono = telefono;
//         this.direccion = direccion;
//     }
// }
