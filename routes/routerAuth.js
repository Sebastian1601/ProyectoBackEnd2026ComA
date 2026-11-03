import { Autenticacion } from "../controllers/AuthController.js";
import { Router } from "express";

const router = Router();

router.post("/", Autenticacion.validarUsuario);
router.post("/logout", Autenticacion.cerrarSesion);

export default router;