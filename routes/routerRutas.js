import { Router } from "express";
import { RutaController } from "../controllers/logicaController.js";
import validarRuta from "../validation/rutas.js";

const router = Router();

router.get("/", RutaController.obtenerRutas);

router.get("/:id", RutaController.obtenerRutaPorId);

router.post("/", validarRuta, RutaController.crearRuta);

router.put("/:id", validarRuta, RutaController.actualizarRuta);

router.delete("/:id", RutaController.borrarRuta);

export default router;
