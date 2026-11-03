import { Router } from "express";
import { autenticarPagina } from "../validation/autenticacion.js";
import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";
import Vehiculo from "../models/Vehiculo.js";
import Pedido from "../models/Pedidos.js";
import { ClienteController } from "../controllers/clientesController.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("login");
});

// Desde acá, todas las páginas exigen sesión iniciada (si no, redirige al login)
router.use(autenticarPagina);
 
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
 
export default router;