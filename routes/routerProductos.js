import { Router } from 'express';
import { ProductoController } from '../controllers/productoController.js';
import validarProducto from '../validation/productos.js';

const router = Router();

router.get('/', ProductoController.obtenerProductos);
router.get('/:id', ProductoController.obtenerUnProducto);
router.post('/', validarProducto, ProductoController.crearProducto);
router.put('/:id', validarProducto, ProductoController.actualizarProducto);
router.delete('/:id', ProductoController.eliminarProducto);

export default router;
