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

```bash
PORT=3000
JSONFOLDER=./db
```

4. Ejecutar el proyecto

Modo desarrollo instalando previamente Nodemon

```bash
npm run dev
```

Modo producción

```bash
npm start
```

