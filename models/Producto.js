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
}, { timestamps: true });

export const Producto = model('Producto', productoSchema);

export const obtenerProductos = async () => {
    const productos = await Producto
        .find()
        .sort({ createdAt: "desc" })
        .lean();
    return productos;
};

export const obtenerUnProducto = async (id) => {
    const producto = await Producto.findById(id).lean();
    return producto;
};

export const crearProducto = async (producto) => {
    const { nombre, descripcion, precio, categoria } = producto;
    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria });
    const productoCreado = await nuevoProducto.save();
    return productoCreado;
};


export const actualizarProducto = async (id, productoNuevo) => {

    const productoModificado = await Producto.findByIdAndUpdate(
        id,
        productoNuevo,
        {
            runValidators: true,
            returnDocument: "after"
        }).lean();
    productoModificado === null
        ? false
        : true;
};

export const eliminarProducto = async (id) => {
    const exitoAlEliminar = await Producto.findByIdAndDelete(id);
    exitoAlEliminar === null
        ? false
        : true;
}