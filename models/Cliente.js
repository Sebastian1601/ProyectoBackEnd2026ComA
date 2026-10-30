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
});

const Cliente = model('Cliente', clienteSchema);

async function obtenerClientes() {
    const listadoClientes = await Cliente.find().lean();
    return listadoClientes;
};

async function obtenerClientePorId(id) {
    const ID = id.toString().trim();
    const clienteUnico = await Cliente.findById(ID);
    return clienteUnico;
};

async function crearCliente(data) {
    const { nombre, telefono, direccion } = data;
    console.log(`${nombre} - ${telefono} - ${direccion}.-`);
    const nuevoCliente = new Cliente({ nombre, telefono, direccion });
    console.log("nuevo Cliente a crear:", nuevoCliente);
    const clienteCreado = await nuevoCliente.save();
    console.log("cliente creado:", clienteCreado);
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