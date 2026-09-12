const express = require("express");
const { PedidosController } = require("../controllers/pedidosController.js");

const router = express.Router();

router.get("/", PedidosController.obtenerPedidos);

router.get("/:id", PedidosController.obtenerPedido);

router.post("/", PedidosController.crearPedido);

// router.put("/:id", ValidarString, ClienteController.actualizarCliente);

// router.delete("/:id", ClienteController.borrarCliente);

module.exports = router;