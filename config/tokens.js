import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../ErrorControl/Errores.js';

const { JWT_SECRET } = process.env;

// El secreto firma los tokens  para evitar que alguien pueda inventar un token válido. Debe ser largo y secreto, y debe estar solo en el .env
if (!JWT_SECRET) throw new AuthenticationError("Falta configurar JWT_SECRET en el entorno");

export const NOMBRE_COOKIE = 'token';
const DURACION_HORAS = 2;

// Opciones de seguridad de la cookie:
export const opcionesCookieBase = {
    httpOnly: true,     // httpOnly: el JavaScript del navegador no puede leerla, así que un script malicioso no puede robar el token
    sameSite: 'lax',    // sameSite 'lax': el navegador no la envía en peticiones POST que se originan en otros sitios (protege de CSRF)
    secure: process.env.NODE_ENV === 'production'   // secure: en producción solo viaja por HTTPS
};
export const opcionesCookie = {
    ...opcionesCookieBase,
    maxAge: DURACION_HORAS * 60 * 60 * 1000 // misma duración que el token -> Dos horas; por más que el usuario sea dado de baja, el token sigue siendo válido hasta que caduque. Se puede cambiar la duración del token y de la cookie en un solo lugar.
};

// El token lleva el id (sub), el usuario y el rol. Va firmado, pero NO encriptado: no poner datos sensibles.
export function crearToken(usuario) {
    return jwt.sign(
        { usuario: usuario.usuario, rol: usuario.rol },
        JWT_SECRET,
        { subject: String(usuario._id), expiresIn: `${DURACION_HORAS}h` }
    );
}

// Lanza un error si la firma no coincide o si el token venció.
export function leerToken(token) {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}