const express = require("express");
const routerClientes = require("./routerClientes.js");
const routerProductos = require("./routerProductos.js")

const router = express.Router();

router.use("/clientes", routerClientes);
router.use("/productos", routerProductos);

router.use("", (req, res)=>{
    res.send("<h1> 404. Página web no encontrada</H1>");
})

module.exports = { router };