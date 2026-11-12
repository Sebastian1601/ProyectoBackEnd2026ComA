import { Producto } from '../models/Producto.js';
import { NotFoundError } from '../ErrorControl/Errores.js';

// Todas las respuestas exitosas siguen el mismo formato: { mensaje, data }.
// Los errores se propagan con next(err) hacia el manejador central de errores.
export class ProductoController {

    static async obtenerProductos(req, res, next) {
        try {
            const productos = await Producto
                .find()
                .sort({ createdAt: "desc" })
                .lean();

            res.status(200).json({
                mensaje: "Listado de productos obtenido correctamente",
                data: productos
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerUnProducto(req, res, next) {
        try {
            const producto = await Producto.findById(req.params.id).lean();

            if (!producto) {
                throw new NotFoundError("Producto no encontrado");
            }

            res.status(200).json({
                mensaje: "Producto obtenido correctamente",
                data: producto
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearProducto(req, res, next) {
        try {
            const { nombre, descripcion, precio, categoria } = req.body;
            const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria });
            const productoCreado = await nuevoProducto.save();

            res.status(201).json({
                mensaje: "Producto creado correctamente",
                data: productoCreado
            });
        } catch (error) {
            next(error);
        }
    };

    static async actualizarProducto(req, res, next) {
        try {
            const productoActualizado = await Producto.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    returnDocument: 'after',
                    runValidators: true,
                    new: true
                }
            ).lean();

            if (!productoActualizado) {
                throw new NotFoundError("Producto no encontrado");
            }

            res.status(200).json({
                mensaje: "Producto actualizado correctamente",
                data: productoActualizado
            });
        } catch (error) {
            next(error);
        }
    };

    static async eliminarProducto(req, res, next) {
        try {
            const productoEliminado = await Producto.findByIdAndDelete(req.params.id).lean();

            if (!productoEliminado) {
                throw new NotFoundError("Producto no encontrado");
            }

            res.status(200).json({
                mensaje: "Producto eliminado correctamente",
                data: productoEliminado
            });
        } catch (error) {
            next(error);
        }
    };
}
