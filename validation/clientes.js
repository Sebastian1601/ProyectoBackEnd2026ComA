//generar la validacion de datos, como nombre, direccion, y demas
import { ValidationError } from "../ErrorControl/Errores.js";

export default function ValidarString(req, res, next) {
    let valores = Object.values(req.body);
    console.log("validacion de valores desde middleware:", valores);

    for (const value of valores) {
        let cadena = String(value).trim();
        if (cadena === "" || cadena.length < 3) {
            return res.status(400).json({
                message: "Un valor enviado tiene menos de 3 caracteres",
                valor: value
            });
        }
    };
    next();
}
