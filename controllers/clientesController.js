const fs = require('fs');
const path = require('path');

const Cliente = require('../models/Cliente');

const rutaArchivoClientes = path.join(__dirname, '../data/clientes.json');

class ClienteController {
    //funciona  
    static #leerClientes = () => {
        const data = fs.readFileSync(rutaArchivoClientes, 'utf-8');
        return JSON.parse(data);
    };

    static obtenerClientes = (req, res) => {
        const clientes = this.#leerClientes();
        res.json(clientes);
    };

    static obtenerClientePorId = (req, res) => {
        const clientes = this.#leerClientes();
        const id = parseInt(req.params.id);
        const cliente = clientes.find(c => c.id === id);

        if (cliente === undefined) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(cliente);
    };

    static guardarClientes = (clientes) => {
        fs.writeFileSync(rutaArchivoClientes, JSON.stringify(clientes, null, 2));
        res.status(200);
        res.send({ status: ok, message: "Cliente agregado con éxito." });
    };



    static #crearCliente = (req, res) => {
        const clientes = this.#leerClientes();
        let id = 1;
        if(clientes.length > 0) id = clientes[length - 1].id;
        id++;

        const { nombre, telefono, direccion } = req.body;
        const nuevoCliente = new Cliente(id, nombre, telefono, direccion);
        clientes.push(nuevoCliente);
        guardarClientes(clientes);
        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            cliente: nuevoCliente
        });
    };

    static actualizarCliente = (req, res) => {
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

    static borrarCliente = (req, res) => {
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

}

module.exports = {
    ClienteController
}