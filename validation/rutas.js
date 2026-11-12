// Validación de los datos de una ruta (alta y modificación).
// Se aplica en routes/routerRutas.js antes de crear y actualizar.

import { validarTexto, validarNumero } from "./helpers.js";

export default function validarRuta(req, res, next) {
    const { nombre, origen, destino, duracionEstimada, distanciaEstimada } = req.body ?? {};
    const esAlta = req.method === "POST";

    validarTexto("nombre", nombre, { requerido: esAlta, min: 3 });
    validarTexto("origen", origen, { requerido: false, min: 2 });
    validarTexto("destino", destino, { requerido: false, min: 2 });
    validarNumero("duracionEstimada", duracionEstimada, { requerido: false, min: 0 });
    validarNumero("distanciaEstimada", distanciaEstimada, { requerido: false, min: 0 });

    next();
}
