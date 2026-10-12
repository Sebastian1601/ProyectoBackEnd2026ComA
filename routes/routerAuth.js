import { Autenticacion } from "../controllers/AuthController.js";
import { Router } from "express";

const router = Router();

router.post("/", Autenticacion.validarUsuario);

export default router;