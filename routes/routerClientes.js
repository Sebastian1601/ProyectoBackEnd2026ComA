const express = require("express");
const { ClienteController } = require("../controllers/clientesController.js");

const router = express.Router();

router.get("/", ClienteController.obtenerClientes);

router.get("/:id", ClienteController.obtenerClientePorId);

router.post("/", ClienteController.crearCliente);

router.put("/:id", ClienteController.actualizarCliente);

router.delete("/:id", ClienteController.borrarCliente);

module.exports = router;

