const fs = require('fs');
const path = require('path');

const { RepositorioJson } = require("./logicaController");
const { Cliente } = require('../models/Cliente');

//const rutaArchivoClientes = path.join(__dirname, '../data/clientes.json');

class ClienteController {

    static obtenerClientes = (req, res) => {
        const repoJson = new RepositorioJson();
        const clientesRecuperados = repoJson.leerArchivo("clientes");
        res.json(clientesRecuperados);
    };

    static obtenerClientePorId = (req, res) => {
        const repoJson = new RepositorioJson();
        const clientesRecuperados = repoJson.leerArchivo("clientes");
        const id = parseInt(req.params.id);
        const cliente = clientesRecuperados.find(c => c.id === id);

        if (cliente === undefined) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(cliente);
    };

    // static #guardarClientes = (clientes) => {
    //     fs.writeFileSync(rutaArchivoClientes, JSON.stringify(clientes, null, 2));
    // };



    static crearCliente = (req, res) => {
        const repoJson = new RepositorioJson();
        const clientesRecuperados = repoJson.leerArchivo("clientes");
        const cantClientes = clientesRecuperados.length;

        let id = 1;
        if (cantClientes > 0) {
            id = clientesRecuperados[cantClientes - 1].id;
            id++;
        };

        const { nombre, telefono, direccion } = req.body;

        const nuevoCliente = new Cliente({
            id,
            nombre,
            telefono,
            direccion
        });

        clientesRecuperados.push(nuevoCliente);

        repoJson.guardarArchivo("clientes", clientesRecuperados);

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            cliente: nuevoCliente
        });
    };

    static actualizarCliente = (req, res) => {
        // const clientes = this.#leerClientes();
        const repoJson = new RepositorioJson();
        const clientesRecuperados = repoJson.leerArchivo("clientes");
        const id = parseInt(req.params.id);
        const clienteIndex = clientesRecuperados.findIndex(c => c.id === id);
        const clienteAModificar = clientesRecuperados[clienteIndex];

        if (clienteIndex === undefined) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        };
        const datos = req.body;

        for (const [prop, valor] of Object.entries(datos)) {
            clienteAModificar[prop] = valor;
        };

        // this.#guardarClientes(clientes);
        repoJson.guardarArchivo("clientes", clientesRecuperados);
        res.json({
            mensaje: "Cliente actualizado correctamente",
            cliente: clientesRecuperados[clienteIndex]
        });
    };

    static borrarCliente = (req, res) => {
        const repoJson = new RepositorioJson();
        const clientes = repoJson.leerArchivo("clientes");
        
        const id = parseInt(req.params.id);
        const clienteIndex = clientes.findIndex(c => c.id === id);

        if (clienteIndex === -1) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }
        clientes.splice(clienteIndex, 1);
        repoJson.guardarArchivo("clientes", clientes);

        res.json({
            mensaje: "Cliente eliminado correctamente"
        });
    };

}

module.exports = {
    ClienteController
}