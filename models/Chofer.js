class Chofer {
    constructor({id, nombre, apellido, dni, numeroRegistro, telefono, idVehiculoAsignado, idRutaActual, estado, fechaIngreso}){
        this.id=id;
        this.nombre=nombre;
        this.apellido=apellido;
        this.dni=dni;
        this.numeroRegistro=numeroRegistro;
        this.telefono=telefono;
        this.idVehiculoAsignado=idVehiculoAsignado;
        this.idRutaActual=idRutaActual;
        this.estado=estado; // Seteemos estados con inicio en mayúscula: Disponible, Ocupado, Inactivo
        this.fechaIngreso=fechaIngreso;
    }

    asignarVehiculo(idVehiculo) { 
        // No le cambio el estado acá por si decidimos más tarde que un chofer pueda tener un vehículo asignado permanente
        // así esté en ruta o no
        if (this.estado !== 'Disponible') {
            return {success: false, message: 'El chofer no está disponible y no puede ser asignado a un vehículo.'};
        }
        else if (this.idVehiculoAsignado) {
            return {success: false, message: 'El chofer ya tiene un vehículo asignado.'};
        }
        else {
            this.idVehiculoAsignado = idVehiculo;
            return {success: true, message: 'Vehículo asignado correctamente.'};
        }
    }

    liberarVehiculo() {
        if (!this.idVehiculoAsignado) {
            return {success: false, message: 'El chofer no tiene un vehículo asignado y no puede ser liberado.'};
        }
        if (this.estado === 'Ocupado') {
            return {success: false, message: 'El chofer está en una ruta y no puede liberar su vehículo asignado.'};
        }
        else {
            this.idVehiculoAsignado = null;
            return {success: true, message: 'Vehículo liberado correctamente.'};
        }
    }


    asignarRuta(idRuta) {
        if (this.estado !== 'Disponible') {
            return {success: false, message: 'El chofer no está disponible y no puede ser asignado a una ruta.'};
        }
        else if (this.idRutaActual) {
            return {success: false, message: 'El chofer ya tiene una ruta asignada.'};
        }
        else if (!this.idVehiculoAsignado) {
            return {success: false, message: 'El chofer no tiene un vehículo asignado y no puede ser asignado a una ruta.'};
        }
        else {
            this.idRutaActual = idRuta;
            this.estado = 'Ocupado'; // Cambiamos el estado del chofer a Ocupado al asignarle una ruta
            return {success: true, message: 'Ruta asignada correctamente.'};
        }
    }

    finalizarRuta() {
        if (this.estado !== 'Ocupado') {
            return {success: false, message: 'El chofer no está en una ruta y no puede finalizarla.'};
        }
        else {
            this.idRutaActual = null;
            this.estado = 'Disponible'; // Cambiamos el estado del chofer a Disponible al finalizar la ruta
            return {success: true, message: 'Ruta finalizada correctamente.'};
        }
    }

    estadoChofer() {
        return this.estado;
    }

}