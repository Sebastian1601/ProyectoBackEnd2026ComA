// Tests de los middlewares de validación de routes/ (punto 1 de la consigna).
// Cada middleware debe rechazar datos inválidos con ValidationError (400)
// y dejar pasar los datos válidos con next() sin argumentos.

import { test } from "node:test";
import assert from "node:assert/strict";

import { ValidationError } from "../ErrorControl/Errores.js";
import validarCliente from "../validation/clientes.js";
import validarProducto from "../validation/productos.js";
import validarVehiculo from "../validation/vehiculos.js";
import validarRuta from "../validation/rutas.js";
import validarChofer from "../validation/choferes.js";
import validarPedido from "../validation/pedidos.js";

const ID_VALIDO = "6ad1992ecb890b830ed25c16";

// Ejecuta el middleware y devuelve qué pasó: { error } o { paso: true }.
// Los middlewares pueden lanzar la validación (Express la captura y la
// deriva al manejador de errores) o pasarla con next(err): se aceptan las
// dos formas.
function ejecutar(middleware, method, body) {
    let error = null;
    let llegoAlSiguiente = false;

    try {
        middleware({ method, body }, {}, (err) => {
            if (err) error = err;
            else llegoAlSiguiente = true;
        });
    } catch (err) {
        error = err;
    }

    if (error) return { error };
    assert.ok(llegoAlSiguiente, "El middleware no llamó a next().");
    return { paso: true };
}

function rechazar(middleware, method, body) {
    const resultado = ejecutar(middleware, method, body);
    assert.ok(resultado.error, "Se esperaba un error de validación y la petición pasó.");
    assert.ok(resultado.error instanceof ValidationError, "El error debe ser una ValidationError.");
    assert.equal(resultado.error.statusCode, 400);
    return resultado.error;
}

// Clientes ---------------------------------------------------------------

test("cliente: el alta sin datos se rechaza", () => {
    const error = rechazar(validarCliente, "POST", {});
    assert.equal(error.campo, "nombre");
});

test("cliente: el alta con nombre corto se rechaza", () => {
    const error = rechazar(validarCliente, "POST", {
        nombre: "AB",
        telefono: "1122334455",
        direccion: "Av. Siempreviva 742"
    });
    assert.equal(error.campo, "nombre");
});

test("cliente: el alta completa pasa la validación", () => {
    const { paso } = ejecutar(validarCliente, "POST", {
        nombre: "María Pérez",
        telefono: "1122334455",
        direccion: "Av. Siempreviva 742"
    });
    assert.ok(paso);
});

test("cliente: la modificación parcial solo exige los campos que vienen", () => {
    const { paso } = ejecutar(validarCliente, "PUT", { telefono: "1155667788" });
    assert.ok(paso);
});

// Productos ---------------------------------------------------------------

test("producto: el alta sin nombre se rechaza", () => {
    const error = rechazar(validarProducto, "POST", { precio: 100 });
    assert.equal(error.campo, "nombre");
});

test("producto: una categoría fuera del enum se rechaza", () => {
    const error = rechazar(validarProducto, "POST", {
        nombre: "Manzanas",
        precio: 100,
        categoria: "electronica"
    });
    assert.equal(error.campo, "categoria");
});

test("producto: un precio negativo se rechaza", () => {
    const error = rechazar(validarProducto, "POST", {
        nombre: "Manzanas",
        precio: -1
    });
    assert.equal(error.campo, "precio");
});

test("producto: la modificación parcial sin campos pasa", () => {
    const { paso } = ejecutar(validarProducto, "PUT", {});
    assert.ok(paso);
});

// Vehículos ---------------------------------------------------------------

test("vehículo: el alta sin patente se rechaza", () => {
    const error = rechazar(validarVehiculo, "POST", { marca: "Fiat", modelo: "Cronos" });
    assert.equal(error.campo, "patente");
});

test("vehículo: una capacidad fuera del enum se rechaza", () => {
    const error = rechazar(validarVehiculo, "PUT", { capacidad: "Enorme" });
    assert.equal(error.campo, "capacidad");
});

test("vehículo: un id de chofer con formato inválido se rechaza", () => {
    const error = rechazar(validarVehiculo, "PUT", { idChoferAsignado: "no-es-un-id" });
    assert.equal(error.campo, "idChoferAsignado");
});

test("vehículo: la modificación parcial sin campos pasa", () => {
    const { paso } = ejecutar(validarVehiculo, "PUT", {});
    assert.ok(paso);
});

// Rutas -------------------------------------------------------------------

test("ruta: el alta sin nombre se rechaza", () => {
    const error = rechazar(validarRuta, "POST", { origen: "La Plata" });
    assert.equal(error.campo, "nombre");
});

test("ruta: una duración no numérica se rechaza", () => {
    const error = rechazar(validarRuta, "PUT", { duracionEstimada: "media hora" });
    assert.equal(error.campo, "duracionEstimada");
});

test("ruta: una distancia negativa se rechaza", () => {
    const error = rechazar(validarRuta, "PUT", { distanciaEstimada: -10 });
    assert.equal(error.campo, "distanciaEstimada");
});

test("ruta: la modificación parcial sin campos pasa", () => {
    const { paso } = ejecutar(validarRuta, "PUT", {});
    assert.ok(paso);
});

// Choferes ----------------------------------------------------------------

test("chofer: el alta sin nombre se rechaza", () => {
    const error = rechazar(validarChofer, "POST", { apellido: "Pérez" });
    assert.equal(error.campo, "nombre");
});

test("chofer: el alta sin fecha de ingreso se rechaza", () => {
    const error = rechazar(validarChofer, "POST", {
        nombre: "Valentina",
        apellido: "Prueba",
        dni: "99999123",
        numeroRegistro: "REG-PRUEBA-01",
        telefono: "1122009988"
    });
    assert.equal(error.campo, "fechaIngreso");
});

test("chofer: un estado fuera del enum se rechaza", () => {
    const error = rechazar(validarChofer, "PUT", { estado: "Volando" });
    assert.equal(error.campo, "estado");
});

test("chofer: el alta completa pasa la validación", () => {
    const { paso } = ejecutar(validarChofer, "POST", {
        nombre: "Valentina",
        apellido: "Prueba",
        dni: "99999123",
        numeroRegistro: "REG-PRUEBA-01",
        telefono: "1122009988",
        estado: "Disponible",
        fechaIngreso: "2024-01-15"
    });
    assert.ok(paso);
});

// Pedidos -----------------------------------------------------------------

test("pedido: el alta sin cliente se rechaza", () => {
    const error = rechazar(validarPedido, "POST", { productos: [{ nombre: "Pan" }] });
    assert.equal(error.campo, "idCliente");
});

test("pedido: el alta con idCliente inválido se rechaza", () => {
    const error = rechazar(validarPedido, "POST", {
        idCliente: "no-es-un-id",
        productos: [{ nombre: "Pan" }]
    });
    assert.equal(error.campo, "idCliente");
});

test("pedido: el alta sin productos o con la lista vacía se rechaza", () => {
    const error = rechazar(validarPedido, "POST", { idCliente: ID_VALIDO });
    assert.equal(error.campo, "productos");
});

test("pedido: una propiedad que no corresponde a un pedido se rechaza", () => {
    const error = rechazar(validarPedido, "POST", {
        idCliente: ID_VALIDO,
        productos: [{ nombre: "Pan", precio: 100 }],
        total: 100
    });
    assert.match(error.message, /no corresponden a un pedido/);
});

test("pedido: un estado fuera de la lista se rechaza", () => {
    const error = rechazar(validarPedido, "PUT", { estado: "Volando" });
    assert.equal(error.campo, "estado");
});

test("pedido: la modificación parcial sin campos pasa", () => {
    const { paso } = ejecutar(validarPedido, "PUT", {});
    assert.ok(paso);
});

test("pedido: la modificación de un solo campo pasa", () => {
    const { paso } = ejecutar(validarPedido, "PUT", { estado: "En Proceso" });
    assert.ok(paso);
});

test("pedido: el alta válida pasa la validación", () => {
    const { paso } = ejecutar(validarPedido, "POST", {
        idCliente: ID_VALIDO,
        productos: [{ nombre: "Pan", precio: 100 }],
        estado: "Pendiente"
    });
    assert.ok(paso);
});
