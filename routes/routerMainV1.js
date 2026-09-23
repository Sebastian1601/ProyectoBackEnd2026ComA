const express = require("express");
const routerAuth = require("./routerAuth.js");
const routerClientes = require("./routerClientes.js");
const routerPedidos = require("./routerPedidos.js");
const routerVehiculos = require("./routerVehiculos.js");
const routerRutas = require("./routerRutas.js");
const routerChoferes = require("./routerChoferes.js");

const router = express.Router();

router.use("/auth", routerAuth);
router.use("/clientes", routerClientes);
router.use("/pedidos", routerPedidos);
router.use("/vehiculos", routerVehiculos);
router.use("/rutas", routerRutas);
router.use("/choferes", routerChoferes);

module.exports = { router };