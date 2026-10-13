import { Router } from "express";
import validarSesion from "../validation/sesionUsuario.js";

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

router.get("/choferes", (req, res) => {
    //aca hay que obtener los choferes y pasarle el resultado al render como objeto
    res.render("choferes");
});

router.get("/rutas", (req, res) => {
    //lo mismo con rutas, obtener, pasar como objeto
    res.render("rutas");
});

export default router;