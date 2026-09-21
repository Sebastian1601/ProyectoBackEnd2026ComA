const express = require("express");
const { ChoferController, AsignacionesController } = require("../controllers/logicaController.js");
 
const router = express.Router();
 
router.get("/", ChoferController.obtenerChoferes);

router.get("/ver-choferes", ChoferController.verChoferes);
 
router.get("/:id", ChoferController.obtenerChoferPorId);
 
router.post("/", ChoferController.crearChofer);
 
router.put("/:id", ChoferController.actualizarChofer);
 
router.delete("/:id", ChoferController.borrarChofer);
 
// Rutas de asignación/liberación entre chofer y vehículo
router.post("/:idChofer/asignar-vehiculo/:idVehiculo", AsignacionesController.asignarVehiculoAChofer);
 
router.post("/:idChofer/liberar-vehiculo/:idVehiculo", AsignacionesController.liberarVehiculoDeChofer);
 
// Rutas de asignación/finalización entre chofer y ruta
router.post("/:idChofer/asignar-ruta/:idRuta", AsignacionesController.asignarRutaAChofer);
 
router.post("/:idChofer/finalizar-ruta/:idRuta", AsignacionesController.finalizarRutaDeChofer);
 
module.exports = router;