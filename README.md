# ProyectoBackEnd2026ComA
Repositorio del proyecto de BackEnd Comisión A 2026 2do Cuatrimestre
## API server sistema de administración de logística.

Server basado en Node.JS que sirve una API Rest para datos sobre la logística 
de la empresa de distribución de pedidos "Fresh Route"

### Características
- Persistencia de datos: archivos .Json
- Validación de datos: verificación manual

### Requisitos previos

- Node.js versión 24.19.0
- npm

### Instalación y configuración

1. Clonar repositorio

```bash
git clone https://github.com/Sebastian1601/ProyectoBackEnd2026ComA.git
cd ProyectoBackEnd2026ComA
```

2. Instalar dependencias

```bash
npm install
```

3. Variables de entorno

Crear un archivo .env en la raíz del proyecto basándote en el archivo de ejemplo .env_example:

Reemplazar la subcadena `<user:pass>` con los datos de autenticación correspondientes a mongoDB Atlas.

```bash
PORT=3000
MONGO_URI = mongodb+srv://<user:pass>@mongodbfreecluster01.mjhkdia.mongodb.net/?appName=MongoDBfreeCluster01
```
Las variables de entorno se cargan mediante el script de ejecución con el flag `--env-file=.env`

4. Ejecutar el proyecto

Modo desarrollo instalando previamente Nodemon

```bash
npm run dev
```

Modo producción

```bash
npm start
```

### Editar pug, css y js y ver los cambios live

Se usa el módulo de npm llamado `browser-sync`.

- se instala globalmente, con `npm install -g browser-sync`.
(este modulo y los instalados con el flag `-g`, quedan guardados en la carpeta node_modules
de la instalación local de nodejs en la pc, no van instalados en el proyecto como dependencia)

- Se corre el servidor normal, con `npm run dev`

- Se abre una consola aparte, y se ejecuta browser-sync con ciertos flags
`browser-sync start --proxy "localhost:3000" --files "public/**/*, views/**/*.pug"`
Esto disparará un navegador con otro puerto distinto al que corre el server, pero es
solo para manejar los cambios en el front más dinámicamente.

En ese comando, se define la dirección del server, y luego bajo --files las carpetas a las
que se le realizara el watch, para que cuando se noten cambios, se actualicen automaticamente 
en la pestaña del navegador.
