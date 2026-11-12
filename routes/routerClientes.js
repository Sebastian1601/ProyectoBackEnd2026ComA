import express from "express";
import { ClientesController } from "../controllers/clientesController.js";
import validarCliente from "../validation/clientes.js";

const router = express.Router();

router.get("/", ClientesController.obtenerClientes);
router.get("/:id", ClientesController.obtenerUnCliente);
router.post("/", validarCliente, ClientesController.crearCliente);
router.put("/:id", validarCliente, ClientesController.actualizarCliente);
router.delete("/:id", ClientesController.borrarCliente);

export default router;
