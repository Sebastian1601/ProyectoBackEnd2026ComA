import { Router } from "express";
import { autenticarPagina } from "../validation/autenticacion.js";
import { PaginasController } from "../controllers/paginasController.js";

const router = Router();

router.get("/", PaginasController.login);

// Desde acá, todas las páginas exigen sesión iniciada (si no, redirige al login)
router.use(autenticarPagina);

router.get("/index", PaginasController.inicio);
router.get("/clientes", PaginasController.clientes);
router.get("/pedidos", PaginasController.pedidos);
router.get("/vehiculos", PaginasController.vehiculos);
router.get("/choferes", PaginasController.choferes);
router.get("/rutas", PaginasController.rutas);
router.get("/productos", PaginasController.productos);

export default router;
