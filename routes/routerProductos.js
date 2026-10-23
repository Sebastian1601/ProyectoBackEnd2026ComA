import { Router } from 'express';
import * as pc from '../controllers/productoController.js';

const router = Router();

router.get('/productos',pc.obtenerProductos);
router.get('/productos/:id',pc.obtenerUnProducto);
router.post('/', pc.crearProducto);

export default router;