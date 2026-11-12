# ProyectoBackEnd2026ComA

API server del sistema de administración de logística de la empresa de
distribución de pedidos **Fresh Route**. Node.js + Express + MongoDB Atlas.

---

## Características

- API REST bajo `/apiV1` con respuestas uniformes:
  - éxito → `{ "mensaje": "...", "data": ... }` (GET 200, POST 201, PUT/DELETE 200)
  - error → `{ "error": "...", "campo": "..." }` (400 / 401 / 403 / 404 / 409 / 500 / 503)
- Arquitectura en capas: `routes` → middlewares (sesión, roles, validación) → `controllers` → `models`.
- Autenticación con cookie **JWT** (2 h, `httpOnly`, `sameSite=lax`, `secure` en producción)
  y contraseñas hasheadas con `scrypt` + sal y comparación en tiempo constante.
- Protección contra *NoSQL injection*: las credenciales se rechazan si no son textos.
- Roles (`admin`, `administracion`, `pedidos`) con autorización por recurso y método.
- Validación de datos en dos niveles: middlewares por recurso y schemas de Mongoose.
- Manejo centralizado de errores (`ErrorControl/Errores.js`).
- Páginas server-side en **Pug** + front-end en JavaScript puro (sin frameworks).

## Requisitos previos

- Node.js 24 (probado con 24.22) y npm
- Una base de datos **MongoDB Atlas**

## Instalación y configuración

1. Clonar el repositorio

```bash
git clone https://github.com/Sebastian1601/ProyectoBackEnd2026ComA.git
cd ProyectoBackEnd2026ComA
```

2. Instalar dependencias

```bash
npm install
```

3. Variables de entorno

Copiar `.env.example` a `.env` y completarlo:

```bash
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=***
MONGO_URI=mongodb+srv://<user:pass>@mongodbfreecluster01.mjhkdia.mongodb.net/?appName=MongoDBfreeCluster01
JWT_SECRET=<generar con: openssl rand -hex 64>
```

- `ADMIN_USER` / `ADMIN_PASS`: crean el usuario admin en el primer arranque.
- `JWT_SECRET`: clave con la que se firman los tokens de sesión. Se genera
  una sola vez con `openssl rand -hex 64` (o `node -e
  "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`),
  es secreta, no se sube a git y **si se cambia todos los usuarios pierden la sesión**.

Las variables se cargan con el flag `--env-file=.env` de Node.

## Ejecución

```bash
npm run dev    # desarrollo, con nodemon
npm start      # producción
npm run sync   # browser-sync, en una segunda consola, para ver cambios en vivo
npm test       # pruebas automatizadas (runner nativo de Node, sin dependencias)
npm run lint   # ESLint sobre el código del proyecto
```

`npm run sync` requiere browser-sync instalado globalmente (`npm install -g browser-sync`).

## Estructura del proyecto

```
config/         expressApp (app Express), db (conexión Atlas), tokens (JWT),
                claves (scrypt), bootstrapAdmin (usuario admin inicial)
routes/         rutas de la API y de las páginas (sin lógica)
validation/     autenticacion.js (sesión y roles) + middlewares de validación por recurso
controllers/    lógica de cada recurso y de las páginas Pug
models/         schemas de Mongoose y reglas de negocio de asignación
ErrorControl/   jerarquía de errores de la aplicación + manejador central
views/          plantillas Pug
static/         css, js e imágenes
tests/          pruebas automatizadas (node --test)
testFiles/      pruebas manuales (.http para REST Client de VS Code)
documentation/  dbOperations.md, pruebas.md, entidades.drawio
```

## Pruebas

- **Automatizadas**: `npm test` ejecuta `tests/*.test.js` con el runner nativo
  `node:test`. Cubren helpers de validación, los 6 middlewares de validación,
  el manejador central de errores y una suite de integración que levanta la
  app real en un puerto efímero (sin necesidad de MongoDB).
  Detalle en [`documentation/pruebas.md`](documentation/pruebas.md).
- **Manuales**: requests `.http` en `testFiles/` para probar contra la base
  real con la extensión REST Client de VS Code. Hay que hacer primero el
  login de `auth.http` para obtener la cookie de sesión.

---

## notas particulares propias
el modelo de usuario para acceder y verificar credenciales en sistema deberia tener

model usuario{
    user
    pwd
    rol
    createdat
    modifiedat
}
solamente los roles admin pueden modificar estos datos.