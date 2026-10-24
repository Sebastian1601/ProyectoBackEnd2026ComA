import { Router } from 'express';
import * as pc from '../controllers/productoController.js';

const router = Router();

router.get('/',pc.obtenerProductos);
router.get('/:id',pc.obtenerUnProducto);
router.post('/', pc.crearProducto);
router.put('/:id', pc.actualizarProducto);//falta

export default router;