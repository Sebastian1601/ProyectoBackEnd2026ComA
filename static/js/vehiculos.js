console.log("vinculado js de vehiculos");

const botonGuardar = document.querySelector("#formIngresoClientes button[type='submit']");
const form = document.querySelector("#formIngresoClientes");
if (form && form.elements["patente"]) {
    form.elements["patente"].focus();
}

const tabla = document.querySelector("#tabla-clientes");
const ENDPOINT = '/apiV1/vehiculos/';
const ENDPOINT_CHOFERES = '/apiV1/choferes/';

const cuerpo = (datos, metodo) => {
    return {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    };
};

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const datosVehiculo = Object.fromEntries(formData);
        const idChoferParaAsignar = datosVehiculo.idChoferAsignado;
        delete datosVehiculo.idChoferAsignado;

        try {
            let idVehiculoResult;
            if (datosVehiculo.id && datosVehiculo.id !== "") {
                console.log("Actualizando vehículo...");
                idVehiculoResult = datosVehiculo.id;
                await actualizarVehiculo(datosVehiculo);
            } else {
                console.log("Guardando nuevo vehículo...");
                delete datosVehiculo.id;
                const nuevo = await guardarNuevoVehiculo(datosVehiculo);
                idVehiculoResult = nuevo.vehiculo ? nuevo.vehiculo._id : null;
            }

            // Si se seleccionó un chofer para asignar
            if (idChoferParaAsignar && idChoferParaAsignar !== "" && idVehiculoResult) {
                await asignarChofer(idChoferParaAsignar, idVehiculoResult);
            }

            location.reload();
        } catch (err) {
            alert(err.message || "Error al procesar la solicitud");
            console.error(err);
        }
    });
}

async function guardarNuevoVehiculo(datosVehiculo) {
    const response = await fetch(ENDPOINT, cuerpo(datosVehiculo, 'POST'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al guardar vehículo");
    }
    return data;
}

async function actualizarVehiculo(vehiculo) {
    const response = await fetch(`${ENDPOINT}${vehiculo.id}`, cuerpo(vehiculo, 'PUT'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al actualizar vehículo");
    }
    return data;
}

async function asignarChofer(idChofer, idVehiculo) {
    const res = await fetch(`${ENDPOINT_CHOFERES}${idChofer}/asignar-vehiculo/${idVehiculo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.mensaje || "Error al asignar chofer");
    }
    return data;
}

async function liberarChofer(idChofer, idVehiculo) {
    const res = await fetch(`${ENDPOINT_CHOFERES}${idChofer}/liberar-vehiculo/${idVehiculo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.mensaje || "Error al liberar chofer");
    }
    return data;
}

if (tabla) {
    tabla.addEventListener("click", async function (e) {
        const boton = e.target.closest('button[data-action]');
        if (!boton) return;

        const accion = boton.dataset.action;

        switch (accion) {
            case "editar":
                try {
                    const id = boton.dataset.id;
                    const vehiculo = await obtenerVehiculo(id);
                    cargarDatosAForm(vehiculo);
                } catch (err) {
                    alert(err.message);
                }
                break;
            case "eliminar":
                if (confirm("¿Estás seguro de que querés eliminar este vehículo?")) {
                    try {
                        const id = boton.dataset.id;
                        await eliminarVehiculo(id);
                        location.reload();
                    } catch (err) {
                        alert(err.message);
                    }
                }
                break;
            case "liberar":
                if (confirm("¿Querés desvincular el chofer asignado a este vehículo?")) {
                    try {
                        const idVehiculo = boton.dataset.idVehiculo;
                        const idChofer = boton.dataset.idChofer;
                        await liberarChofer(idChofer, idVehiculo);
                        location.reload();
                    } catch (err) {
                        alert(err.message);
                    }
                }
                break;
            default:
                break;
        }
    });
}

async function obtenerVehiculo(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    const datos = await response.json();
    if (!response.ok) {
        throw new Error(datos.mensaje || datos.message || "Error al obtener los datos del vehículo");
    }
    return datos;
}

async function eliminarVehiculo(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al eliminar el vehículo");
    }
    return data;
}

function cargarDatosAForm(vehiculo) {
    form.elements["id"].value = vehiculo._id;
    form.elements["patente"].value = vehiculo.patente || '';
    form.elements["marca"].value = vehiculo.marca || '';
    form.elements["modelo"].value = vehiculo.modelo || '';

    const capacidad = vehiculo.capacidad || 'Pequeño';
    const radioCapacidad = form.querySelector(`input[name="capacidad"][value="${capacidad}"]`);
    if (radioCapacidad) {
        radioCapacidad.checked = true;
    }

    const estado = vehiculo.estado || 'Disponible';
    const radioEstado = form.querySelector(`input[name="estado"][value="${estado}"]`);
    if (radioEstado) {
        radioEstado.checked = true;
    }

    if (form.elements["idChoferAsignado"]) {
        form.elements["idChoferAsignado"].value = vehiculo.idChoferAsignado ? String(vehiculo.idChoferAsignado) : '';
    }

    botonGuardar.textContent = "Actualizar Datos del Vehículo";
    form.elements["patente"].focus();
}
