const fs = require('fs');
const path = require('path');

const Cliente = require('../models/Cliente');

const rutaArchivoClientes = path.join(__dirname, '../data/clientes.json');

const leerClientes = () => {
    const data = fs.readFileSync(rutaArchivoClientes, 'utf-8');
    return JSON.parse(data);
};

const guardarClientes = (clientes) => {
    fs.writeFileSync(rutaArchivoClientes, JSON.stringify(clientes, null, 2));
};

const obtenerClientes = (req, res) => {
    const clientes = leerClientes();
    res.json(clientes);
};

const obtenerClientePorId = (req, res) => {
    const clientes = leerClientes();
    const id = parseInt(req.params.id);
    const cliente = clientes.find(c => c.id === id);

    if (clienteIndex === -1) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    res.json(cliente);
};

const crearCliente = (req, res) => {
    const clientes = leerClientes();
    const { id, nombre, telefono, direccion } = req.body;
    const nuevoCliente = { id, nombre, telefono, direccion };
    clientes.push(nuevoCliente);
    guardarClientes(clientes);
    res.status(201).json({
        mensaje: "Cliente creado correctamente",
        cliente: nuevoCliente
    });
};

const actualizarCliente = (req, res) => {
    const clientes = leerClientes();
    const id = parseInt(req.params.id);
    const clienteIndex = clientes.findIndex(c => c.id === id);

    if (clienteIndex === -1) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    const { nombre, telefono, direccion } = req.body;
    clientes[clienteIndex] = { ...clientes[clienteIndex], nombre, telefono, direccion };

    guardarClientes(clientes);

    res.json({
        mensaje: "Cliente actualizado correctamente",
        cliente: clientes[clienteIndex]
    });
};

const borrarCliente = (req, res) => {
    const clientes = leerClientes();
    const id = parseInt(req.params.id);
    const clienteIndex = clientes.findIndex(c => c.id === id);

    if (clienteIndex === -1) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    clientes.splice(clienteIndex, 1);
    guardarClientes(clientes);

    res.json({
        mensaje: "Cliente eliminado correctamente"
    });
};
