import Pedido from '../models/Pedidos.js';

export class PedidosController {

    static obtenerPedidos = async (req, res) => {
        const pedidos = await Pedido.find().populate('idCliente');
        res.json(pedidos);
    };

    static obtenerPedido = async (req, res) => {
        const pedido = await Pedido.findById(req.params.id).populate('idCliente');
        if (!pedido) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }
        res.json(pedido);
    };

    static crearPedido = async (req, res) => {
        const { idCliente, cliente, fecha, productos, estado } = req.body;
        const clienteId = idCliente || cliente;

        const nuevoPedido = new Pedido({
            idCliente: clienteId,
            fecha: fecha || Date.now(),
            productos,
            estado: estado || "Pendiente"
        });

        await nuevoPedido.save();
        await nuevoPedido.populate('idCliente');

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });
    };

    static modificarPedido = async (req, res) => {
        const { idCliente, cliente, fecha, productos, estado } = req.body;
        const camposActualizar = {};

        if (idCliente || cliente) camposActualizar.idCliente = idCliente || cliente;
        if (fecha !== undefined) camposActualizar.fecha = fecha;
        if (productos !== undefined) camposActualizar.productos = productos;
        if (estado !== undefined) camposActualizar.estado = estado;

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id,
            camposActualizar,
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate('idCliente');

        if (!pedidoActualizado) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }

        res.json({
            mensaje: "Pedido modificado correctamente",
            pedido: pedidoActualizado
        });
    };

    static borrarPedido = async (req, res) => {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedidoEliminado) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }

        res.json({
            mensaje: "Pedido eliminado correctamente"
        });
    };
}
