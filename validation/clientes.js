// Validación de los datos de un cliente (alta y modificación).
// Se aplica en routes/routerClientes.js antes de crear y actualizar.

import { validarTexto } from "./helpers.js";

export default function validarCliente(req, res, next) {
    const { nombre, telefono, direccion } = req.body ?? {};

    // En el alta todos los campos son obligatorios; en la modificación
    // solo se validan los campos que efectivamente vengan en el body.
    const esAlta = req.method === "POST";

    validarTexto("nombre", nombre, { requerido: esAlta, min: 3 });
    validarTexto("telefono", telefono, { requerido: esAlta, min: 3 });
    validarTexto("direccion", direccion, { requerido: esAlta, min: 3 });

    next();
}
