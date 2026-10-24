import { Router } from "express";
import { autenticarPagina } from "../validation/autenticacion.js";
import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";
import Vehiculo from "../models/Vehiculo.js";
import Pedido from "../models/Pedidos.js";
import { Producto } from "../models/Producto.js";
import { ClienteController } from "../controllers/clientesController.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("login", {
        mostrarBotonLogout: false
    });
});

// Desde acá, todas las páginas exigen sesión iniciada (si no, redirige al login)
router.use(autenticarPagina);

router.get("/index", (req, res) => {
    res.render("index", {
        mostrarBotonLogout: true
    });
});

router.get("/clientes", async (req, res) => {
    const listaClientes = await ClienteController.obtenerClientes();
    res.render("clientes", { listado: listaClientes, mostrarBotonLogout: true });
});

router.get("/pedidos", async (req, res) => {
    const pedidos = await Pedido.find().populate('idCliente').lean();
    res.render("pedidos", { pedidos, mostrarBotonLogout: true });
});

router.get("/vehiculos", async (req, res) => {
    const vehiculos = await Vehiculo.find().populate('idChoferAsignado').lean();
    res.render("vehiculos", { vehiculos, mostrarBotonLogout: true });
});

router.get("/choferes", async (req, res) => {
    const choferes = await Chofer.find().populate('idVehiculoAsignado').lean();
    res.render("choferes", { choferes, mostrarBotonLogout: true });
});

router.get("/rutas", async (req, res) => {
    const rutas = await Ruta.find().populate('idChoferAsignado').lean();
    res.render("rutas", { rutas, mostrarBotonLogout: true });
});

router.get("/productos", async (req, res) => {
    const productos = await Producto.find().lean();
    res.render('productos', { listado: productos, mostrarBotonLogout: true });
});

export default router;