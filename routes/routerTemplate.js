import { Router } from "express";
import validarSesion from "../validation/sesionUsuario.js";
import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";

const router = Router();

//aca verifico si existe la sesión del usuario
router.use("/", validarSesion);

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/index", (req, res) => {
    res.render("index");
});

router.get("/clientes", (req, res) => {
    res.render("clientes");
});

router.get("/pedidos", (req, res) => {
    res.render("pedidos");
});

router.get("/vehiculos", (req, res) => {
    res.render("vehiculos");
});

router.get("/choferes", async (req, res) => {
    const choferes = await Chofer.find().lean();
    res.render("choferes", { choferes });
});

router.get("/rutas", async (req, res) => {
    const rutas = await Ruta.find().lean();
    res.render("rutas", { rutas });
});

export default router;