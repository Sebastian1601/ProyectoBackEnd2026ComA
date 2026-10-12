import { Router } from "express";
import { RutaController } from "../controllers/logicaController.js";
 
const router = Router();
 
router.get("/", RutaController.obtenerRutas);
 
router.get("/:id", RutaController.obtenerRutaPorId);
 
router.post("/", RutaController.crearRuta);
 
router.put("/:id", RutaController.actualizarRuta);
 
router.delete("/:id", RutaController.borrarRuta);
 
export default router;