import { Router } from "express";
import { autenticarPagina } from "../validation/autenticacion.js";
import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";
import Vehiculo from "../models/Vehiculo.js";
import Pedido from "../models/Pedidos.js";
import { Producto } from "../models/Producto.js";
import { obtenerClientes } from "../models/Cliente.js";

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
    const listaClientes = await obtenerClientes();
    res.render("clientes", {
        listado: listaClientes,
        mostrarBotonLogout: true
    });
});

router.get("/pedidos", async (req, res) => {
    const [pedidos, clientes, productos] = await Promise.all([
        Pedido.find().populate("idCliente").lean(),
        obtenerClientes(),
        Producto.find().sort({ nombre: 1 }).lean()
    ]);

    res.render("pedidos", {
        pedidos,
        clientes,
        productos,
        mostrarBotonLogout: true
    });
});

router.get("/vehiculos", async (req, res) => {
    const [vehiculos, choferes] = await Promise.all([
        Vehiculo.find().populate('idChoferAsignado').lean(),
        Chofer.find().lean()
    ]);
    res.render("vehiculos", {
        vehiculos,
        choferes,
        mostrarBotonLogout: true
    });
});

router.get("/choferes", async (req, res) => {
    const [choferes, vehiculos] = await Promise.all([
        Chofer.find().populate('idVehiculoAsignado').lean(),
        Vehiculo.find().lean()
    ]);
    res.render("choferes", {
        choferes,
        vehiculos,
        mostrarBotonLogout: true
    });
});

router.get("/rutas", async (req, res) => {
    const [rutas, choferes] = await Promise.all([
        Ruta.find().populate('idChoferAsignado').lean(),
        Chofer.find().lean()
    ]);
    res.render("rutas", {
        rutas,
        choferes,
        mostrarBotonLogout: true
    });
});

router.get("/productos", async (req, res) => {
    const productos = await Producto.find().lean();
    res.render('productos', {
        listado: productos,
        mostrarBotonLogout: true
    });
});

export default router;
