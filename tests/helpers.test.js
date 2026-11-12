// Tests unitarios de las funciones de validación compartidas.
// Se ejecutan con: npm test   (node --test tests/)

import { test } from "node:test";
import assert from "node:assert/strict";

import { ValidationError } from "../ErrorControl/Errores.js";
import {
    validarTexto,
    validarNumero,
    validarEnum,
    validarFecha,
    validarObjectId
} from "../validation/helpers.js";

// Helpers ---------------------------------------------------------------

function esperarError(fn) {
    try {
        fn();
    } catch (error) {
        return error;
    }
    throw new Error("Se esperaba un error de validación y no se lanzó ninguno.");
}

// validarTexto -----------------------------------------------------------

test("validarTexto: el campo obligatorio ausente lanza ValidationError 400", () => {
    const error = esperarError(() => validarTexto("nombre", undefined, { requerido: true }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.statusCode, 400);
    assert.equal(error.campo, "nombre");
    assert.match(error.message, /nombre/);
});

test("validarTexto: el campo obligatorio vacío lanza ValidationError", () => {
    const error = esperarError(() => validarTexto("nombre", "   ", { requerido: true, min: 3 }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.statusCode, 400);
});

test("validarTexto: el texto más corto que el mínimo lanza ValidationError", () => {
    const error = esperarError(() => validarTexto("nombre", "AB", { requerido: true, min: 3 }));
    assert.ok(error instanceof ValidationError);
    assert.match(error.message, /al menos 3 caracteres/);
});

test("validarTexto: un campo opcional ausente o vacío no lanza error", () => {
    assert.doesNotThrow(() => validarTexto("descripcion", undefined, { requerido: false }));
    assert.doesNotThrow(() => validarTexto("descripcion", "", { requerido: false }));
    assert.doesNotThrow(() => validarTexto("descripcion", "  ", { requerido: false }));
});

test("validarTexto: un valor que no es texto lanza ValidationError", () => {
    const error = esperarError(() => validarTexto("nombre", 123, { requerido: false }));
    assert.ok(error instanceof ValidationError);
    assert.match(error.message, /debe ser un texto/);
});

// validarNumero ----------------------------------------------------------

test("validarNumero: acepta números y textos numéricos", () => {
    assert.doesNotThrow(() => validarNumero("precio", 1500, { min: 0 }));
    assert.doesNotThrow(() => validarNumero("precio", "1500", { min: 0 }));
    assert.doesNotThrow(() => validarNumero("precio", 0, { min: 0 }));
});

test("validarNumero: un texto no numérico lanza ValidationError", () => {
    const error = esperarError(() => validarNumero("precio", "caro", { min: 0 }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.campo, "precio");
});

test("validarNumero: un valor menor al mínimo lanza ValidationError", () => {
    const error = esperarError(() => validarNumero("precio", -5, { min: 0 }));
    assert.ok(error instanceof ValidationError);
    assert.match(error.message, /menor que 0/);
});

test("validarNumero: el campo obligatorio ausente lanza ValidationError", () => {
    const error = esperarError(() => validarNumero("precio", undefined, { requerido: true }));
    assert.ok(error instanceof ValidationError);
});

test("validarNumero: un booleano se rechaza como número", () => {
    const error = esperarError(() => validarNumero("precio", true, { requerido: false }));
    assert.ok(error instanceof ValidationError);
});

// validarEnum ------------------------------------------------------------

test("validarEnum: acepta valores de la lista y opcionalmente ausentes", () => {
    const valores = ["Disponible", "Ocupado"];
    assert.doesNotThrow(() => validarEnum("estado", "Disponible", valores, { requerido: false }));
    assert.doesNotThrow(() => validarEnum("estado", undefined, valores, { requerido: false }));
});

test("validarEnum: un valor fuera de la lista lanza ValidationError y lista los valores", () => {
    const valores = ["Disponible", "Ocupado"];
    const error = esperarError(() => validarEnum("estado", "Volando", valores, { requerido: false }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.campo, "estado");
    assert.match(error.message, /Disponible, Ocupado/);
});

// validarFecha -----------------------------------------------------------

test("validarFecha: acepta fechas interpretables", () => {
    assert.doesNotThrow(() => validarFecha("fechaIngreso", "2024-01-15", { requerido: true }));
    assert.doesNotThrow(() => validarFecha("fechaIngreso", new Date(), { requerido: true }));
});

test("validarFecha: una fecha inválida lanza ValidationError", () => {
    const error = esperarError(() => validarFecha("fechaIngreso", "ayer no era", { requerido: true }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.campo, "fechaIngreso");
});

test("validarFecha: la fecha obligatoria ausente lanza ValidationError", () => {
    const error = esperarError(() => validarFecha("fechaIngreso", "", { requerido: true }));
    assert.ok(error instanceof ValidationError);
});

// validarObjectId --------------------------------------------------------

test("validarObjectId: acepta un id válido de 24 caracteres hexadecimales", () => {
    assert.doesNotThrow(() =>
        validarObjectId("idCliente", "6ad1992ecb890b830ed25c16", { requerido: true })
    );
});

test("validarObjectId: un id con formato inválido lanza ValidationError", () => {
    const error = esperarError(() => validarObjectId("idCliente", "no-es-un-id", { requerido: true }));
    assert.ok(error instanceof ValidationError);
    assert.equal(error.campo, "idCliente");
});

test("validarObjectId: el id obligatorio ausente lanza ValidationError", () => {
    const error = esperarError(() => validarObjectId("idCliente", undefined, { requerido: true }));
    assert.ok(error instanceof ValidationError);
});
