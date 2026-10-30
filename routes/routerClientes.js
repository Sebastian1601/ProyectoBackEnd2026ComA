import express from "express";
import * as cc from "../controllers/clientesController.js";

const router = express.Router();

router.get("/", cc.obtenerClientes);
router.get("/:id", cc.obtenerUnCliente);
router.post("/", cc.crearCliente);
router.put("/:id", cc.actualizarCliente);
router.delete("/:id", cc.borrarCliente);

export default router;