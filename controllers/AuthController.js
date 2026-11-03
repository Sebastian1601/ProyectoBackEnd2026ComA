import Usuario from '../models/Usuario.js';
import { verificarClave } from '../config/claves.js';
import { crearToken, NOMBRE_COOKIE, opcionesCookie, opcionesCookieBase } from '../config/tokens.js';

export class Autenticacion {
 
    static async validarUsuario(req, res) {
        const { user, contra } = req.body ?? {};
 
        // Solo se aceptan textos. Si llegara un objeto (por ejemplo { "$ne": null }), para evitar las inyecciones de MongoDB, se rechaza.
        if (typeof user !== 'string' || typeof contra !== 'string') {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }
 
        const usuario = await Usuario.findOne({ usuario: user });
 
        // Siempre el mismo mensaje, para no revelar si el usuario existe o si fue la clave lo que falló
        if (!usuario || !usuario.activo || !(await verificarClave(contra, usuario.claveHash))) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        res.cookie(NOMBRE_COOKIE, crearToken(usuario), opcionesCookie);
 
        return res.status(200).json({
            message: "Usuario Autorizado",
            usuario: usuario.usuario,
            rol: usuario.rol
        });
    }

    static cerrarSesion(req, res) {
        res.clearCookie(NOMBRE_COOKIE, opcionesCookieBase);
        res.status(200).json({ message: "Sesión cerrada" });
    }
}