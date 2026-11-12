// Tests de integración de la API (sin base de datos).
//
// Levantan la aplicación real en un puerto efímero y verifican el cableado
// completo: enrutamiento → autenticación/autorización → validación →
// manejador central de errores. Todas las rutas elegidas terminan antes de
// tocar MongoDB, por lo que corren sin conexión.

process.env.JWT_SECRET = process.env.JWT_SECRET || "secreto-de-prueba-para-los-tests";

const { default: app } = await import("../config/expressApp.js");
const jwt = (await import("jsonwebtoken")).default;

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

const ID_INVALIDO = "abc123";
const ID_VALIDO = "6ad1992ecb890b830ed25c16";

let servidor;
let BASE;

// Cookie de sesión firmada con el mismo secreto que usa la aplicación.
function cookieDeRol(rol) {
    const token = jwt.sign(
        { usuario: "tester", rol },
        process.env.JWT_SECRET,
        { subject: "000000000000000000000000", expiresIn: "10m" }
    );
    return { Cookie: `token=${token}` };
}

const ADMIN = () => cookieDeRol("admin");

before(async () => {
    servidor = createServer(app);
    await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
    BASE = `http://127.0.0.1:${servidor.address().port}`;
});

after(() => {
    servidor.closeAllConnections?.();
    servidor.close();
});

// Páginas -----------------------------------------------------------------

test("GET / renderiza la página de login", async () => {
    const respuesta = await fetch(`${BASE}/`);

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers.get("content-type"), /text\/html/);
});

test("las páginas protegidas redirigen al login sin sesión", async () => {
    const respuesta = await fetch(`${BASE}/index`, { redirect: "manual" });

    assert.equal(respuesta.status, 302);
    assert.equal(respuesta.headers.get("location"), "/");
});

test("una URL de página inexistente sin sesión también redirige al login", async () => {
    const respuesta = await fetch(`${BASE}/pagina-que-no-existe`, { redirect: "manual" });

    assert.equal(respuesta.status, 302);
    assert.equal(respuesta.headers.get("location"), "/");
});

test("con sesión válida, una URL inexistente responde 404", async () => {
    const respuesta = await fetch(`${BASE}/pagina-que-no-existe`, {
        headers: ADMIN(),
        redirect: "manual"
    });

    assert.equal(respuesta.status, 404);
});

// Autenticación y autorización -------------------------------------------

test("la API responde 401 { error } sin sesión", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/clientes`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 401);
    assert.deepEqual(cuerpo, { error: "Necesitás iniciar sesión" });
});

test("un rol sin permisos recibe 403 { error } en una operación de escritura", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/clientes`, {
        method: "POST",
        headers: { ...cookieDeRol("pedidos"), "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "María Pérez", telefono: "1122334455", direccion: "Av. Siempreviva 742" })
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 403);
    assert.deepEqual(cuerpo, { error: "No tenés permiso para realizar esta acción" });
});

test("un token firmado con otro secreto no da sesión", async () => {
    const tokenFalso = jwt.sign(
        { usuario: "intruso", rol: "admin" },
        "otro-secreto-completamente-distinto",
        { subject: "000000000000000000000000", expiresIn: "10m" }
    );

    const respuesta = await fetch(`${BASE}/apiV1/clientes`, {
        headers: { Cookie: `token=${tokenFalso}` }
    });

    assert.equal(respuesta.status, 401);
});

test("credenciales que no son textos se rechazan con 401 antes de consultar la base", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { "$ne": null }, contra: { "$ne": null } })
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 401);
    assert.deepEqual(cuerpo, { error: "Credenciales incorrectas" });
});

test("cerrar sesión responde 200 en el formato unificado { mensaje, data }", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/auth/logout`, { method: "POST" });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.deepEqual(cuerpo, { mensaje: "Sesión cerrada", data: null });
});

// Validaciones conectadas a las rutas -------------------------------------

test("un alta de cliente sin datos responde 400 con el campo que falló", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/clientes`, {
        method: "POST",
        headers: { ...ADMIN(), "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.equal(cuerpo.campo, "nombre");
    assert.match(cuerpo.error, /obligatorio/);
});

test("un producto con categoría inválida responde 400", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/productos`, {
        method: "POST",
        headers: { ...ADMIN(), "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Manzanas", precio: 100, categoria: "electronica" })
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.equal(cuerpo.campo, "categoria");
});

test("un pedido con propiedades que no le corresponden responde 400", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/pedidos/${ID_VALIDO}`, {
        method: "PUT",
        headers: { ...ADMIN(), "Content-Type": "application/json" },
        body: JSON.stringify({ total: 1500 })
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.match(cuerpo.error, /no corresponden a un pedido/);
});

// Manejo central de errores ------------------------------------------------

test("un id con formato inválido responde 400 en lugar de un error 500", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/clientes/${ID_INVALIDO}`, {
        headers: ADMIN()
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.equal(cuerpo.campo, "_id");
});

test("una ruta de API inexistente responde 404", async () => {
    const respuesta = await fetch(`${BASE}/apiV1/recurso-inventado`, {
        headers: ADMIN()
    });

    assert.equal(respuesta.status, 404);
});
