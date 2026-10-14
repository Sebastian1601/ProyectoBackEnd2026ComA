import mongoose from "mongoose";
import { ValidationError } from "../ErrorControl/Errores.js";

const estadosValidos = ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'];

const validarDatosPedido = (req, res, next) => {
    const propiedadesValidas = [
        "idCliente",
        "cliente",
        "fecha",
        "productos",
        "estado"
    ];
    const datos = req.body;

    const propiedadesAEvaluar = Object.keys(datos);

    const propiedadesInvalidas = propiedadesAEvaluar.filter(prop => !propiedadesValidas.includes(prop));

    if (propiedadesInvalidas.length > 0) {
        throw new ValidationError("Existen propiedades que no corresponden a un pedido en la request.", propiedadesInvalidas);
    }

    const idCliente = datos.idCliente || datos.cliente;

    if (!idCliente) {
        throw new ValidationError("Debe proporcionar idCliente", "idCliente");
    }

    if (typeof idCliente !== "string" || !mongoose.Types.ObjectId.isValid(idCliente)) {
        throw new ValidationError("El idCliente debe ser un identificador válido de MongoDB", "idCliente");
    }

    if (datos.fecha !== undefined && typeof datos.fecha !== "string" && !(datos.fecha instanceof Date)) {
        throw new ValidationError("La fecha debe ser un texto o formato de fecha válido", "fecha");
    }

    if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
        throw new ValidationError("La lista de productos debe ser un Array con al menos un producto", "productos");
    }

    if (datos.estado !== undefined && !estadosValidos.includes(datos.estado)) {
        throw new ValidationError(`Estado inválido. Los estados permitidos son: ${estadosValidos.join(', ')}`, "estado");
    }

    next();
};

export default validarDatosPedido;