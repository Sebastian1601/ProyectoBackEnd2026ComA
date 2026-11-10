console.log("vinculado js de choferes");

const botonGuardar = document.querySelector("#formIngresoClientes button[type='submit']");
const form = document.querySelector("#formIngresoClientes");
if (form && form.elements["nombre"]) {
    form.elements["nombre"].focus();
}

const tabla = document.querySelector("#tabla-clientes");
const ENDPOINT = '/apiV1/choferes/';

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
        const datosChofer = Object.fromEntries(formData);

        if (!datosChofer.fechaIngreso) {
            datosChofer.fechaIngreso = new Date().toISOString();
        }

        try {
            if (datosChofer.id && datosChofer.id !== "") {
                console.log("Actualizando chofer...");
                await actualizarChofer(datosChofer);
            } else {
                console.log("Guardando nuevo chofer...");
                delete datosChofer.id;
                await guardarNuevoChofer(datosChofer);
            }
            location.reload();
        } catch (err) {
            alert(err.message || "Error al procesar la solicitud");
            console.error(err);
        }
    });
}

async function guardarNuevoChofer(datosChofer) {
    const response = await fetch(ENDPOINT, cuerpo(datosChofer, 'POST'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al guardar chofer");
    }
    return data;
}

async function actualizarChofer(chofer) {
    const response = await fetch(`${ENDPOINT}${chofer.id}`, cuerpo(chofer, 'PUT'));
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al actualizar chofer");
    }
    return data;
}

if (tabla) {
    tabla.addEventListener("click", async function (e) {
        const boton = e.target.closest('button[data-action]');
        if (!boton) return;

        const accion = boton.dataset.action;
        const id = boton.dataset.id;

        switch (accion) {
            case "editar":
                try {
                    const chofer = await obtenerChofer(id);
                    cargarDatosAForm(chofer);
                } catch (err) {
                    alert(err.message);
                }
                break;
            case "eliminar":
                if (confirm("¿Estás seguro de que querés eliminar este chofer?")) {
                    try {
                        await eliminarChofer(id);
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

async function obtenerChofer(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    const datos = await response.json();
    if (!response.ok) {
        throw new Error(datos.mensaje || datos.message || "Error al obtener los datos del chofer");
    }
    return datos;
}

async function eliminarChofer(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.mensaje || data.message || "Error al eliminar el chofer");
    }
    return data;
}

function cargarDatosAForm(chofer) {
    form.elements["id"].value = chofer._id;
    form.elements["nombre"].value = chofer.nombre || '';
    form.elements["apellido"].value = chofer.apellido || '';
    form.elements["dni"].value = chofer.dni || '';
    form.elements["telefono"].value = chofer.telefono || '';
    form.elements["numeroRegistro"].value = chofer.numeroRegistro || '';
    
    const estado = chofer.estado || 'Disponible';
    const radioEstado = form.querySelector(`input[name="estado"][value="${estado}"]`);
    if (radioEstado) {
        radioEstado.checked = true;
    }

    botonGuardar.textContent = "Actualizar Datos del Chofer";
    form.elements["nombre"].focus();
}
