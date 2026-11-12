// Validación de los datos de un producto (alta y modificación).
// Se aplica en routes/routerProductos.js antes de crear y actualizar.

import { Producto } from "../models/Producto.js";
import { validarTexto, validarNumero, validarEnum } from "./helpers.js";

// Se leen del esquema para no duplicar la lista de categorías en el proyecto.
const CATEGORIAS = Producto.schema.path("categoria").enumValues;

export default function validarProducto(req, res, next) {
    const { nombre, descripcion, precio, categoria } = req.body ?? {};
    const esAlta = req.method === "POST";

    validarTexto("nombre", nombre, { requerido: esAlta, min: 4 });
    validarTexto("descripcion", descripcion, { requerido: false });
    validarNumero("precio", precio, { requerido: false, min: 0 });
    validarEnum("categoria", categoria, CATEGORIAS, { requerido: false });

    next();
}
