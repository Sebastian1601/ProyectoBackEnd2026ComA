// Validación de los datos de un chofer (alta y modificación).
// Se aplica en routes/routerChoferes.js antes de crear y actualizar.

import Chofer from "../models/Chofer.js";
import { validarTexto, validarEnum, validarFecha } from "./helpers.js";

const ESTADOS = Chofer.schema.path("estado").enumValues;

export default function validarChofer(req, res, next) {
    const { nombre, apellido, dni, numeroRegistro, telefono, estado, fechaIngreso } = req.body ?? {};
    const esAlta = req.method === "POST";

    validarTexto("nombre", nombre, { requerido: esAlta, min: 2 });
    validarTexto("apellido", apellido, { requerido: esAlta, min: 2 });
    validarTexto("dni", dni, { requerido: esAlta, min: 7 });
    validarTexto("numeroRegistro", numeroRegistro, { requerido: esAlta, min: 3 });
    validarTexto("telefono", telefono, { requerido: esAlta, min: 3 });
    validarEnum("estado", estado, ESTADOS, { requerido: false });
    validarFecha("fechaIngreso", fechaIngreso, { requerido: esAlta });

    next();
}
