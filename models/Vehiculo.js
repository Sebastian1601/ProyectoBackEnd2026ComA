export class Vehiculo {
    constructor({id, patente, marca, modelo, capacidad, estado, idChoferAsignado}) {
        this.id = id;
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.capacidad = capacidad; // Ver si conviene hacerlo preciso o poner genéricos como "Pequeño", "Mediano", "Grande"
        this.estado = estado; // Seteemos estados con inicio en mayúscula: Disponible, Asignado, En Mantenimiento, Fuera de Servicio
        this.idChoferAsignado = idChoferAsignado;
    }

    asignarChofer(idChofer) {
        if (this.estado !== 'Disponible') {
            return {success: false, message: 'El vehículo no está disponible y no puede ser asignado a un chofer.'};

        }
        else if (this.idChoferAsignado || this.estado === 'Asignado') {
            return {success: false, message: 'El vehículo ya tiene un chofer asignado.'};
        }
        else {
            this.idChoferAsignado = idChofer;
            this.estado = 'Asignado'; // Cambio el estado del vehículo a Asignado al asignarle un chofer
            return {success: true, message: 'Chofer asignado correctamente.'};
        }
    }

    liberarChofer() {
        if (!this.idChoferAsignado || this.estado !== 'Asignado') {
            return {success: false, message: 'El vehículo no tiene un chofer asignado y no puede ser liberado.'};
        }
        else {
            this.idChoferAsignado = null;
            this.estado = 'Disponible'; // Quito chofer y libero el estado
            return {success: true, message: 'Chofer liberado correctamente.'};
        }
    }

}
