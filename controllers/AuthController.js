import Usuario from '../models/Usuario.js';

export class Autenticacion {

    static async validarUsuario(req, res) {
        const { user, contra } = req.body;

        const userExiste = await Usuario
            .findOne({ usuario: user });

        console.log(userExiste);

        if (!userExiste || userExiste.claveHash !== contra) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        };

        return res.status(200).json({
            message: "Usuario Autorizado"
        });
    }
}

