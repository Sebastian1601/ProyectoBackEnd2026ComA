//funcion que no envía mensajes de error textuales al front. simplemente indica un error en servidor.
//si es un error de tipo validation, se expresa el mensaje de error del mismo y se envia el campo 
// que no cumple las condiciones evaluadas
function manejadorDeErrores(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ error: err.message, campo: err.campo });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}


class ValidationError extends Error {
    constructor(mensaje, campo = null) {
        super(mensaje)
        this.name = 'ValidationError',
            this.statusCode = 400,
            this.campo = campo
    }
}

module.exports = {
    manejadorDeErrores,
    ValidationError
}