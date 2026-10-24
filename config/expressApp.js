import express from "express";
import routerV1 from "../routes/routerMainV1.js";
import routerTemplate from "../routes/routerTemplate.js";
import { manejadorDeErrores } from "../ErrorControl/Errores.js";
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from "node:url";
import verificarRequest from "../validation/sesionUsuario.js";


//configuracion de rutas
const viewsRuta = path.join(dirname(fileURLToPath(import.meta.url)), "..", "views");
const staticRuta = path.join(dirname(fileURLToPath(import.meta.url)), "..", "static");


const app = express();

// Configuración de Pug
app.set("view engine", "pug");
app.set("views", viewsRuta);
app.use(express.static(staticRuta));

// Middleware para recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/apiV1", routerV1);
app.use("/", verificarRequest, routerTemplate);
app.use("", (req, res) => {
    res.status(404).sendFile(path.join(staticRuta, "html", "notFound.html"));
})

// Manejo de errores
app.use(manejadorDeErrores);

export default app;