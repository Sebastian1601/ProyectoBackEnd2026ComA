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
        const nuevoPedido = new Pedido({
            id,
            cliente,
            fecha,
            productos
        });
        listaPedidos.push(nuevoPedido);
        repoJson.guardarArchivo("pedidos", listaPedidos);

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });
    };

    static modificarPedido = (req, res) => {
        const idABuscar = parseInt(req.params.id);
        const repoJson = new RepositorioJson();
        const listaPedidos = repoJson.leerArchivo("pedidos");
        const idPedido = listaPedidos.findIndex(pedido => pedido.id === idABuscar);
        if (idPedido === -1) throw new ValidationError("El pedido no existe.");
        const pedidoEstructurado = new Pedido(listaPedidos[idPedido]);

        const datos = req.body;//aqui deben llegar los datos normalizados a modificar gracias a un middleware en la request(verifica que a lo mucho, cada campo que viene del front, tiene las propiedades correctas)
        for (const [prop, valor] of Object.entries(datos)) {
            pedidoEstructurado[prop] = valor;
        }
        listaPedidos[idPedido] = {
            ...pedidoEstructurado
        }
        repoJson.guardarArchivo("pedidos", listaPedidos);
        res.json({
            mensaje: "Pedido modificado correctamente.",
            pedido: pedidoEstructurado
        });
    };
}

module.exports = {
    PedidosController
}