// Validación de los datos de un pedido (alta y modificación).
// Se aplica en routes/routerPedidos.js para POST y PUT.

import { ValidationError } from "../ErrorControl/Errores.js";
import { validarObjectId, validarEnum, validarFecha } from "./helpers.js";

const estadosValidos = ["Pendiente", "En Proceso", "Completada", "Cancelada"];
const propiedadesValidas = ["idCliente", "cliente", "fecha", "productos", "estado"];

// Cuerpo admitido para un pedido.
export default function validarPedido(req, res, next) {
    const datos = req.body ?? {};

    // 1. Solo se aceptan propiedades que correspondan a un pedido.
    const propiedadesInvalidas = Object.keys(datos).filter(propiedad => !propiedadesValidas.includes(propiedad));
    if (propiedadesInvalidas.length > 0) {
        throw new ValidationError(
            "Existen propiedades que no corresponden a un pedido en la request.",
            propiedadesInvalidas
        );
    }

    const esAlta = req.method === "POST";

    // 2. idCliente: obligatorio en el alta; si viene en una modificación, debe ser válido.
    const idCliente = datos.idCliente ?? datos.cliente;
    if (esAlta) {
        validarObjectId("idCliente", idCliente, { requerido: true });
    } else if (idCliente !== undefined) {
        validarObjectId("idCliente", idCliente, { requerido: false });
    }

    // 3. productos: obligatorio y no vacío en el alta; si viene, debe ser un array con elementos.
    if (esAlta || datos.productos !== undefined) {
        if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
            throw new ValidationError(
                "La lista de productos debe ser un Array con al menos un producto.",
                "productos"
            );
        }
    }

    // 4. estado y fecha: se validan únicamente si vienen presentes.
    validarEnum("estado", datos.estado, estadosValidos, { requerido: false });
    validarFecha("fecha", datos.fecha, { requerido: false });

    next();
}
