import express from "express";
import { ClienteController } from "../controllers/clientesController.js";
import ValidarString from "../validation/clientes.js";


const router = express.Router();

router.get("/", ClienteController.listarClientesAPI);

router.get("/:id", ClienteController.obtenerClientePorId);

router.post("/", ClienteController.crearCliente);

router.put("/:id", ClienteController.actualizarCliente);

router.delete("/:id", ClienteController.borrarCliente);

export default router;