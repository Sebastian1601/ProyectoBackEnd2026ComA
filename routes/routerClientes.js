const express = require("express");
const { ClienteController } = require("../controllers/clientesController.js");
const { ValidarString } = require("../validation/clientes.js");


const router = express.Router();

router.get("/", ClienteController.obtenerClientes);

router.get("/:id", ClienteController.obtenerClientePorId);

router.post("/", ValidarString, ClienteController.crearCliente);

router.put("/:id", ValidarString, ClienteController.actualizarCliente);

router.delete("/:id", ClienteController.borrarCliente);

module.exports = router;

