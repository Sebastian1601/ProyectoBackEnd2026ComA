import { NOMBRE_COOKIE, leerToken } from '../config/tokens.js';

// Devuelve los datos del token (usuario y rol) o null si no hay cookie o el token no es válido o venció.
function datosDeSesion(req) {
    const token = req.cookies?.[NOMBRE_COOKIE];
    if (!token) return null;

    try {
        return leerToken(token);
    } catch {
        return null;
    }
}

export function autenticar(req, res, next) {
    const sesion = datosDeSesion(req);
    if (!sesion) {
        return res.status(401).json({ error: "Necesitás iniciar sesión" });
    }
    req.usuario = sesion;
    next();
}

// Para las páginas Pug: sin sesión válida redirige al login.
export function autenticarPagina(req, res, next) {
    const sesion = datosDeSesion(req);
    if (!sesion) {
        return res.redirect("/");
    }
    req.usuario = sesion;
    next();
}

const METODOS_DE_LECTURA = ['GET', 'HEAD', 'OPTIONS'];

// Autorización por rol
export const autorizarEscritura = (...rolesPermitidos) => (req, res, next) => {
    if (METODOS_DE_LECTURA.includes(req.method)) return next();

    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ error: "No tenés permiso para realizar esta acción" });
    }
    next();
};