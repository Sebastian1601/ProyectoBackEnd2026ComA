import express from "express";
import { PedidosController } from "../controllers/pedidosController.js";
import validarDatosPedido from "../validation/pedidos.js";

const router = express.Router();

router.get("/", PedidosController.obtenerPedidos);

router.get("/:id", PedidosController.obtenerPedido);

router.post("/", validarDatosPedido, PedidosController.crearPedido);

router.put("/:id", PedidosController.modificarPedido);

router.delete("/:id", PedidosController.borrarPedido);

export default router;