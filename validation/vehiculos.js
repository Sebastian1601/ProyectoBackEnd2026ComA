// Validación de los datos de un vehículo (alta y modificación).
// Se aplica en routes/routerVehiculos.js antes de crear y actualizar.

import Vehiculo from "../models/Vehiculo.js";
import { validarTexto, validarEnum, validarObjectId } from "./helpers.js";

const CAPACIDADES = Vehiculo.schema.path("capacidad").enumValues;
const ESTADOS = Vehiculo.schema.path("estado").enumValues;

export default function validarVehiculo(req, res, next) {
    const { patente, marca, modelo, capacidad, estado, idChoferAsignado } = req.body ?? {};
    const esAlta = req.method === "POST";

    validarTexto("patente", patente, { requerido: esAlta, min: 3 });
    validarTexto("marca", marca, { requerido: esAlta, min: 2 });
    validarTexto("modelo", modelo, { requerido: esAlta, min: 2 });
    validarEnum("capacidad", capacidad, CAPACIDADES, { requerido: false });
    validarEnum("estado", estado, ESTADOS, { requerido: false });
    validarObjectId("idChoferAsignado", idChoferAsignado, { requerido: false });

    next();
}
