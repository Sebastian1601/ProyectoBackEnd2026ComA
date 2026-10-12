

class Autenticacion {

    static validarUsuario(req, res) {
        const { user, contra } = req.body;
        if (user !== "admin" || contra !== "123") {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        };
        return res.status(200).json({
            message:"Usuario Autorizado"
        });
    }
}


module.exports = Autenticacion; 