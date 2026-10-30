//aca hay que importar los schemas para crear clientes y eso
//const rutaArchivoClientes = path.join(__dirname, '../data/clientes.json');

//importo el modelo cliente de mongoose
import * as cm from '../models/Cliente.js';

async function obtenerClientes(req, res) {
    const listado = await cm.obtenerClientes();
    !listado
        ? res.status(404).json({ data: {}, mensaje: "No existen clientes para listar.-" })
        : res.status(200).json({ data: listado, mensaje: "Listado de clientes obtenido.-" })
};

async function obtenerUnCliente(req, res) {
    const id = req.params.id;
    const clienteObtenido = await cm.obtenerUnCliente(id);
    !clienteObtenido
        ? res.status(404).json({ data: {}, mensaje: "Cliente no encontrado.-" })
        : res.status(201).json({ data: cliente, mensaje: "Cliente encontrado.-" })
};

async function crearCliente(req, res) {
    console.log("peticion de creación de cliente:", req.body);
    const clienteCreado = await cm.crearCliente(req.body);
    !clienteCreado
        ? res.status(500).json({ data: {}, mensaje: "Error al crear nuevo cliente.-" })
        : res.status(201).json({ data: clienteCreado, mensaje: "Exito al crear nuevo cliente.-" })
};

async function actualizarCliente(req, res) {
    const { id } = req.params;
    const clienteActualizado = await cm.actualizarCliente(id, req.body);
    !clienteActualizado
        ? res.status(404).json({
            data: {},
            mensaje: "Cliente no encontrado"
        })
        : res.status(201).json({
            data: clienteActualizado,
            mensaje: "Cliente actualizado correctamente",
        });
};

async function borrarCliente(req, res) {
    const { id } = req.params;
    const clienteEliminado = await cm.borrarCliente(id);
    !clienteEliminado
        ? res.status(404).json({
            data: {},
            mensaje: "Cliente no encontrado"
        })
        : res.status(200).json({
            data: clienteEliminado,
            mensaje: "Cliente eliminado correctamente"
        })
};

export {
    obtenerClientes,
    obtenerUnCliente,
    crearCliente,
    actualizarCliente,
    borrarCliente
};