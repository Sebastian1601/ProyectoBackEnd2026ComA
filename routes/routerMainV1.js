import express from 'express';
import routerAuth from './routerAuth.js';
import routerClientes from './routerClientes.js';
import routerPedidos from './routerPedidos.js';
import routerVehiculos from './routerVehiculos.js';
import routerRutas from './routerRutas.js';
import routerChoferes from './routerChoferes.js';
import routerProductos from './routerProductos.js';

const router = express.Router();

router.use('/auth', routerAuth);
router.use('/clientes', routerClientes);
router.use('/pedidos', routerPedidos);
router.use('/vehiculos', routerVehiculos);
router.use('/rutas', routerRutas);
router.use('/choferes', routerChoferes);
router.use('/', routerProductos);

export default router;