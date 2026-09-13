const express = require("express");
const { RutaController } = require("../controllers/logicaController.js");
 
const router = express.Router();
 
router.get("/", RutaController.obtenerRutas);
 
router.get("/:id", RutaController.obtenerRutaPorId);
 
router.post("/", RutaController.crearRuta);
 
router.put("/:id", RutaController.actualizarRuta);
 
router.delete("/:id", RutaController.borrarRuta);
 
module.exports = router;