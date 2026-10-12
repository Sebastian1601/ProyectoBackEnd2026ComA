import { Router } from "express";
import { VehiculoController } from "../controllers/logicaController.js";
 
const router = Router();
 
router.get("/", VehiculoController.obtenerVehiculos);
 
router.get("/:id", VehiculoController.obtenerVehiculoPorId);
 
router.post("/", VehiculoController.crearVehiculo);
 
router.put("/:id", VehiculoController.actualizarVehiculo);
 
router.delete("/:id", VehiculoController.borrarVehiculo);
 
export default router;