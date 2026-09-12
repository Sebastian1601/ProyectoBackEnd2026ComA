const { RepositorioJson } = require("./logicaController.js");
const { Pedido } = require('../models/Pedidos.js');

class PedidosController {

    static obtenerPedidos = (req, res) => {
        const repoJson = new RepositorioJson();
        const pedidosRecuperados = repoJson.leerArchivo("pedidos");
        res.json(pedidosRecuperados);
    }

    static obtenerPedido = (req, res) => {
        const repoJson = new RepositorioJson();
        const pedidosRecuperados = repoJson.leerArchivo("pedidos");
        const id = parseInt(req.params.id);
        const pedido = pedidosRecuperados.find(c => c.id === id);

        if (pedido === undefined) {
            return res.status(404).json({
                mensaje: "No existe pedido"
            });
        }
        res.json(pedido);
    }

    static crearPedido = (req, res) => {
        const repoJson = new RepositorioJson();
        const listaPedidos = repoJson.leerArchivo("pedidos");
        const cantPedidos = listaPedidos.length;
        let id = 1;
        if (cantPedidos > 0) {
            id = listaPedidos[cantPedidos - 1].id;
            id++;
        };
        const { cliente, fecha, productos } = req.body;
        console.log("request body:", req.body);
        console.log("variables por separado", id, cliente, fecha, productos);
        const nuevoPedido = new Pedido({
            id,
            cliente,
            fecha,
            productos
    });
        console.log("nueva instancia de pedido", nuevoPedido);

        listaPedidos.push(nuevoPedido);

        repoJson.guardarArchivo("pedidos", listaPedidos);

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });
    };

}

module.exports = {
    PedidosController
}