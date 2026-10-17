// Importar modelos
import Vehiculo from '../models/Vehiculo.js';
import Ruta from '../models/Ruta.js';
import Chofer from '../models/Chofer.js';


class VehiculoController {
    static obtenerVehiculos = async (req, res) => {
        const vehiculos = await Vehiculo.find()
        res.json(vehiculos);
    };

    static obtenerVehiculoPorId = async (req, res) => {
        const vehiculo = await Vehiculo.findById(req.params.id);
        if (!vehiculo) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }


        res.json(vehiculo);
    };

    static crearVehiculo = async (req, res) => {
        const { patente, marca, modelo, capacidad } = req.body;

        // No pasar estado por acá, lo maneja la clase Vehiculo, que por defecto lo deja en "disponible"
        const nuevoVehiculo = new Vehiculo({ patente, marca, modelo, capacidad });
        await nuevoVehiculo.save();

        res.status(201).json({
            mensaje: "Vehículo creado correctamente",
            vehiculo: nuevoVehiculo
        });
    };

    static actualizarVehiculo = async (req, res) => {
        const { patente, marca, modelo, capacidad, estado } = req.body; //Chofer se maneja desde la asignación de chofer a vehículo, no se pasa por acá
        
        const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
            req.params.id,
            { patente, marca, modelo, capacidad, estado },
            { 
                returnDocument: 'after', // Devuelve el documento actualizado
                runValidators: true // Ejecuta las validaciones definidas en el esquema
            }
        );

        if (!vehiculoActualizado) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }

        res.json({
            mensaje: "Vehículo actualizado correctamente",
            vehiculo: vehiculoActualizado
        });
    };

    static borrarVehiculo = async (req, res) => {
        const vehiculo = await Vehiculo.findById(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }

        if (vehiculo.idChoferAsignado) {
            return res.status(400).json({ mensaje: "No se puede eliminar un vehículo que tiene un chofer asignado" });
        }

        await Vehiculo.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Vehículo eliminado correctamente"
        });
    };

};

class RutaController {
    static obtenerRutas = async (req, res) => {
        const rutas = await Ruta.find();
        res.json(rutas);
    };

    static obtenerRutaPorId = async (req, res) => {
        const ruta = await Ruta.findById(req.params.id);

        if (!ruta) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }

        res.json(ruta);
    };

    static crearRuta = async (req, res) => {
        const { nombre, origen, destino, duracionEstimada, distanciaEstimada } = req.body;

        const nuevaRuta = new Ruta({ nombre, origen, destino, duracionEstimada, distanciaEstimada });
        await nuevaRuta.save();

        res.status(201).json({
            mensaje: "Ruta creada correctamente",
            ruta: nuevaRuta
        });
    };

    static actualizarRuta = async (req, res) => {
        const { nombre, origen, destino, duracionEstimada, distanciaEstimada } = req.body;

        const rutaActualizada = await Ruta.findByIdAndUpdate(
            req.params.id,
            { nombre, origen, destino, duracionEstimada, distanciaEstimada },
            {
                returnDocument: 'after', // Devuelve el documento actualizado
                runValidators: true // Ejecuta las validaciones definidas en el esquema
            }
        );

        if (!rutaActualizada) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }
        
        res.json({
            mensaje: "Ruta actualizada correctamente",
            ruta: rutaActualizada
        });
    };

    static borrarRuta = async (req, res) => {
        const ruta = await Ruta.findById(req.params.id);

        if (!ruta) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }

        if (ruta.idChoferAsignado) {
            return res.status(400).json({ mensaje: "No se puede eliminar una ruta que tiene un chofer asignado" });
        }

        await Ruta.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Ruta eliminada correctamente"
        });
    };

};


class ChoferController {
    static obtenerChoferes = async (req, res) => {
        const choferes = await Chofer.find();
        res.json(choferes);
    };

    static obtenerChoferPorId = async (req, res) => {
        const chofer = await Chofer.findById(req.params.id);

        if (!chofer) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }

        res.json(chofer);
    };
/*
    static verChoferes = async (req, res) => {
        const choferes = await Chofer.find().lean();
        res.render('choferes', { choferes });
    }
No estamos usandolo por ahora, lo dejo comentado para que nos quede para la entrega final
    */
    static crearChofer = async (req, res) => {
        const { id, nombre, apellido, dni, numeroRegistro, telefono, estado, fechaIngreso } = req.body;

        const nuevoChofer = new Chofer({ id, nombre, apellido, dni, numeroRegistro, telefono, fechaIngreso,
            estado: estado ?? "Disponible" // Si no se proporciona estado, se establece como "Disponible"
        });
        await nuevoChofer.save();
         // Saqué el chequeo de dni porque lo pasamos por el model

        res.status(201).json({
            mensaje: "Chofer creado correctamente",
            chofer: nuevoChofer
        });
    };

    static actualizarChofer = async (req, res) => {
        const { nombre, apellido, dni, numeroRegistro, telefono, estado, fechaIngreso } = req.body;

        const choferActualizado = await Chofer.findByIdAndUpdate(
            req.params.id,
            { nombre, apellido, dni, numeroRegistro, telefono, estado, fechaIngreso },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!choferActualizado) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }

        res.json({
            mensaje: "Chofer actualizado correctamente",
            chofer: choferActualizado
        });
    };

    static borrarChofer = async (req, res) => {
        const chofer = await Chofer.findById(req.params.id);

        if (!chofer) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }

        if (chofer.idVehiculoAsignado || chofer.idRutaActual) {
            return res.status(409).json({
                mensaje: "No se puede eliminar el chofer porque tiene un vehículo o ruta asignada"
            });
        }   

        await Chofer.findByIdAndDelete(req.params.id);  

        res.json({
            mensaje: "Chofer eliminado correctamente"
        });
    };
};



class AsignacionesController {
    // Asignaciones y lógicas entre chofer y vehículo
    static asignarVehiculoAChofer = async (req, res) => {
        // Chequeo de existencia de chofer y vehículo
        const chofer = await Chofer.findById(req.params.idChofer);
        if (!chofer) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }

        const vehiculo = await Vehiculo.findById(req.params.idVehiculo);
        if (!vehiculo) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }

        // Usamos los métodos de las clases para asignar y validar
        const resultadoAsignacionChofer = chofer.asignarVehiculo(req.params.idVehiculo);
        if (!resultadoAsignacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionChofer.message });
        }

        const resultadoAsignacionVehiculo = vehiculo.asignarChofer(req.params.idChofer);
        if (!resultadoAsignacionVehiculo.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionVehiculo.message });
        }

        await chofer.save();
        await vehiculo.save();

        res.json({
            mensaje: "Vehículo asignado correctamente al chofer",
            chofer,
            vehiculo
        });
    };


    static liberarVehiculoDeChofer = async (req, res) => {
        // Chequeo de existencia de chofer y vehículo
        const chofer = await Chofer.findById(req.params.idChofer);
        if (!chofer) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }

        const vehiculo = await Vehiculo.findById(chofer.idVehiculoAsignado);
        if (!vehiculo) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }

        // Control adicional para que no se libere cualquier cosa por error
        if (chofer.idVehiculoAsignado && !chofer.idVehiculoAsignado.equals(vehiculo._id)) {
            return res.status(400).json({ mensaje: "El chofer no tiene asignado este vehículo" });
        }

        // Usamos los métodos de las clases para liberar y validar
        const resultadoLiberacionChofer = chofer.liberarVehiculo();
        if (!resultadoLiberacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionChofer.message });
        }

        const resultadoLiberacionVehiculo = vehiculo.liberarChofer();
        if (!resultadoLiberacionVehiculo.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionVehiculo.message });
        }

        await chofer.save();
        await vehiculo.save();

        res.json({
            mensaje: "Vehículo liberado correctamente del chofer",
            chofer,
            vehiculo
        });
    };

    // Asignaciones y lógicas entre chofer y ruta (sigamos los mismos patrones que en la asignación de vehículo a chofer)
    static asignarRutaAChofer = async (req, res) => {
        const chofer = await Chofer.findById(req.params.idChofer);
        if (!chofer) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }

        const ruta = await Ruta.findById(req.params.idRuta);
        if (!ruta) {
            return res.status(404).json({ mensaje: "Ruta no encontrada" });
        }

        const resultadoAsignacionChofer = chofer.asignarRuta(req.params.idRuta);
        if (!resultadoAsignacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionChofer.message });
        }

        const resultadoAsignacionRuta = ruta.asignarChofer(req.params.idChofer);
        if (!resultadoAsignacionRuta.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionRuta.message });
        }

        await chofer.save();
        await ruta.save();

        res.json({
            mensaje: "Ruta asignada correctamente al chofer",
            chofer,
            ruta
        });
    };

    // Copio el formato de liberarVehiculoDeChofer para liberarRutaDeChofer
    static finalizarRutaDeChofer = async (req, res) => {
        const chofer = await Chofer.findById(req.params.idChofer);
        if (!chofer) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }

        const ruta = await Ruta.findById(req.params.idRuta);
        if (!ruta) {
            return res.status(404).json({ mensaje: "Ruta no encontrada" });
        }

        if (!chofer.idRutaActual || !chofer.idRutaActual.equals(ruta._id)) {
            return res.status(400).json({ mensaje: "El chofer no tiene asignada esta ruta" });
        }

        const resultadoFinalizacionChofer = chofer.finalizarRuta();
        if (!resultadoFinalizacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoFinalizacionChofer.message });
        }

        const resultadoLiberacionRuta = ruta.liberarChofer();
        if (!resultadoLiberacionRuta.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionRuta.message });
        }

        await chofer.save();
        await ruta.save();

        res.json({
            mensaje: "Ruta finalizada correctamente por el chofer",
            chofer,
            ruta
        });
    };
}

export {
    VehiculoController,
    RutaController,
    ChoferController,
    AsignacionesController
}

