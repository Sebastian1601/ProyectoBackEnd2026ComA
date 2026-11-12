// Tests del manejo centralizado de errores (ErrorControl/Errores.js).
// Verifican el formato de respuesta { error, campo? } y los códigos HTTP.

import { test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    DBConnectionError,
    manejadorDeErrores
} from "../ErrorControl/Errores.js";

// Respuesta simulada: el manejador solo usa res.status().json().
function crearRespuesta() {
    return {
        statusCode: null,
        cuerpo: null,
        status(codigo) {
            this.statusCode = codigo;
            return this;
        },
        json(cuerpo) {
            this.cuerpo = cuerpo;
            return this;
        }
    };
}

function responder(err) {
    const res = crearRespuesta();
    manejadorDeErrores(err, {}, res, () => { });
    return res;
}

test("los errores propios responden con su statusCode y el formato { error }", () => {
    const casos = [
        [new ValidationError("Datos inválidos", "nombre"), 400],
        [new AuthenticationError("Credenciales incorrectas"), 401],
        [new AuthorizationError("No tenés permiso"), 403],
        [new NotFoundError("Cliente no encontrado"), 404],
        [new ConflictError("Ya tiene un vehículo asignado"), 409],
        [new DBConnectionError("Sin conexión con MongoDB"), 503]
    ];

    for (const [error, codigoEsperado] of casos) {
        const res = responder(error);
        assert.equal(res.statusCode, codigoEsperado, error.message);
        assert.equal(res.cuerpo.error, error.message);
        assert.ok(error instanceof AppError);
    }
});

test("el error propio incluye el campo cuando corresponde", () => {
    const res = responder(new ValidationError("El campo nombre es obligatorio.", "nombre"));
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.cuerpo, {
        error: "El campo nombre es obligatorio.",
        campo: "nombre"
    });
});

test("un error propio sin campo responde solo con { error }", () => {
    const res = responder(new NotFoundError("Pedido no encontrado"));
    assert.deepEqual(res.cuerpo, { error: "Pedido no encontrado" });
});

test("la validación de Mongoose responde 400 con el detalle campo por campo", () => {
    const error = new mongoose.Error.ValidationError();
    error.errors.nombre = new mongoose.Error.ValidatorError({
        path: "nombre",
        message: "El nombre es obligatorio",
        type: "required"
    });

    const res = responder(error);
    assert.equal(res.statusCode, 400);
    assert.equal(res.cuerpo.error, "Error de validación");
    assert.deepEqual(res.cuerpo.detalles, [
        { campo: "nombre", mensaje: "El nombre es obligatorio" }
    ]);
});

test("un id con formato inválido (CastError) responde 400", () => {
    const error = new mongoose.Error.CastError("ObjectId", "no-es-un-id", "_id");
    const res = responder(error);

    assert.equal(res.statusCode, 400);
    assert.equal(res.cuerpo.campo, "_id");
    assert.match(res.cuerpo.error, /identificador/);
});

test("un valor numérico inválido (CastError de Number) responde 400", () => {
    const error = new mongoose.Error.CastError("Number", "abc", "precio");
    const res = responder(error);

    assert.equal(res.statusCode, 400);
    assert.equal(res.cuerpo.campo, "precio");
    assert.match(res.cuerpo.error, /número válido/);
});

test("una clave duplicada (código 11000) responde 409", () => {
    const error = new Error("E11000 duplicate key");
    error.code = 11000;
    error.keyValue = { dni: "99999123" };

    const res = responder(error);
    assert.equal(res.statusCode, 409);
    assert.equal(res.cuerpo.campo, "dni");
    assert.match(res.cuerpo.error, /ya existe/);
});

test("cualquier otro error responde 500 sin exponer detalles internos", () => {
    const errorOriginal = console.error;
    console.error = () => { }; // se silencia el log del error interno
    try {
        const res = responder(new Error("fallo interno con datos sensibles"));
        assert.equal(res.statusCode, 500);
        assert.deepEqual(res.cuerpo, { error: "Error interno del servidor" });
        assert.doesNotMatch(JSON.stringify(res.cuerpo), /sensibles/);
    } finally {
        console.error = errorOriginal;
    }
});
