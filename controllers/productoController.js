import * as pm from '../models/Producto.js';


export const obtenerProductos = async (req, res) => {
    const listaProductos = await pm.obtenerProductos();
    if (listaProductos.length < 1) return res.status(200).json({ message: "No existen productos a mostrar" });
    return res.status(200).json({ productos: listaProductos });
};

export const obtenerUnProducto = async (req, res) => {
    const { id } = req.params;
    const producto = await pm.obtenerUnProducto(id);

    if (!producto) return res.status(404).json({
        message: "No se encontró producto con la id indicada",
        campo: id
    });
    return res.status(200).json({ producto });
};

export const crearProducto = async (req, res) => {
    const { producto } = req.body;
    const productoCreado = await pm.crearProducto(producto);
    return res.status(200).json({
        message: 'producto creado',
        producto: productoCreado
    });
};
