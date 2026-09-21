const fs = require('fs');
const path = require('path');

// Todo lo que se repite tiene el mismo formato así debugueamos más fácil
// Importar modelos
const {Vehiculo} = require('../models/Vehiculo');
const {Ruta} = require('../models/Ruta');
const {Chofer} = require('../models/Chofer');

function devolverRuta(nombreArchivo){
    return path.join(__dirname, "..", "data", nombreArchivo);
}
// unificando lectura
//se crea clase para que si se agregan datos, simplemente se define en la propiedad la ruta del archivo, y luego se llama a los métodos 
//del archivo que se desea leer 
class RepositorioJson {
    constructor(){
        this.clientes = devolverRuta("clientes.json");
        this.vehiculos = devolverRuta("vehiculos.json");
        this.choferes = devolverRuta("choferes.json");
        this.rutas = devolverRuta("rutas.json");
        this.pedidos = devolverRuta("pedidos.json");
    }

    leerArchivo(nombre){
        const data = fs.readFileSync(this[nombre], 'utf-8');
        const parsedData = JSON.parse(data);
        return parsedData;
    }

    guardarArchivo(nombre, data){
        const stringData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this[nombre], stringData);
    }
}

// // Obtener datos de JSONs
// const obtenerVehiculos = (req, res) => {
//     const vehiculos = leerVehiculos();
//     res.json(vehiculos);
// };
// const obtenerRutas = (req, res) => {
//     const rutas = leerRutas();
//     res.json(rutas);
// };
// const obtenerChoferes = (req, res) => {
//     const choferes = leerChoferes();
//     res.json(choferes);
// };

// // Importar archivos JSON
// const rutaArchivoVehiculos = path.join(__dirname, '../data/vehiculos.json');
// const rutaArchivoRutas = path.join(__dirname, '../data/rutas.json');
// const rutaArchivoChoferes = path.join(__dirname, '../data/choferes.json');


// // Lectura de archivos JSON
// const leerVehiculos = () => {
//     const data = fs.readFileSync(rutaArchivoVehiculos, 'utf-8');
//     return JSON.parse(data);
// };
// const leerRutas = () => {
//     const data = fs.readFileSync(rutaArchivoRutas, 'utf-8');
//     return JSON.parse(data);
// };
// const leerChoferes = () => {
//     const data = fs.readFileSync(rutaArchivoChoferes, 'utf-8');
//     return JSON.parse(data);
// };
// Guardado de archivos JSON

// const guardarVehiculos = (vehiculos) => {
//     fs.writeFileSync(rutaArchivoVehiculos, JSON.stringify(vehiculos, null, 2));
// };
// const guardarRutas = (rutas) => {
//     fs.writeFileSync(rutaArchivoRutas, JSON.stringify(rutas, null, 2));
// };
// const guardarChoferes = (choferes) => {
//     fs.writeFileSync(rutaArchivoChoferes, JSON.stringify(choferes, null, 2));
// };



class VehiculoController{
    static obtenerVehiculos = (req, res) => {
        const repoJson = new RepositorioJson();
        const vehiculos = repoJson.leerArchivo("vehiculos");
        res.json(vehiculos);
        };

    static obtenerVehiculoPorId = (req, res) => {
        const repoJson = new RepositorioJson();
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const id = parseInt(req.params.id);
        const vehiculo = vehiculos.find(v => v.id === id);
        
        if (!vehiculo) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }
        
        res.json(vehiculo);
        };

    static crearVehiculo = (req, res) => {
        const repoJson = new RepositorioJson();
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const { id, patente, marca, modelo, capacidad, estado, idChoferAsignado } = req.body;

        const vehiculoExistente = vehiculos.find(v => v.id === id);
        const patenteExistente = vehiculos.find(v => v.patente === patente);

        if (vehiculoExistente) {
            return res.status(400).json({
                mensaje: "Vehículo ya existe con ese ID"
            });
        }
        if (patenteExistente) {
            return res.status(400).json({
                mensaje: "Vehículo ya existe con esa patente"
            });
        }

        const nuevoVehiculo = { id, patente, marca, modelo, capacidad, estado, idChoferAsignado };
        vehiculos.push(nuevoVehiculo);
        repoJson.guardarArchivo("vehiculos", vehiculos);

        res.status(201).json({
            mensaje: "Vehículo creado correctamente",
            vehiculo: nuevoVehiculo
        });
    };

    static actualizarVehiculo = (req, res) => {
        const repoJson = new RepositorioJson();
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const id = parseInt(req.params.id);
        const vehiculoIndex = vehiculos.findIndex(v => v.id === id);

        if (vehiculoIndex === -1) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        const { patente, marca, modelo, capacidad, estado, idChoferAsignado } = req.body;
        vehiculos[vehiculoIndex] = { ...vehiculos[vehiculoIndex], patente, marca, modelo, capacidad, estado, idChoferAsignado };

        repoJson.guardarArchivo("vehiculos", vehiculos);

        res.json({
            mensaje: "Vehículo actualizado correctamente",
            vehiculo: vehiculos[vehiculoIndex]
        });
    };

    static borrarVehiculo = (req, res) => {
        const repoJson = new RepositorioJson();
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const id = parseInt(req.params.id);
        const vehiculoIndex = vehiculos.findIndex(v => v.id === id);

        if (vehiculoIndex === -1) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        vehiculos.splice(vehiculoIndex, 1);
        repoJson.guardarArchivo("vehiculos", vehiculos);

        res.json({
            mensaje: "Vehículo eliminado correctamente"
        });
    };

};

class RutaController {
    static obtenerRutas = (req, res) => {
        const repoJson = new RepositorioJson();
        const rutas = repoJson.leerArchivo("rutas");
        res.json(rutas);
    };

    static obtenerRutaPorId = (req, res) => {
        const repoJson = new RepositorioJson();
        const rutas = repoJson.leerArchivo("rutas");
        const id = parseInt(req.params.id);
        const ruta = rutas.find(r => r.id === id);
        
        if (!ruta) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }
        
        res.json(ruta);
    };

    static crearRuta = (req, res) => {
        const repoJson = new RepositorioJson();
        const rutas = repoJson.leerArchivo("rutas");
        const { id, nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado } = req.body;

        const rutaExistente = rutas.find(r => r.id === id);

        if (rutaExistente) {
            return res.status(400).json({
                mensaje: "Ruta ya existe con ese ID"
            });
        }

        const nuevaRuta = { id, nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado };
        rutas.push(nuevaRuta);
        repoJson.guardarArchivo("rutas", rutas);

        res.status(201).json({
            mensaje: "Ruta creada correctamente",
            ruta: nuevaRuta
        });
    };

    static actualizarRuta = (req, res) => {
        const repoJson = new RepositorioJson();
        const rutas = repoJson.leerArchivo("rutas");
        const id = parseInt(req.params.id);
        const rutaIndex = rutas.findIndex(r => r.id === id);

        if (rutaIndex === -1) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }

        const { nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado } = req.body;
        rutas[rutaIndex] = { ...rutas[rutaIndex], nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado };

        repoJson.guardarArchivo("rutas", rutas);

        res.json({
            mensaje: "Ruta actualizada correctamente",
            ruta: rutas[rutaIndex]
        });
    };

    static borrarRuta = (req, res) => {
        const repoJson = new RepositorioJson();
        const rutas = repoJson.leerArchivo("rutas");
        const id = parseInt(req.params.id);
        const rutaIndex = rutas.findIndex(r => r.id === id);

        if (rutaIndex === -1) {
            return res.status(404).json({
                mensaje: "Ruta no encontrada"
            });
        }

        rutas.splice(rutaIndex, 1);
        repoJson.guardarArchivo("rutas", rutas);

        res.json({
            mensaje: "Ruta eliminada correctamente"
        });
    };

};


class ChoferController {
    static obtenerChoferes = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        res.json(choferes);
    };

    static obtenerChoferPorId = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const id = parseInt(req.params.id);
        const chofer = choferes.find(c => c.id === id);
        
        if (!chofer) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }
        
        res.json(chofer);
    };

    static verChoferes = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        res.render('choferes', { choferes });
    }

    static crearChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const { id, nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso } = req.body;   
        
        const choferExistente = choferes.find(c => c.id === id);
        const dniExistente = choferes.find(c => c.dni === dni);

        if (choferExistente) {
            return res.status(400).json({
                mensaje: "Chofer ya existe con ese ID"
            });
        }
        if (dniExistente) {
            return res.status(400).json({
                mensaje: "Chofer ya existe con ese DNI"
            });
        }

        const nuevoChofer = { id, nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso };
        choferes.push(nuevoChofer);
        repoJson.guardarArchivo("choferes", choferes);

        res.status(201).json({
            mensaje: "Chofer creado correctamente",
            chofer: nuevoChofer
        });
    };

    static actualizarChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const id = parseInt(req.params.id);
        const choferIndex = choferes.findIndex(c => c.id === id);

        if (choferIndex === -1) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }

        const { nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso } = req.body;
        choferes[choferIndex] = { ...choferes[choferIndex], nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso };

        repoJson.guardarArchivo("choferes", choferes);

        res.json({
            mensaje: "Chofer actualizado correctamente",
            chofer: choferes[choferIndex]
        });
    };

    static borrarChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const id = parseInt(req.params.id);
        const choferIndex = choferes.findIndex(c => c.id === id);

        if (choferIndex === -1) {
            return res.status(404).json({
                mensaje: "Chofer no encontrado"
            });
        }

        choferes.splice(choferIndex, 1);
        repoJson.guardarArchivo("choferes", choferes);

        res.json({
            mensaje: "Chofer eliminado correctamente"
        });
    };
};



class AsignacionesController {
// Asignaciones y lógicas entre chofer y vehículo
    static asignarVehiculoAChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const idChofer = parseInt(req.params.idChofer);
        const idVehiculo = parseInt(req.params.idVehiculo);

        // Necesito los índices para instanciarlos después y usar los métodos internos de las clases
        const choferIndex = choferes.findIndex(c => c.id === idChofer);
        if (choferIndex === -1) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }
        
        const vehiculoIndex = vehiculos.findIndex(v => v.id === idVehiculo);
        if (vehiculoIndex === -1) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }

        // Instancio los objetos para poder usar los métodos de las clases
        const ChoferObj = new Chofer(choferes[choferIndex]);
        const VehiculoObj = new Vehiculo(vehiculos[vehiculoIndex]);

        // Intento asignar el vehículo al chofer
        const resultadoAsignacionChofer = ChoferObj.asignarVehiculo(idVehiculo);
        if (!resultadoAsignacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionChofer.message }); // Devuelve el mensaje de error del método de la clase
        }

        const resultadoAsignacionVehiculo = VehiculoObj.asignarChofer(idChofer);
        if (!resultadoAsignacionVehiculo.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionVehiculo.message }); // Idem arriba
        }

        // Si todo salió bien, actualizo los datos en los arrays y guardo
        choferes[choferIndex] = {...ChoferObj}; // Actualizo el objeto con los cambios realizados por el método de la clase y los "pego" al array en el índice correspondiente
        vehiculos[vehiculoIndex] = {...VehiculoObj};
        repoJson.guardarArchivo("choferes", choferes);
        repoJson.guardarArchivo("vehiculos", vehiculos);

        res.json({
            mensaje: "Vehículo asignado correctamente al chofer",
            chofer: choferes[choferIndex],
            vehiculo: vehiculos[vehiculoIndex]
        });
    };


    static liberarVehiculoDeChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const vehiculos = repoJson.leerArchivo("vehiculos");
        const idChofer = parseInt(req.params.idChofer);
        const idVehiculo = parseInt(req.params.idVehiculo);

        const choferIndex = choferes.findIndex(c => c.id === idChofer);
        if (choferIndex === -1) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }
        
        const vehiculoIndex = vehiculos.findIndex(v => v.id === idVehiculo);
        if (vehiculoIndex === -1) {
            return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        }
        
        const ChoferObj = new Chofer(choferes[choferIndex]);
        const VehiculoObj = new Vehiculo(vehiculos[vehiculoIndex]);

        const resultadoLiberacionChofer = ChoferObj.liberarVehiculo();
        if (!resultadoLiberacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionChofer.message });
        }

        const resultadoLiberacionVehiculo = VehiculoObj.liberarChofer();
        if (!resultadoLiberacionVehiculo.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionVehiculo.message });
        }

        // Si todo salió bien, actualizo los datos en los arrays y guardo
        choferes[choferIndex] = {...ChoferObj};
        vehiculos[vehiculoIndex] = {...VehiculoObj};
        repoJson.guardarArchivo("choferes", choferes);
        repoJson.guardarArchivo("vehiculos", vehiculos);

        res.json({
            mensaje: "Vehículo liberado correctamente del chofer",
            chofer: choferes[choferIndex],
            vehiculo: vehiculos[vehiculoIndex]
        });
    };

// Asignaciones y lógicas entre chofer y ruta (sigamos los mismos patrones que en la asignación de vehículo a chofer)
    static asignarRutaAChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const rutas = repoJson.leerArchivo("rutas");
        const idChofer = parseInt(req.params.idChofer);
        const idRuta = parseInt(req.params.idRuta);

        const choferIndex = choferes.findIndex(c => c.id === idChofer);
        if (choferIndex === -1) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }
        const rutaIndex = rutas.findIndex(r => r.id === idRuta);
        if (rutaIndex === -1) {
            return res.status(404).json({ mensaje: "Ruta no encontrada" });
        }

        const ChoferObj = new Chofer(choferes[choferIndex]);
        const RutaObj = new Ruta(rutas[rutaIndex]);

        const resultadoAsignacionChofer = ChoferObj.asignarRuta(idRuta);
        if (!resultadoAsignacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionChofer.message });
        }
        const resultadoAsignacionRuta = RutaObj.asignarChofer(idChofer);
        if (!resultadoAsignacionRuta.success) {
            return res.status(400).json({ mensaje: resultadoAsignacionRuta.message });
        }

        choferes[choferIndex] = {...ChoferObj};
        rutas[rutaIndex] = {...RutaObj};
        repoJson.guardarArchivo("choferes", choferes);
        repoJson.guardarArchivo("rutas", rutas);

        res.json({
            mensaje: "Ruta asignada correctamente al chofer",
            chofer: choferes[choferIndex],
            ruta: rutas[rutaIndex]
        });
    };

    static finalizarRutaDeChofer = (req, res) => {
        const repoJson = new RepositorioJson();
        const choferes = repoJson.leerArchivo("choferes");
        const rutas = repoJson.leerArchivo("rutas");
        const idChofer = parseInt(req.params.idChofer);
        const idRuta = parseInt(req.params.idRuta);

        const choferIndex = choferes.findIndex(c => c.id === idChofer);
        if (choferIndex === -1) {
            return res.status(404).json({ mensaje: "Chofer no encontrado" });
        }
        const rutaIndex = rutas.findIndex(r => r.id === idRuta);
        if (rutaIndex === -1) {
            return res.status(404).json({ mensaje: "Ruta no encontrada" });
        }

        const ChoferObj = new Chofer(choferes[choferIndex]);
        const RutaObj = new Ruta(rutas[rutaIndex]);

        const resultadoFinalizacionChofer = ChoferObj.finalizarRuta();
        if (!resultadoFinalizacionChofer.success) {
            return res.status(400).json({ mensaje: resultadoFinalizacionChofer.message });
        }
        const resultadoLiberacionRuta = RutaObj.liberarChofer();
        if (!resultadoLiberacionRuta.success) {
            return res.status(400).json({ mensaje: resultadoLiberacionRuta.message });
        }

        choferes[choferIndex] = {...ChoferObj};
        rutas[rutaIndex] = {...RutaObj};
        repoJson.guardarArchivo("choferes", choferes);
        repoJson.guardarArchivo("rutas", rutas);

        res.json({
            mensaje: "Ruta finalizada correctamente por el chofer",
            chofer: choferes[choferIndex],
            ruta: rutas[rutaIndex]
        });
    };
}



module.exports = {
    RepositorioJson,
    VehiculoController,
    RutaController,
    ChoferController,
    AsignacionesController
}