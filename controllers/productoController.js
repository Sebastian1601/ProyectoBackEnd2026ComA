import * as pm from '../models/Producto.js';


export const obtenerProductos = async (req, res) => {
    const listaProductos = await pm.obtenerProductos();
    if (listaProductos.length < 1) return res.status(200).json({ message: "No existen productos a mostrar" });
    return res.status(200).json({ productos: listaProductos });
};

export const obtenerUnProducto = async (req, res) => {
    const { id } = req.params;
    const productoEncontrado = await pm.obtenerUnProducto(id);

    if (!productoEncontrado) return res.status(404).json({
        message: "No se encontró producto con la id indicada",
        campo: id
    });

    return res.status(200).json(productoEncontrado);
};

export const crearProducto = async (req, res) => {
    const { producto } = req.body;
    try {
        const respuesta = await pm.crearProducto(producto);
        return res.status(200).json({
            message: 'producto creado correctamente',
            producto: respuesta
        });
    } catch (error) {
        return res.status(400).json({ message: "Los datos del producto no son corretos o faltan datos. verifique" });
    }
};

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const productoActual = await pm.obtenerUnProducto(id);
    if (!productoActual) return res.status(404).json({
        message: "No se encontró el producto a modificar",
        campo: id
    });
    const { producto } = req.body;
    const productoActualizado = await pm.actualizarProducto(id, producto);
    if (productoActualizado) return res.status(200).json({ message: 'producto actualizado correctamente', productoActualizado });
};