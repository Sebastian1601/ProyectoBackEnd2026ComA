// funcion que no envía mensajes de error textuales al front. simplemente indica un error en servidor.
// si es un error de tipo validation, se expresa el mensaje de error del mismo y se envia el campo 
// que no cumple las condiciones evaluadas

import mongoose from 'mongoose';

export function manejadorDeErrores(err, req, res, next) {
    // Validamos middleware de validación de datos fuera de Mongoose
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ error: err.message, campo: err.campo });
    }
    // Validamos schemas de Mongoose
    if (err instanceof mongoose.Error.ValidationError) {
        const detalles = Object.values(err.errors).map(e => {
            let mensaje = e.message;
            if (e.name === 'CastError') {
                if (e.kind === 'Number') {
                    mensaje = 'El valor ingresado debe ser un número válido.';
                } else if (e.kind === 'ObjectId') {
                    mensaje = 'El identificador proporcionado no tiene un formato válido.';
                } else {
                    mensaje = 'El valor ingresado no tiene un formato válido.';
                }
            }
            return { campo: e.path, mensaje };
        });
        return res.status(400).json({ error: 'Error de validación', detalles });
    }
    // Validamos IDs con formato inválido (CastError) de Mongoose en parámetros de ruta
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ error: `Valor o identificador inválido para el campo ${err.path}`, campo: err.path });
    }
    // Validamos índices duplicados (error de clave única) de Mongo
    if (err.code === 11000) {
        const campoDuplicado = Object.keys(err.keyValue ?? {})[0] ?? null;
        return res.status(409).json({ error: `El valor para el campo ${campoDuplicado} ya existe en la base de datos.`, campo: campoDuplicado });
    }
    // Si falla cualquier otra cosa, devolvemos un error genérico de servidor
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
};


export class ValidationError extends Error {
    constructor(mensaje, campo = null) {
        super(mensaje)
        this.name = 'ValidationError',
        this.statusCode = 400,
        this.campo = campo
    }
};

export class DBConnectionError extends Error {
    constructor(men, campo = null) {
        super(men)
        this.name = 'DBConnectionError',
        this.statusCode = 503,
        this.campo = campo
    }
};

export class AuthenticationError extends Error {
    constructor(men, campo = null) {
        super(men);
        this.name = 'AuthenticationError',
        this.statusCode = 401,
        this.campo = campo
    }
};