import { Router } from "express";
import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";
import Vehiculo from "../models/Vehiculo.js";
import Pedido from "../models/Pedidos.js";
import { Producto } from "../models/Producto.js";
import { ClienteController } from "../controllers/clientesController.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.use((req, res, next) => {
    const origen = req.get('Referer');
    if (!origen) {
        console.log("aqui se redirige al login");
        return res.redirect("/");
    };
    next();
})

router.get("/index", (req, res) => {
    res.render("index");
});

router.get("/clientes", async (req, res) => {
    const listaClientes = await ClienteController.obtenerClientes();
    res.render("clientes", { listado: listaClientes });
});

router.get("/pedidos", async (req, res) => {
    const pedidos = await Pedido.find().populate('idCliente').lean();
    res.render("pedidos", { pedidos });
});

router.get("/vehiculos", async (req, res) => {
    const vehiculos = await Vehiculo.find().populate('idChoferAsignado').lean();
    res.render("vehiculos", { vehiculos });
});

router.get("/choferes", async (req, res) => {
    const choferes = await Chofer.find().populate('idVehiculoAsignado').lean();
    res.render("choferes", { choferes });
});

router.get("/rutas", async (req, res) => {
    const rutas = await Ruta.find().populate('idChoferAsignado').lean();
    res.render("rutas", { rutas });
});

router.get("/productos", async (req, res) => {
    const productos = await Producto.find().lean();
    res.render('productos', { listado: productos });
});

export default router;