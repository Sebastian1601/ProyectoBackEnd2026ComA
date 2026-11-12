import Chofer from "../models/Chofer.js";
import Ruta from "../models/Ruta.js";
import Vehiculo from "../models/Vehiculo.js";
import Pedido from "../models/Pedidos.js";
import { Producto } from "../models/Producto.js";
import Cliente from "../models/Cliente.js";

// Controlador de las páginas Pug (render del lado del servidor).
// La lógica de consulta vive acá; routes/routerTemplate.js solo declara las rutas.

// Mismo orden que usa la API para listar clientes.
function obtenerClientes() {
    return Cliente.find().sort({ createdAt: "desc" }).lean();
}

export class PaginasController {

    static login(req, res, next) {
        try {
            res.render("login", { mostrarBotonLogout: false });
        } catch (error) {
            next(error);
        }
    };

    static inicio(req, res, next) {
        try {
            res.render("index", { mostrarBotonLogout: true });
        } catch (error) {
            next(error);
        }
    };

    static async clientes(req, res, next) {
        try {
            const listado = await obtenerClientes();

            res.render("clientes", {
                listado,
                mostrarBotonLogout: true
            });
        } catch (error) {
            next(error);
        }
    };

    static async pedidos(req, res, next) {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    static async vehiculos(req, res, next) {
        try {
            const [vehiculos, choferes] = await Promise.all([
                Vehiculo.find().populate('idChoferAsignado').lean(),
                Chofer.find().lean()
            ]);

            res.render("vehiculos", {
                vehiculos,
                choferes,
                mostrarBotonLogout: true
            });
        } catch (error) {
            next(error);
        }
    };

    static async choferes(req, res, next) {
        try {
            const [choferes, vehiculos] = await Promise.all([
                Chofer.find().populate('idVehiculoAsignado').lean(),
                Vehiculo.find().lean()
            ]);

            res.render("choferes", {
                choferes,
                vehiculos,
                mostrarBotonLogout: true
            });
        } catch (error) {
            next(error);
        }
    };

    static async rutas(req, res, next) {
        try {
            const [rutas, choferes] = await Promise.all([
                Ruta.find().populate('idChoferAsignado').lean(),
                Chofer.find().lean()
            ]);

            res.render("rutas", {
                rutas,
                choferes,
                mostrarBotonLogout: true
            });
        } catch (error) {
            next(error);
        }
    };

    static async productos(req, res, next) {
        try {
            const listado = await Producto.find().lean();

            res.render('productos', {
                listado,
                mostrarBotonLogout: true
            });
        } catch (error) {
            next(error);
        }
    };
}
