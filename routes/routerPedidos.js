const express = require("express");
const { PedidosController } = require("../controllers/pedidosController.js");
const { validarDatosPedido } = require("../validation/pedidos.js");

const router = express.Router();

router.get("/", PedidosController.obtenerPedidos);

router.get("/:id", PedidosController.obtenerPedido);

router.post("/", validarDatosPedido, PedidosController.crearPedido);

router.put("/:id", PedidosController.modificarPedido);

// router.delete("/:id", ClienteController.borrarCliente);

module.exports = router;