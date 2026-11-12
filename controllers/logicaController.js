// Importar modelos
import Vehiculo from '../models/Vehiculo.js';
import Ruta from '../models/Ruta.js';
import Chofer from '../models/Chofer.js';
import { NotFoundError, ConflictError } from '../ErrorControl/Errores.js';

// Todas las respuestas exitosas siguen el mismo formato: { mensaje, data }.
// Los errores (no encontrados, conflictos de negocio y validaciones) se lanzan
// y se propagan con next(err) hacia el manejador central de errores.

class VehiculoController {
    static async obtenerVehiculos(req, res, next) {
        try {
            const vehiculos = await Vehiculo.find();

            res.status(200).json({
                mensaje: "Listado de vehículos obtenido correctamente",
                data: vehiculos
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerVehiculoPorId(req, res, next) {
        try {
            const vehiculo = await Vehiculo.findById(req.params.id);

            if (!vehiculo) {
                throw new NotFoundError("Vehículo no encontrado");
            }

            res.status(200).json({
                mensaje: "Vehículo obtenido correctamente",
                data: vehiculo
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearVehiculo(req, res, next) {
        try {
            const { patente, marca, modelo, capacidad } = req.body;

            // No pasar estado por acá, lo define el esquema con el default "Disponible"
            const nuevoVehiculo = new Vehiculo({ patente, marca, modelo, capacidad });
            await nuevoVehiculo.save();

            res.status(201).json({
                mensaje: "Vehículo creado correctamente",
                data: nuevoVehiculo
            });
        } catch (error) {
            next(error);
        }
    };

    static async actualizarVehiculo(req, res, next) {
        try {
            const { patente, marca, modelo, capacidad, estado } = req.body;
            // El chofer se maneja desde la asignación de chofer a vehículo, no se pasa por acá

            const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
                req.params.id,
                { patente, marca, modelo, capacidad, estado },
                {
                    returnDocument: 'after', // Devuelve el documento actualizado
                    runValidators: true // Ejecuta las validaciones definidas en el esquema
                }
            );

            if (!vehiculoActualizado) {
                throw new NotFoundError("Vehículo no encontrado");
            }

            res.status(200).json({
                mensaje: "Vehículo actualizado correctamente",
                data: vehiculoActualizado
            });
        } catch (error) {
            next(error);
        }
    };

    static async borrarVehiculo(req, res, next) {
        try {
            const vehiculo = await Vehiculo.findById(req.params.id);

            if (!vehiculo) {
                throw new NotFoundError("Vehículo no encontrado");
            }

            if (vehiculo.idChoferAsignado) {
                throw new ConflictError("No se puede eliminar un vehículo que tiene un chofer asignado");
            }

            await vehiculo.deleteOne();

            res.status(200).json({
                mensaje: "Vehículo eliminado correctamente",
                data: vehiculo
            });
        } catch (error) {
            next(error);
        }
    };

};

class RutaController {
    static async obtenerRutas(req, res, next) {
        try {
            const rutas = await Ruta.find();

            res.status(200).json({
                mensaje: "Listado de rutas obtenido correctamente",
                data: rutas
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerRutaPorId(req, res, next) {
        try {
            const ruta = await Ruta.findById(req.params.id);

            if (!ruta) {
                throw new NotFoundError("Ruta no encontrada");
            }

            res.status(200).json({
                mensaje: "Ruta obtenida correctamente",
                data: ruta
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearRuta(req, res, next) {
        try {
            const { nombre, origen, destino, duracionEstimada, distanciaEstimada } = req.body;

            const nuevaRuta = new Ruta({ nombre, origen, destino, duracionEstimada, distanciaEstimada });
            await nuevaRuta.save();

            res.status(201).json({
                mensaje: "Ruta creada correctamente",
                data: nuevaRuta
            });
        } catch (error) {
            next(error);
        }
    };

    static async actualizarRuta(req, res, next) {
        try {
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
                throw new NotFoundError("Ruta no encontrada");
            }

            res.status(200).json({
                mensaje: "Ruta actualizada correctamente",
                data: rutaActualizada
            });
        } catch (error) {
            next(error);
        }
    };

    static async borrarRuta(req, res, next) {
        try {
            const ruta = await Ruta.findById(req.params.id);

            if (!ruta) {
                throw new NotFoundError("Ruta no encontrada");
            }

            if (ruta.idChoferAsignado) {
                throw new ConflictError("No se puede eliminar una ruta que tiene un chofer asignado");
            }

            await ruta.deleteOne();

            res.status(200).json({
                mensaje: "Ruta eliminada correctamente",
                data: ruta
            });
        } catch (error) {
            next(error);
        }
    };

};


class ChoferController {
    static async obtenerChoferes(req, res, next) {
        try {
            const choferes = await Chofer.find();

            res.status(200).json({
                mensaje: "Listado de choferes obtenido correctamente",
                data: choferes
            });
        } catch (error) {
            next(error);
        }
    };

    static async obtenerChoferPorId(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.id);

            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            res.status(200).json({
                mensaje: "Chofer obtenido correctamente",
                data: chofer
            });
        } catch (error) {
            next(error);
        }
    };

    static async crearChofer(req, res, next) {
        try {
            const { nombre, apellido, dni, numeroRegistro, telefono, estado, fechaIngreso } = req.body;

            const nuevoChofer = new Chofer({
                nombre, apellido, dni, numeroRegistro, telefono, fechaIngreso,
                estado: estado ?? "Disponible" // Si no se pasa estado, queda "Disponible"
            });
            await nuevoChofer.save();

            res.status(201).json({
                mensaje: "Chofer creado correctamente",
                data: nuevoChofer
            });
        } catch (error) {
            next(error);
        }
    };

    static async actualizarChofer(req, res, next) {
        try {
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
                throw new NotFoundError("Chofer no encontrado");
            }

            res.status(200).json({
                mensaje: "Chofer actualizado correctamente",
                data: choferActualizado
            });
        } catch (error) {
            next(error);
        }
    };

    static async borrarChofer(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.id);

            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            if (chofer.idVehiculoAsignado || chofer.idRutaActual) {
                throw new ConflictError("No se puede eliminar el chofer porque tiene un vehículo o ruta asignada");
            }

            await chofer.deleteOne();

            res.status(200).json({
                mensaje: "Chofer eliminado correctamente",
                data: chofer
            });
        } catch (error) {
            next(error);
        }
    };
};



class AsignacionesController {

    // Devuelve true si la operación fue posible; si no, lanza el error correspondiente.
    static #exigirExito(resultado) {
        if (!resultado.success) {
            throw new ConflictError(resultado.message);
        }
    };

    // Asignaciones y lógicas entre chofer y vehículo
    static async asignarVehiculoAChofer(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.idChofer);
            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            const vehiculo = await Vehiculo.findById(req.params.idVehiculo);
            if (!vehiculo) {
                throw new NotFoundError("Vehículo no encontrado");
            }

            // Usamos los métodos de los esquemas para asignar y validar
            AsignacionesController.#exigirExito(chofer.asignarVehiculo(req.params.idVehiculo));
            AsignacionesController.#exigirExito(vehiculo.asignarChofer(req.params.idChofer));

            await chofer.save();
            await vehiculo.save();

            res.status(200).json({
                mensaje: "Vehículo asignado correctamente al chofer",
                data: { chofer, vehiculo }
            });
        } catch (error) {
            next(error);
        }
    };


    static async liberarVehiculoDeChofer(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.idChofer);
            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            const vehiculo = await Vehiculo.findById(chofer.idVehiculoAsignado);
            if (!vehiculo) {
                throw new NotFoundError("Vehículo no encontrado");
            }

            // Control adicional para que no se libere cualquier cosa por error
            if (chofer.idVehiculoAsignado && !chofer.idVehiculoAsignado.equals(vehiculo._id)) {
                throw new ConflictError("El chofer no tiene asignado este vehículo");
            }

            // Usamos los métodos de los esquemas para liberar y validar
            AsignacionesController.#exigirExito(chofer.liberarVehiculo());
            AsignacionesController.#exigirExito(vehiculo.liberarChofer());

            await chofer.save();
            await vehiculo.save();

            res.status(200).json({
                mensaje: "Vehículo liberado correctamente del chofer",
                data: { chofer, vehiculo }
            });
        } catch (error) {
            next(error);
        }
    };

    // Asignaciones y lógicas entre chofer y ruta (mismo patrón que asignar vehículo a chofer)
    static async asignarRutaAChofer(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.idChofer);
            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            const ruta = await Ruta.findById(req.params.idRuta);
            if (!ruta) {
                throw new NotFoundError("Ruta no encontrada");
            }

            AsignacionesController.#exigirExito(chofer.asignarRuta(req.params.idRuta));
            AsignacionesController.#exigirExito(ruta.asignarChofer(req.params.idChofer));

            await chofer.save();
            await ruta.save();

            res.status(200).json({
                mensaje: "Ruta asignada correctamente al chofer",
                data: { chofer, ruta }
            });
        } catch (error) {
            next(error);
        }
    };

    static async finalizarRutaDeChofer(req, res, next) {
        try {
            const chofer = await Chofer.findById(req.params.idChofer);
            if (!chofer) {
                throw new NotFoundError("Chofer no encontrado");
            }

            const ruta = await Ruta.findById(req.params.idRuta);
            if (!ruta) {
                throw new NotFoundError("Ruta no encontrada");
            }

            if (!chofer.idRutaActual || !chofer.idRutaActual.equals(ruta._id)) {
                throw new ConflictError("El chofer no tiene asignada esta ruta");
            }

            AsignacionesController.#exigirExito(chofer.finalizarRuta());
            AsignacionesController.#exigirExito(ruta.liberarChofer());

            await chofer.save();
            await ruta.save();

            res.status(200).json({
                mensaje: "Ruta finalizada correctamente por el chofer",
                data: { chofer, ruta }
            });
        } catch (error) {
            next(error);
        }
    };
}

export {
    VehiculoController,
    RutaController,
    ChoferController,
    AsignacionesController
}
