import * as pm from '../models/Producto.js';


export const obtenerProductos = async (req, res) => {
    const listaProductos = await pm.obtenerProductos();
    listaProductos.length < 1
        ? res.status(200).json({ data: {}, mensaje: "No existen productos a mostrar.-" })
        : res.status(200).json({ data: listaProductos, mensaje: "Listado emitido.-" });
};

export const obtenerUnProducto = async (req, res) => {
    const { id } = req.params;
    const productoEncontrado = await pm.obtenerUnProducto(id);

    !productoEncontrado
        ? res.status(404).json({ message: "No se encontró producto.-", data: {} })
        : res.status(200).json({ mensaje: "Producto encontrado", data: productoEncontrado });
};

export const crearProducto = async (req, res) => {
    const producto  = req.body;
    const productoCreado = await pm.crearProducto(producto);
    !productoCreado
        ? res.status(400).json({
            mensaje: "Los datos del producto no son corretos o faltan datos. verifique",
            data: {}
        })
        : res.status(200).json({
            mensaje: 'Producto creado exitosamente',
            data: productoCreado
        });
};

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const productoActualizado = await pm.actualizarProducto(id, req.body);
    !productoActualizado
        ? res.status(400).json({
            mensaje: "error al actualizar producto.-",
            data: {}
        })
        : res.status(200).json({
            mensaje: 'producto actualizado correctamente',
            data: productoActualizado
        });
};

export const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    const exitoAlEliminar = await pm.eliminarProducto(id);
    exitoAlEliminar
        ? res.status(200).end()
        : res.status(500).json({ mensaje: "No se pudo eliminar el producto seleccionado" });
}