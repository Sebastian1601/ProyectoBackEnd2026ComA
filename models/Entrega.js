export class Entrega {
    constructor({id, idRuta, idChofer, idCliente, fechaEntrega, descripcion, estado}) {
        this.id = id;
        this.idRuta = idRuta;
        this.idChofer = idChofer;
        this.idCliente = idCliente;
        this.fechaEntrega = fechaEntrega;
        this.descripcion = descripcion;
        this.estado = estado; // Seteemos estados con inicio en mayúscula: Pendiente, En Proceso, Completada, Cancelada
    }
}
