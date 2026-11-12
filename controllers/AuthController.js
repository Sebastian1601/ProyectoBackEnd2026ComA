import Usuario from '../models/Usuario.js';
import { verificarClave } from '../config/claves.js';
import { crearToken, NOMBRE_COOKIE, opcionesCookie, opcionesCookieBase } from '../config/tokens.js';
import { AuthenticationError } from '../ErrorControl/Errores.js';

export class Autenticacion {

    static async validarUsuario(req, res, next) {
        try {
            const { user, contra } = req.body ?? {};

            // Solo se aceptan textos. Si llegara un objeto (por ejemplo { "$ne": null }), se rechaza.
            if (typeof user !== 'string' || typeof contra !== 'string') {
                throw new AuthenticationError("Credenciales incorrectas");
            };

            const usuario = await Usuario.findOne({ usuario: user });

            // Siempre el mismo mensaje, para no revelar si el usuario existe o si fue la clave la que falló
            if (!usuario || !usuario.activo || !(await verificarClave(contra, usuario.claveHash))) {
                throw new AuthenticationError("Credenciales incorrectas");
            };

            res.cookie(NOMBRE_COOKIE, crearToken(usuario), opcionesCookie);

            res.status(200).json({
                mensaje: "Usuario Autorizado",
                data: {
                    usuario: usuario.usuario,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static cerrarSesion(req, res, next) {
        try {
            res.clearCookie(NOMBRE_COOKIE, opcionesCookieBase);

            res.status(200).json({
                mensaje: "Sesión cerrada",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
}
