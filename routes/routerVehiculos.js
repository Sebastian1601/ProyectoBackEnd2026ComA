const express = require("express");
const { VehiculoController } = require("../controllers/logicaController.js");
 
const router = express.Router();
 
router.get("/", VehiculoController.obtenerVehiculos);
 
router.get("/:id", VehiculoController.obtenerVehiculoPorId);
 
router.post("/", VehiculoController.crearVehiculo);
 
router.put("/:id", VehiculoController.actualizarVehiculo);
 
router.delete("/:id", VehiculoController.borrarVehiculo);
 
module.exports = router;