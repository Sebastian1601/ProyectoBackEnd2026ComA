import express from "express";
import routerAuth from "./routerAuth.js";
import routerClientes from "./routerClientes.js";
import routerPedidos from "./routerPedidos.js";
import routerVehiculos from "./routerVehiculos.js";
import routerRutas from "./routerRutas.js";
import routerChoferes from "./routerChoferes.js";
import { autenticar, autorizarEscritura } from "../validation/autenticacion.js";

const router = express.Router();

// Pública: es la que entrega la sesión
router.use("/auth", routerAuth);
 
// Privada: requiere sesión válida. Va después de /auth para que no se aplique a la ruta de login.
router.use(autenticar);

// Actualizado para leer los roles de cada ruta y permitir solo a los usuarios autorizados. Se aplica a todas las rutas privadas.
router.use("/clientes", autorizarEscritura("admin", "administracion"), routerClientes);
router.use("/pedidos", autorizarEscritura("admin", "pedidos"), routerPedidos);
router.use("/vehiculos", autorizarEscritura("admin", "administracion"), routerVehiculos);
router.use("/rutas", autorizarEscritura("admin", "administracion"), routerRutas);
router.use("/choferes", autorizarEscritura("admin", "administracion"), routerChoferes);

export default router;