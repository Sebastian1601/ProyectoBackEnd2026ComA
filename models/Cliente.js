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
    // cuil: {
    //     type: Number,
    //     required: true,
    // },
    direccion: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Cliente = model('Cliente', clienteSchema);

async function obtenerClientes() {
    const listadoClientes = await Cliente
        .find()
        .sort({ createdAt: "desc" })
        .lean();
    return listadoClientes;
};

async function obtenerClientePorId(id) {
    const ID = id.toString().trim();
    const clienteUnico = await Cliente.findById(ID).lean();
    console.log(clienteUnico);
    return clienteUnico;
};

async function crearCliente(data) {
    const { nombre, telefono, direccion } = data;
    const nuevoCliente = new Cliente({ nombre, telefono, direccion });
    const clienteCreado = await nuevoCliente.save();
    return clienteCreado;
};

async function actualizarCliente(id, data) {
    const { nombre, telefono, direccion } = data;
    const ID = id.toString().trim();

    if (!ID || !nombre || !telefono || !direccion) {
        throw new Error("existen campos vacíos al actualizar cliente.-");
    };
    const clienteActualizado = await Cliente.findByIdAndUpdate(
        ID,
        { nombre, telefono, direccion },
        {
            returnDocument: true,
            runValidators: true
        }
    );
    return clienteActualizado;
};

async function borrarCliente(id) {
    const ID = id.toString().trim();
    const clienteEliminado = await Cliente.findByIdAndDelete(id);
    return clienteEliminado;
};

export default Cliente;
export {
    borrarCliente,
    actualizarCliente,
    crearCliente,
    obtenerClientePorId,
    obtenerClientes
}