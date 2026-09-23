const Autenticacion = require("../controllers/AuthController.js");
const express = require("express");

const router = express.Router();

router.post("/", Autenticacion.validarUsuario);

module.exports = router;