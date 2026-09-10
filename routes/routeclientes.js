const express = require("express");
const { ClienteController } = require("../controllers/clientesController.js");

const router = express.Router();

router.get("/", ClienteController.obtenerClientes);

router.get("/:id", ClienteController.obtenerClientePorId);

router.post("/", ClienteController.guardarClientes);

router.put("/", ClienteController.actualizarCliente);


module.exports = router;

