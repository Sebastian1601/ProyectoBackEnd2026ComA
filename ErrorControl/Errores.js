function manejadorDeErrores(err, req, res, next){
    if (err instanceof ValidationError){
        return res.status(err.statusCode).json({error: err.message, campo: err.campo});
    }
    console.error(err);
    res.status(500).json({error: 'Error interno del servidor'});
}


class ValidationError extends Error{
    constructor(mensaje, campo = null){
        super(mensaje)
        this.name = 'ValidationError',
        this.statusCode = 500,
        this.campo = campo
    }
}

module.exports = {
    manejadorDeErrores,
    ValidationError
}