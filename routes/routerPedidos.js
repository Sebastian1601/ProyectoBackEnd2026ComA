import express from "express";
import { PedidosController } from "../controllers/pedidosController.js";
import validarPedido from "../validation/pedidos.js";

const router = express.Router();

router.get("/", PedidosController.obtenerPedidos);

router.get("/:id", PedidosController.obtenerPedido);

router.post("/", validarPedido, PedidosController.crearPedido);

router.put("/:id", validarPedido, PedidosController.modificarPedido);

router.delete("/:id", PedidosController.borrarPedido);

export default router;