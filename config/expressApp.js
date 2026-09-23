const express = require("express");
const { router: routerV1 } = require("../routes/routerMainV1.js");
const routerTemplate = require("../routes/routerTemplate.js");
const { manejadorDeErrores } = require("../ErrorControl/Errores.js");
const path = require("path");

//configuracion de rutas
const viewsRuta = path.join(__dirname, "..", "views");
const staticRuta = path.join(__dirname, "..", "static");


const app = express();

// Configuración de Pug
app.set("view engine", "pug");
app.set("views",viewsRuta);
app.use(express.static(staticRuta));

// Middleware para recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/apiV1", routerV1);
app.use("/", routerTemplate);
app.use("", (req, res)=>{
    res.status(404).sendFile(path.join(staticRuta, "html", "notFound.html"));
})

// Manejo de errores
app.use(manejadorDeErrores);

module.exports = app;