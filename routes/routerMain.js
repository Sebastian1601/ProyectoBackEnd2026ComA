const express = require("express");
const routerClientes = require("./routerClientes.js");
const routerPedidos = require("./routerPedidos.js");
const routerVehiculos = require("./routerVehiculos.js");
const routerRutas = require("./routerRutas.js");
const routerChoferes = require("./routerChoferes.js");

const router = express.Router();

router.use("/clientes", routerClientes);
router.use("/pedidos", routerPedidos);
router.use("/vehiculos", routerVehiculos);
router.use("/rutas", routerRutas);
router.use("/choferes", routerChoferes);

router.get("/", (req, res)=>{
    res.render("index");
});

router.use("", (req, res)=>{
    res.send("<h1> 404. Página web no encontrada</H1>");
});

module.exports = { router };