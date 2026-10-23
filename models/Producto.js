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
            values: ['verduras', 'lacteos', 'carnes', 'procesados', 'no perecederos', 'sin categorizar'],
            message: '{VALUE} no es una categoría válida'
        },
        default:'sin categorizar'
    }
});

export const Producto = model('Producto', productoSchema);

export const obtenerProductos = async () => {
    const productos = await Producto.find().lean();
    return productos;
};

export const obtenerUnProducto = async (id) => {
    const idNumber = parseInt(id);
    const producto = await Producto.findById(idNumber);
    return producto;
};

export const crearProducto = async (producto) => {
    const { nombre, descripcion, precio, categoria } = producto;
    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria });
    try {
        const productoCreado = await nuevoProducto.save();
        return productoCreado;
    } catch (error) {
        return ({ message: "hubo un error al crear el producto" })
    };
};
