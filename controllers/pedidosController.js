import Pedido from '../models/Pedidos.js';
import { NotFoundError } from '../ErrorControl/Errores.js';

// Todas las respuestas exitosas siguen el mismo formato: { mensaje, data }.
// Los errores se propagan con next(err) hacia el manejador central de errores.
export class PedidosController {

    static async obtenerPedidos(req, res, next) {
        try {
            const pedidos = await Pedido.find().populate('idCliente');

            res.status(200).json({
                mensaje: "Listado de pedidos obtenido correctamente",
                data: pedidos
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerPedido(req, res, next) {
        try {
            const pedido = await Pedido.findById(req.params.id).populate('idCliente');

            if (!pedido) {
                throw new NotFoundError("Pedido no encontrado");
            }

            res.status(200).json({
                mensaje: "Pedido obtenido correctamente",
                data: pedido
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearPedido(req, res, next) {
        try {
            const { idCliente, cliente, fecha, productos, estado } = req.body;

            const nuevoPedido = new Pedido({
                idCliente: idCliente || cliente,
                fecha: fecha || Date.now(),
                productos,
                estado: estado || "Pendiente"
            });

            await nuevoPedido.save();
            await nuevoPedido.populate('idCliente');

            res.status(201).json({
                mensaje: "Pedido creado correctamente",
                data: nuevoPedido
            });
        } catch (error) {
            next(error);
        }
    };

    static async modificarPedido(req, res, next) {
        try {
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
                throw new NotFoundError("Pedido no encontrado");
            }

            res.status(200).json({
                mensaje: "Pedido modificado correctamente",
                data: pedidoActualizado
            });
        } catch (error) {
            next(error);
        }
    };

    static async borrarPedido(req, res, next) {
        try {
            const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

            if (!pedidoEliminado) {
                throw new NotFoundError("Pedido no encontrado");
            }

            res.status(200).json({
                mensaje: "Pedido eliminado correctamente",
                data: pedidoEliminado
            });
        } catch (error) {
            next(error);
        }
    };
}
