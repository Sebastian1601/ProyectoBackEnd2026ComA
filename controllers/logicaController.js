const fs = require('fs');
const path = require('path');

// Todo lo que se repite tiene el mismo formato así debugueamos más fácil
// Importar modelos
const Vehiculo = require('../models/Vehiculo');
const Ruta = require('../models/Ruta');
const Chofer = require('../models/Chofer');


// Importar archivos JSON
const rutaArchivoVehiculos = path.join(__dirname, '../data/vehiculos.json');
const rutaArchivoRutas = path.join(__dirname, '../data/rutas.json');
const rutaArchivoChoferes = path.join(__dirname, '../data/choferes.json');


// Lectura de archivos JSON
const leerVehiculos = () => {
    const data = fs.readFileSync(rutaArchivoVehiculos, 'utf-8');
    return JSON.parse(data);
};
const leerRutas = () => {
    const data = fs.readFileSync(rutaArchivoRutas, 'utf-8');
    return JSON.parse(data);
};
const leerChoferes = () => {
    const data = fs.readFileSync(rutaArchivoChoferes, 'utf-8');
    return JSON.parse(data);
};


// Guardado de archivos JSON
const guardarVehiculos = (vehiculos) => {
    fs.writeFileSync(rutaArchivoVehiculos, JSON.stringify(vehiculos, null, 2));
};
const guardarRutas = (rutas) => {
    fs.writeFileSync(rutaArchivoRutas, JSON.stringify(rutas, null, 2));
};
const guardarChoferes = (choferes) => {
    fs.writeFileSync(rutaArchivoChoferes, JSON.stringify(choferes, null, 2));
};


// Obtener datos de JSONs
const obtenerVehiculos = (req, res) => {
    const vehiculos = leerVehiculos();
    res.json(vehiculos);
};
const obtenerRutas = (req, res) => {
    const rutas = leerRutas();
    res.json(rutas);
};
const obtenerChoferes = (req, res) => {
    const choferes = leerChoferes();
    res.json(choferes);
};


// Obtener por ID
const obtenerVehiculoPorId = (req, res) => {
    const vehiculos = leerVehiculos();
    const id = parseInt(req.params.id);
    const vehiculo = vehiculos.find(v => v.id === id);
    
    if (!vehiculo) {
        return res.status(404).json({
            mensaje: "Vehículo no encontrado"
        });
    }
    
    res.json(vehiculo);
};

const obtenerRutaPorId = (req, res) => {
    const rutas = leerRutas();
    const id = parseInt(req.params.id);
    const ruta = rutas.find(r => r.id === id);
    
    if (!ruta) {
        return res.status(404).json({
            mensaje: "Ruta no encontrada"
        });
    }
    
    res.json(ruta);
};

const obtenerChoferPorId = (req, res) => {
    const choferes = leerChoferes();
    const id = parseInt(req.params.id);
    const chofer = choferes.find(c => c.id === id);
    
    if (!chofer) {
        return res.status(404).json({
            mensaje: "Chofer no encontrado"
        });
    }
    
    res.json(chofer);
};


// Crear nuevo elemento -> Chequeo si existe antes de crearlo así no repetimos IDs/patentes 
// o nos pega el error después de la creación
const crearVehiculo = (req, res) => {
    const vehiculos = leerVehiculos();
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
    guardarVehiculos(vehiculos);

    res.status(201).json({
        mensaje: "Vehículo creado correctamente",
        vehiculo: nuevoVehiculo
    });
};

const crearRuta = (req, res) => {
    const rutas = leerRutas();
    const { id, nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado } = req.body;

    const rutaExistente = rutas.find(r => r.id === id);

    if (rutaExistente) {
        return res.status(400).json({
            mensaje: "Ruta ya existe con ese ID"
        });
    }

    const nuevaRuta = { id, nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado };
    rutas.push(nuevaRuta);
    guardarRutas(rutas);

    res.status(201).json({
        mensaje: "Ruta creada correctamente",
        ruta: nuevaRuta
    });
};

const crearChofer = (req, res) => {
    const choferes = leerChoferes();
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
    guardarChoferes(choferes);

    res.status(201).json({
        mensaje: "Chofer creado correctamente",
        chofer: nuevoChofer
    });
};


// Actualizar elemento por ID
const actualizarVehiculo = (req, res) => {
    const vehiculos = leerVehiculos();
    const id = parseInt(req.params.id);
    const vehiculoIndex = vehiculos.findIndex(v => v.id === id);

    if (vehiculoIndex === -1) {
        return res.status(404).json({
            mensaje: "Vehículo no encontrado"
        });
    }

    const { patente, marca, modelo, capacidad, estado, idChoferAsignado } = req.body;
    vehiculos[vehiculoIndex] = { ...vehiculos[vehiculoIndex], patente, marca, modelo, capacidad, estado, idChoferAsignado };

    guardarVehiculos(vehiculos);

    res.json({
        mensaje: "Vehículo actualizado correctamente",
        vehiculo: vehiculos[vehiculoIndex]
    });
};

const actualizarRuta = (req, res) => {
    const rutas = leerRutas();
    const id = parseInt(req.params.id);
    const rutaIndex = rutas.findIndex(r => r.id === id);

    if (rutaIndex === -1) {
        return res.status(404).json({
            mensaje: "Ruta no encontrada"
        });
    }

    const { nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado } = req.body;
    rutas[rutaIndex] = { ...rutas[rutaIndex], nombre, origen, destino, duracionEstimada, distanciaEstimada, idChoferAsignado };

    guardarRutas(rutas);

    res.json({
        mensaje: "Ruta actualizada correctamente",
        ruta: rutas[rutaIndex]
    });
};

const actualizarChofer = (req, res) => {
    const choferes = leerChoferes();
    const id = parseInt(req.params.id);
    const choferIndex = choferes.findIndex(c => c.id === id);

    if (choferIndex === -1) {
        return res.status(404).json({
            mensaje: "Chofer no encontrado"
        });
    }

    const { nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso } = req.body;
    choferes[choferIndex] = { ...choferes[choferIndex], nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso };

    guardarChoferes(choferes);

    res.json({
        mensaje: "Chofer actualizado correctamente",
        chofer: choferes[choferIndex]
    });
};


// Borrado de elemento por ID
const borrarVehiculo = (req, res) => {
    const vehiculos = leerVehiculos();
    const id = parseInt(req.params.id);
    const vehiculoIndex = vehiculos.findIndex(v => v.id === id);

    if (vehiculoIndex === -1) {
        return res.status(404).json({
            mensaje: "Vehículo no encontrado"
        });
    }

    vehiculos.splice(vehiculoIndex, 1);
    guardarVehiculos(vehiculos);

    res.json({
        mensaje: "Vehículo eliminado correctamente"
    });
};

const borrarRuta = (req, res) => {
    const rutas = leerRutas();
    const id = parseInt(req.params.id);
    const rutaIndex = rutas.findIndex(r => r.id === id);

    if (rutaIndex === -1) {
        return res.status(404).json({
            mensaje: "Ruta no encontrada"
        });
    }

    rutas.splice(rutaIndex, 1);
    guardarRutas(rutas);

    res.json({
        mensaje: "Ruta eliminada correctamente"
    });
};

const borrarChofer = (req, res) => {
    const choferes = leerChoferes();
    const id = parseInt(req.params.id);
    const choferIndex = choferes.findIndex(c => c.id === id);

    if (choferIndex === -1) {
        return res.status(404).json({
            mensaje: "Chofer no encontrado"
        });
    }

    choferes.splice(choferIndex, 1);
    guardarChoferes(choferes);

    res.json({
        mensaje: "Chofer eliminado correctamente"
    });
};


// Asignaciones y lógicas entre chofer y vehículo
const asignarVehiculoAChofer = (req, res) => {
    const choferes = leerChoferes();
    const vehiculos = leerVehiculos();
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
    guardarChoferes(choferes);
    guardarVehiculos(vehiculos);

    res.json({
        mensaje: "Vehículo asignado correctamente al chofer",
        chofer: choferes[choferIndex],
        vehiculo: vehiculos[vehiculoIndex]
    });
};


const liberarVehiculoDeChofer = (req, res) => {
    const choferes = leerChoferes();
    const vehiculos = leerVehiculos();
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
    guardarChoferes(choferes);
    guardarVehiculos(vehiculos);

    res.json({
        mensaje: "Vehículo liberado correctamente del chofer",
        chofer: choferes[choferIndex],
        vehiculo: vehiculos[vehiculoIndex]
    });
};


// Asignaciones y lógicas entre chofer y ruta (sigamos los mismos patrones que en la asignación de vehículo a chofer)
const asignarRutaAChofer = (req, res) => {
    const choferes = leerChoferes();
    const rutas = leerRutas();
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
    guardarChoferes(choferes);
    guardarRutas(rutas);

    res.json({
        mensaje: "Ruta asignada correctamente al chofer",
        chofer: choferes[choferIndex],
        ruta: rutas[rutaIndex]
    });
};

const finalizarRutaDeChofer = (req, res) => {
    const choferes = leerChoferes();
    const rutas = leerRutas();
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
    guardarChoferes(choferes);
    guardarRutas(rutas);

    res.json({
        mensaje: "Ruta finalizada correctamente por el chofer",
        chofer: choferes[choferIndex],
        ruta: rutas[rutaIndex]
    });
};

