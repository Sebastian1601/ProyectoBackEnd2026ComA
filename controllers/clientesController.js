import Cliente from '../models/Cliente.js';
import { NotFoundError } from '../ErrorControl/Errores.js';

// Todas las respuestas exitosas siguen el mismo formato: { mensaje, data }.
// Los errores se propagan con next(err) hacia el manejador central de errores.
export class ClientesController {

    static async obtenerClientes(req, res, next) {
        try {
            const listadoClientes = await Cliente
                .find()
                .sort({ createdAt: "desc" })
                .lean();

            res.status(200).json({
                mensaje: "Listado de clientes obtenido correctamente",
                data: listadoClientes
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerUnCliente(req, res, next) {
        try {
            const clienteUnico = await Cliente.findById(req.params.id).lean();

            if (!clienteUnico) {
                throw new NotFoundError("Cliente no encontrado");
            }

            res.status(200).json({
                mensaje: "Cliente obtenido correctamente",
                data: clienteUnico
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearCliente(req, res, next) {
        try {
            const { nombre, telefono, direccion } = req.body;
            const nuevoCliente = new Cliente({ nombre, telefono, direccion });
            const clienteCreado = await nuevoCliente.save();

            res.status(201).json({
                mensaje: "Cliente creado correctamente",
                data: clienteCreado
            });
        } catch (error) {
            next(error);
        }
    };

    static async actualizarCliente(req, res, next) {
        try {
            // Solo se actualizan los campos que vienen en el body (modificación parcial).
            const campos = {};
            for (const campo of ["nombre", "telefono", "direccion"]) {
                if (req.body[campo] !== undefined) {
                    campos[campo] = req.body[campo];
                }
            }

            const clienteActualizado = await Cliente.findByIdAndUpdate(
                req.params.id,
                campos,
                {
                    returnDocument: 'after',
                    runValidators: true,
                    new: true
                }
            );

            if (!clienteActualizado) {
                throw new NotFoundError("Cliente no encontrado");
            }

            res.status(200).json({
                mensaje: "Cliente actualizado correctamente",
                data: clienteActualizado
            });
        } catch (error) {
            next(error);
        }
    };

    static async borrarCliente(req, res, next) {
        try {
            const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);

            if (!clienteEliminado) {
                throw new NotFoundError("Cliente no encontrado");
            }

            res.status(200).json({
                mensaje: "Cliente eliminado correctamente",
                data: clienteEliminado
            });
        } catch (error) {
            next(error);
        }
    };
}
