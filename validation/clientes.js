//generar la validacion de datos, como nombre, direccion, y demas
import { ValidationError } from "../ErrorControl/Errores.js";

export default function ValidarString(req, res, next) {
    const { nombre, telefono, direccion } = req.body;

    if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({ message: "El nombre es obligatorio y debe tener al menos 3 caracteres" });
    }
    if (!telefono || telefono.trim().length < 3) {
        return res.status(400).json({ message: "El teléfono es obligatorio y debe tener al menos 3 caracteres" });
    }
    if (!direccion || direccion.trim().length < 3) {
        return res.status(400).json({ message: "La dirección es obligatoria y debe tener al menos 3 caracteres" });
    }

    next();
}