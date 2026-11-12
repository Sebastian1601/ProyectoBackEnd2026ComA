// Manejo centralizado de errores.
//
// Todo error que llegue a `manejadorDeErrores` se responde en formato JSON:
//     { "error": "mensaje", "campo": "..." }   (el campo solo cuando corresponde)
//
// Se distinguen tres grupos:
//   1. Errores propios de la aplicación (AppError): responden con el statusCode
//      que cada clase tiene asignado (400, 401, 403, 404, 409, 503).
//   2. Errores de validación de Mongoose (schema, cast de IDs, clave duplicada).
//   3. Cualquier otro error: 500 genérico, sin filtrar detalles internos al cliente.

import mongoose from 'mongoose';

// Clase base de los errores de negocio de la aplicación.
export class AppError extends Error {
    constructor(mensaje, statusCode = 500, campo = null) {
        super(mensaje);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.campo = campo;
    }
}

// 400: los datos recibidos no son válidos (middleware de validación o schema).
export class ValidationError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 400, campo);
    }
}

// 401: no hay sesión válida, o las credenciales no son correctas.
export class AuthenticationError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 401, campo);
    }
}

// 403: la sesión es válida pero el rol no tiene permiso para la operación.
export class AuthorizationError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 403, campo);
    }
}

// 404: el recurso solicitado no existe en la base de datos.
export class NotFoundError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 404, campo);
    }
}

// 409: la operación entra en conflicto con el estado actual del recurso
// (por ejemplo: eliminar un vehículo que tiene un chofer asignado).
export class ConflictError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 409, campo);
    }
}

// 503: no se pudo establecer la conexión con MongoDB.
export class DBConnectionError extends AppError {
    constructor(mensaje, campo = null) {
        super(mensaje, 503, campo);
    }
}

// Middleware (de 4 parámetros, Express lo reconoce como manejador de errores).
// Los parámetros `req` y `next` no se usan, pero deben estar para que Express
// distinga este manejador de uno normal.
export function manejadorDeErrores(err, _req, res, _next) {
    // 1. Errores propios de la aplicación: cada uno trae su statusCode.
    if (err instanceof AppError) {
        const cuerpo = { error: err.message };
        if (err.campo !== null && err.campo !== undefined) {
            cuerpo.campo = err.campo;
        }
        return res.status(err.statusCode).json(cuerpo);
    }

    // 2. Validaciones de los schemas de Mongoose: se detalla campo por campo.
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

    // 3. IDs o valores con formato inválido (CastError) llegados en parámetros de ruta o body.
    if (err instanceof mongoose.Error.CastError) {
        let mensaje = `Valor o identificador inválido para el campo ${err.path}`;
        if (err.kind === "Number") {
            mensaje = `El valor ingresado para el campo ${err.path} debe ser un número válido.`;
        } else if (err.kind === "ObjectId") {
            mensaje = `El identificador proporcionado para el campo ${err.path} no tiene un formato válido.`;
        }
        return res.status(400).json({
            error: mensaje,
            campo: err.path
        });
    }

    // 4. Índices duplicados (clave única) de MongoDB.
    if (err.code === 11000) {
        const campoDuplicado = Object.keys(err.keyValue ?? {})[0] ?? null;
        const cuerpo = { error: `El valor para el campo ${campoDuplicado} ya existe en la base de datos.` };
        if (campoDuplicado) cuerpo.campo = campoDuplicado;
        return res.status(409).json(cuerpo);
    }

    // 5. Cualquier otra cosa: error genérico, sin exponer el mensaje interno.
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
};
