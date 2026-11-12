import { Router } from "express";
import { VehiculoController } from "../controllers/logicaController.js";
import validarVehiculo from "../validation/vehiculos.js";

const router = Router();

router.get("/", VehiculoController.obtenerVehiculos);

router.get("/:id", VehiculoController.obtenerVehiculoPorId);

router.post("/", validarVehiculo, VehiculoController.crearVehiculo);

router.put("/:id", validarVehiculo, VehiculoController.actualizarVehiculo);

router.delete("/:id", VehiculoController.borrarVehiculo);

export default router;
