//generar la validacion de datos, como nombre, direccion, y demas
import { ValidationError } from "../ErrorControl/Errores.js";

export default function ValidarString(req, res, next) {
    let valores = Object.values(req.body);
    console.log(valores);
    for (const value of valores) {
        if(typeof value !== "string") throw new ValidationError("Un valor ingresado no es una cadena.", value);

        let cadena = String(value).trim();
        
        if (cadena === "" || cadena.length < 3) throw new ValidationError("Un valor enviado tiene menos de 3 caracteres", value);
    };
    
    next();
}
