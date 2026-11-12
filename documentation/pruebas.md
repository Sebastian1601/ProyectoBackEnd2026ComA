# Pruebas del proyecto

Hay dos niveles de pruebas:

1. **Automatizadas** (`tests/`), se ejecutan con un solo comando y no necesitan MongoDB.
2. **Manuales** (`testFiles/*.http`), requests de la API para probar contra la base real.

---

## 1. Pruebas automatizadas

```bash
npm test
```

El script ejecuta `node --test tests/*.test.js`, el runner nativo de Node.js.
No se agregó ninguna dependencia de testing.

| Archivo | Qué cubre |
| --- | --- |
| `tests/helpers.test.js` | Funciones de validación compartidas (`validation/helpers.js`): texto, números, enums, fechas e ids de MongoDB. |
| `tests/validaciones.test.js` | Los 6 middlewares de validación (clientes, productos, vehículos, rutas, choferes, pedidos): rechazan datos inválidos y dejan pasar los válidos. |
| `tests/errores.test.js` | `ErrorControl/Errores.js`: clases de error, códigos HTTP y el manejador central (400/401/403/404/409/500/503 y errores de Mongoose). |
| `tests/api.test.js` | Integración sin base de datos: la app real levantada en un puerto efímero. Rutas de páginas, autenticación, autorización por rol, validaciones conectadas a las rutas y respuestas 400/401/403/404. |

### Formato de las respuestas verificado en los tests

- Éxito: `{ "mensaje": "...", "data": <array | objeto | null> }`
  - GET lista → `200`, GET uno → `200`, POST → `201`, PUT → `200`, DELETE → `200`
- Error: `{ "error": "..." }` y, cuando corresponde, `"campo"` (o `"detalles"` en errores de Mongoose)
  - `400` datos inválidos · `401` sin sesión o credenciales · `403` rol sin permiso
  - `404` recurso inexistente · `409` conflicto con el estado · `500` error interno · `503` sin conexión con MongoDB

### Por qué `tests/api.test.js` no necesita MongoDB

Todas las rutas elegidas terminan antes de tocar la base: redirecciones al
login, `401/403` de los middlewares de sesión, `400` de los middlewares de
validación (el controlador nunca se ejecuta) y el `400` de un `CastError` en un
id mal formado (Mongoose rechaza sin hacer la consulta).

---

## 2. Pruebas manuales (requests `.http`)

Se ejecutan desde VS Code con la extensión **REST Client** abriendo los
archivos de `testFiles/` y haciendo clic en **Send Request**, o con cualquier
cliente HTTP equivalente.

Requisitos: el servidor corriendo (`npm run dev` o `npm start`) en
`http://localhost:3000`.

> Las API privadas exigen una cookie de sesión. Se obtiene con el request de
> `testFiles/auth.http` (login) y luego se reutiliza la cookie que devuelve el
> servidor en la respuesta.

| Archivo | Recurso | Casos |
| --- | --- | --- |
| `testFiles/auth.http` | `/apiV1/auth` | login correcto, usuario inexistente, clave incorrecta, campos ausentes y vacíos (401). |
| `testFiles/clientes.http` | `/apiV1/clientes` | alta, consulta por id, consulta de inexistente (404), modificación, borrado y alta con datos inválidos (400). |
| `testFiles/pedidos.http` | `/apiV1/pedidos` | alta, consulta, modificación parcial, cambio de estado, alta sin cliente / id inválido / sin productos / estado inválido / propiedad no permitida (400) y borrado. |
| `testFiles/productos.http` | `/apiV1/productos` | alta, consulta, modificación, borrado, categoría inválida, precio negativo y consultas/borrados de inexistentes (404). |
| `testFiles/vehiculos.http` | `/apiV1/vehiculos` | alta, consulta, modificación, patente duplicada (409), capacidad inválida (400) y borrado. |
| `testFiles/rutas.http` | `/apiV1/rutas` | alta, consulta, modificación, alta sin nombre, duración/distancia negativas (400) y borrado. |
| `testFiles/choferes.http` | `/apiV1/choferes` | alta (con y sin errores de validación), DNI duplicado (409), modificación, asignación/liberación de vehículo, asignación/finalización de ruta, conflictos de estado (409) y borrado. |

### Reglas de negocio que se prueban en `choferes.http`

- Asignar un vehículo a un chofer ya ocupado → `409`.
- Asignar dos veces el mismo vehículo → `409`.
- Asignar una ruta sin vehículo → `409`.
- Liberar el vehículo mientras el chofer tiene una ruta → `409`.
- Finalizar una ruta ya finalizada → `409`.
- Eliminar un chofer con vehículo o ruta asignada → `409`.

---

## 3. Errores esperados (resumen)

| Situación | Código | Cuerpo |
| --- | --- | --- |
| Falta un campo obligatorio | 400 | `{ "error": "...", "campo": "nombre" }` |
| Enum o número inválido | 400 | `{ "error": "...", "campo": "precio" }` |
| Id con formato inválido | 400 | `{ "error": "...", "campo": "_id" }` |
| Sin sesión / credenciales mal | 401 | `{ "error": "Necesitás iniciar sesión" }` |
| Rol sin permiso para escribir | 403 | `{ "error": "No tenés permiso..." }` |
| Recurso inexistente | 404 | `{ "error": "Cliente no encontrado" }` |
| Conflicto de estado o clave duplicada | 409 | `{ "error": "..." }` |
| Error no previsto | 500 | `{ "error": "Error interno del servidor" }` |
