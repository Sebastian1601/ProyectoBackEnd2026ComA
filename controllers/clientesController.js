//aca hay que importar los schemas para crear clientes y eso
//const rutaArchivoClientes = path.join(__dirname, '../data/clientes.json');

//importo el modelo cliente de mongoose
import Cliente from '../models/Cliente.js';

export class ClienteController {

    static obtenerClientes = async (req, res) => {
        const clientes = await Cliente.find().lean();
        if (res && typeof res.json === 'function') {
            return res.json(clientes);
        }
        return clientes;
    };

    static obtenerClientePorId = async (req, res) => {
        const ID = req.params.id;

        const cliente = await Cliente.findById(ID);

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        };
        return res.json(cliente);
    };

    static crearCliente = async (req, res) => {
        // El ID lo crea Mongo, no lo pasamos por acá
        const { nombre, telefono, direccion } = req.body;
        const nuevoCliente = new Cliente({ nombre, telefono, direccion });
        try {
            await nuevoCliente.save();
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear nuevo cliente"
            })
        };

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            cliente: nuevoCliente
        });
    };

    //actualizar cliente desde una lista en frontend que ya tiene la id asignada
    static actualizarCliente = async (req, res) => {
        const { nombre, telefono, direccion } = req.body;
        const id = req.params.id;

        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            { nombre, telefono, direccion },
            {
                returnDocument: 'after', // Devuelve el documento actualizado
                runValidators: true // Ejecuta las validaciones del esquema
            }
        );
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }
        res.json({
            mensaje: "Cliente actualizado correctamente",
            cliente: clienteActualizado
        });
    };

    static borrarCliente = async (req, res) => {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente"
        });
    };
    // Obtener todos los clientes para la API
    static listarClientesAPI = async (req, res) => {
        try {
            const clientes = await Cliente.find().lean();
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({
                mensaje: "Error al obtener los clientes"
            });
        }
    };

};
