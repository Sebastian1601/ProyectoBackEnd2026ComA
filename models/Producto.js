import { Schema, model } from 'mongoose';

//creacion del esquema de productos
const productoSchema = new Schema({
    nombre: {
        type: String,
        minLength: [4, 'el nombre debe tener al menos 4 dígitos'],
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        min: [0, 'el precio no puede ser menor a 1'],
        default: 1,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['verduras', 'lacteos', 'carnes', 'procesados', 'no perecederos', 'sin categoria'],
            message: '{VALUE} no es una categoría válida'
        },
        default: 'sin categorizar'
    }
});

export const Producto = model('Producto', productoSchema);

export const obtenerProductos = async () => {
    const productos = await Producto.find().lean();
    return productos;
};

export const obtenerUnProducto = async (id) => {
    const producto = await Producto.findById(id);
    return producto;
};

export const crearProducto = async (producto) => {
    const { nombre, descripcion, precio, categoria } = producto;
    let nuevoProducto;
    try {
        nuevoProducto = new Producto({ nombre, descripcion, precio, categoria });
    } catch (error) {
        console.error(error);
        throw error;
    };
    try {
        const productoCreado = await nuevoProducto.save();
        return productoCreado;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const actualizarProducto = async (productoNuevo) => {
    const { id, ...datosActualizados } = productoNuevo;

    const productoModificado = await Producto.findByIdAndUpdate(
        id,
        datosActualizados,
        {
            runValidators: true,
            returnDocument: "after"
        });
    if (productoModificado) return productoModificado;
    return {};
};