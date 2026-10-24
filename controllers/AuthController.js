import Usuario from '../models/Usuario.js';

export class Autenticacion {

    static async validarUsuario(req, res) {
        const { user, contra } = req.body;
        const userNormalizado = user.trim().toString();
        const contraNormalizado = contra.trim().toString();

        if(userNormalizado.length < 4 || contraNormalizado.length < 4){
            return res.status(401).json({
                message:"Credenciales no cumplen la politica de seguridad"
            });
        };

        const userExiste = await Usuario
            .findOne({ usuario: userNormalizado }).lean();

        console.log(userNormalizado, contraNormalizado);
        console.log(userExiste);

        if (!userExiste || userExiste.claveHash !== contraNormalizado) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        };

        return res.status(200).json({
            message: "Usuario Autorizado"
        });
    }
}

