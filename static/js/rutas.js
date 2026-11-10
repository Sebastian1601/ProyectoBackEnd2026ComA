console.log("vinculado js de rutas");

const botonGuardar = document.querySelector("#formIngresoClientes button[type='submit']");
const form = document.querySelector("#formIngresoClientes");
if (form && form.elements["nombre"]) {
    form.elements["nombre"].focus();
}

const tabla = document.querySelector("#tabla-clientes");
const ENDPOINT = '/apiV1/rutas/';
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
        const datosRuta = Object.fromEntries(formData);
        const idChoferParaAsignar = datosRuta.idChoferAsignado;
        delete datosRuta.idChoferAsignado;

        if (datosRuta.duracionEstimada) {
            datosRuta.duracionEstimada = Number(datosRuta.duracionEstimada);
        } else {
            delete datosRuta.duracionEstimada;
        }

        if (datosRuta.distanciaEstimada) {
            datosRuta.distanciaEstimada = Number(datosRuta.distanciaEstimada);
        } else {
            delete datosRuta.distanciaEstimada;
        }

        try {
            let idRutaResult;
            if (datosRuta.id && datosRuta.id !== "") {
                console.log("Actualizando ruta...");
                idRutaResult = datosRuta.id;
                await actualizarRuta(datosRuta);
            } else {
                console.log("Guardando nueva ruta...");
                delete datosRuta.id;
                const nueva = await guardarNuevaRuta(datosRuta);
                idRutaResult = nueva.ruta ? nueva.ruta._id : null;
            }

            // Si se seleccionó chofer para asignar a la ruta
            if (idChoferParaAsignar && idChoferParaAsignar !== "" && idRutaResult) {
                await asignarRutaAChofer(idChoferParaAsignar, idRutaResult);
            }

            location.reload();
        } catch (err) {
            alert(err.message || "Error al procesar la solicitud");
            console.error(err);
        }
    });
}

async function guardarNuevaRuta(datosRuta) {
    const response = await fetch(ENDPOINT, cuerpo(datosRuta, 'POST'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al guardar ruta");
    }
    return data;
}

async function actualizarRuta(ruta) {
    const response = await fetch(`${ENDPOINT}${ruta.id}`, cuerpo(ruta, 'PUT'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al actualizar ruta");
    }
    return data;
}

async function asignarRutaAChofer(idChofer, idRuta) {
    const res = await fetch(`${ENDPOINT_CHOFERES}${idChofer}/asignar-ruta/${idRuta}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.mensaje || "Error al asignar ruta al chofer");
    }
    return data;
}

async function liberarRuta(idChofer, idRuta) {
    const res = await fetch(`${ENDPOINT_CHOFERES}${idChofer}/finalizar-ruta/${idRuta}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.mensaje || "Error al finalizar ruta del chofer");
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
                    const ruta = await obtenerRuta(id);
                    cargarDatosAForm(ruta);
                } catch (err) {
                    alert(err.message);
                }
                break;
            case "eliminar":
                if (confirm("¿Estás seguro de que querés eliminar esta ruta?")) {
                    try {
                        const id = boton.dataset.id;
                        await eliminarRuta(id);
                        location.reload();
                    } catch (err) {
                        alert(err.message);
                    }
                }
                break;
            case "liberar":
                if (confirm("¿Querés desvincular el chofer asignado a esta ruta?")) {
                    try {
                        const idRuta = boton.dataset.idRuta;
                        const idChofer = boton.dataset.idChofer;
                        await liberarRuta(idChofer, idRuta);
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

async function obtenerRuta(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    const datos = await response.json();
    if (!response.ok) {
        throw new Error(datos.mensaje || datos.message || "Error al obtener los datos de la ruta");
    }
    return datos;
}

async function eliminarRuta(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al eliminar la ruta");
    }
    return data;
}

function cargarDatosAForm(ruta) {
    form.elements["id"].value = ruta._id;
    form.elements["nombre"].value = ruta.nombre || '';
    form.elements["origen"].value = ruta.origen || '';
    form.elements["destino"].value = ruta.destino || '';
    form.elements["duracionEstimada"].value = ruta.duracionEstimada != null ? ruta.duracionEstimada : '';
    form.elements["distanciaEstimada"].value = ruta.distanciaEstimada != null ? ruta.distanciaEstimada : '';

    if (form.elements["idChoferAsignado"]) {
        form.elements["idChoferAsignado"].value = ruta.idChoferAsignado ? String(ruta.idChoferAsignado) : '';
    }

    botonGuardar.textContent = "Actualizar Datos de la Ruta";
    form.elements["nombre"].focus();
}
