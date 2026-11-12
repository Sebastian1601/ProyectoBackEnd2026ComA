
console.log("vinculado js de choferes");

const botonGuardar = document.querySelector("#formIngresoClientes button[type='submit']");
const form = document.querySelector("#formIngresoClientes");
const tabla = document.querySelector("#tabla-clientes");
const selectorVehiculo = document.querySelector("#idVehiculoAsignado");

const ENDPOINT = "/apiV1/choferes/";
const ENDPOINT_VEHICULOS = "/apiV1/vehiculos/";

let vehiculos = [];
let vehiculoAnterior = "";

if (form && form.elements["nombre"]) {
    form.elements["nombre"].focus();
}

const cuerpo = (datos, metodo) => ({
    method: metodo,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
});

async function solicitarJSON(url, opciones = {}) {
    const response = await fetch(url, opciones);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.mensaje ||
            data.message ||
            "Error al procesar la solicitud"
        );
    }

    return data;
}

// Cargar los vehículos registrados en MongoDB.
async function cargarVehiculos(idVehiculoActual = "") {
    if (!selectorVehiculo) return;

    selectorVehiculo.disabled = true;
    selectorVehiculo.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Sin vehículo asignado";
    selectorVehiculo.appendChild(opcionInicial);

    try {
        const listado = await solicitarJSON(ENDPOINT_VEHICULOS);
        vehiculos = listado.data;

        if (!Array.isArray(vehiculos)) {
            throw new Error("No se pudo obtener el listado de vehículos");
        }

        vehiculos.forEach((vehiculo) => {
            const opcion = document.createElement("option");

            opcion.value = vehiculo._id;

            const descripcion =
                `${vehiculo.patente} - ${vehiculo.marca} ${vehiculo.modelo}`;

            const esActual =
                String(vehiculo._id) === String(idVehiculoActual);

            const disponible =
                vehiculo.estado === "Disponible" &&
                !vehiculo.idChoferAsignado;

            if (esActual) {
                opcion.textContent = `${descripcion} (Asignado actualmente)`;
            } else if (disponible) {
                opcion.textContent = descripcion;
            } else {
                opcion.textContent =
                    `${descripcion} (${vehiculo.estado === "Asignado" || vehiculo.idChoferAsignado ? "Ya asignado" : vehiculo.estado})`;
                opcion.disabled = true;
            }

            selectorVehiculo.appendChild(opcion);
        });

        selectorVehiculo.value = idVehiculoActual || "";
        selectorVehiculo.disabled = false;

    } catch (error) {
        console.error("Error al cargar vehículos:", error);
        selectorVehiculo.disabled = true;
        throw error;
    }
}

async function asignarVehiculo(idChofer, idVehiculo) {
    return solicitarJSON(
        `${ENDPOINT}${idChofer}/asignar-vehiculo/${idVehiculo}`,
        { method: "POST" }
    );
}

async function liberarVehiculo(idChofer, idVehiculo) {
    return solicitarJSON(
        `${ENDPOINT}${idChofer}/liberar-vehiculo/${idVehiculo}`,
        { method: "POST" }
    );
}

async function guardarNuevoChofer(datosChofer) {
    return solicitarJSON(
        ENDPOINT,
        cuerpo(datosChofer, "POST")
    );
}

async function actualizarChofer(chofer) {
    return solicitarJSON(
        `${ENDPOINT}${chofer.id}`,
        cuerpo(chofer, "PUT")
    );
}

async function guardarAsignacion(idChofer, idAnterior, idNuevo) {
    if (idAnterior === idNuevo) return;

    if (idAnterior) {
        await liberarVehiculo(idChofer, idAnterior);
    }

    if (idNuevo) {
        try {
            await asignarVehiculo(idChofer, idNuevo);
        } catch (error) {
            // Si falló el cambio, intentar restaurar el anterior.
            if (idAnterior) {
                try {
                    await asignarVehiculo(idChofer, idAnterior);
                } catch (restauracionError) {
                    console.error(
                        "No se pudo restaurar el vehículo anterior:",
                        restauracionError
                    );
                    throw new Error(
                        `${error.message}. Además, no se pudo restaurar el vehículo anterior. Revisá las asignaciones.`,
                        { cause: restauracionError }
                    );
                }
            }

            throw error;
        }
    }
}

if (form) {
    cargarVehiculos().catch((error) => {
        alert(error.message);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (selectorVehiculo && selectorVehiculo.disabled) {
            alert("No se pudo cargar el listado de vehículos.");
            return;
        }

        const formData = new FormData(form);
        const datosChofer = Object.fromEntries(formData);

        const idVehiculoNuevo = datosChofer.idVehiculoAsignado || "";

        // Las asignaciones se realizan mediante sus rutas específicas.
        delete datosChofer.idVehiculoAsignado;

        if (!datosChofer.fechaIngreso) {
            datosChofer.fechaIngreso = new Date().toISOString();
        }

        botonGuardar.disabled = true;

        try {
            if (datosChofer.id) {
                const idChofer = datosChofer.id;

                await actualizarChofer(datosChofer);

                await guardarAsignacion(
                    idChofer,
                    vehiculoAnterior,
                    idVehiculoNuevo
                );

            } else {
                delete datosChofer.id;

                const resultado = await guardarNuevoChofer(datosChofer);
                const idChofer = resultado.data?._id;

                if (idVehiculoNuevo) {
                    if (!idChofer) {
                        throw new Error(
                            "El chofer se creó, pero no se recibió su identificador para asignar el vehículo."
                        );
                    }

                    await asignarVehiculo(idChofer, idVehiculoNuevo);
                }
            }

            location.reload();

        } catch (error) {
            console.error(error);
            alert(
                `${error.message}\n\nRevisá el listado antes de volver a guardar, porque algunos cambios podrían haberse realizado.`
            );
        } finally {
            botonGuardar.disabled = false;
        }
    });
}

if (tabla) {
    tabla.addEventListener("click", async (e) => {
        const boton = e.target.closest("button[data-action]");
        if (!boton) return;

        const accion = boton.dataset.action;
        const id = boton.dataset.id;

        switch (accion) {
            case "editar":
                try {
                    const chofer = await obtenerChofer(id);
                    await cargarDatosAForm(chofer);
                } catch (error) {
                    alert(error.message);
                }
                break;

            case "eliminar":
                if (confirm("¿Estás seguro de que querés eliminar este chofer?")) {
                    try {
                        await eliminarChofer(id);
                        location.reload();
                    } catch (error) {
                        alert(error.message);
                    }
                }
                break;
        }
    });
}

async function obtenerChofer(id) {
    const datos = await solicitarJSON(`${ENDPOINT}${id}`);
    return datos.data;
}

async function eliminarChofer(id) {
    return solicitarJSON(`${ENDPOINT}${id}`, {
        method: "DELETE"
    });
}

async function cargarDatosAForm(chofer) {
    form.elements["id"].value = chofer._id;
    form.elements["nombre"].value = chofer.nombre || "";
    form.elements["apellido"].value = chofer.apellido || "";
    form.elements["dni"].value = chofer.dni || "";
    form.elements["telefono"].value = chofer.telefono || "";
    form.elements["numeroRegistro"].value = chofer.numeroRegistro || "";

    const estado = chofer.estado || "Disponible";

    const radioEstado = form.querySelector(
        `input[name="estado"][value="${estado}"]`
    );

    if (radioEstado) {
        radioEstado.checked = true;
    }

    vehiculoAnterior = chofer.idVehiculoAsignado
        ? String(
            chofer.idVehiculoAsignado._id ||
            chofer.idVehiculoAsignado
        )
        : "";

    await cargarVehiculos(vehiculoAnterior);

    // No permitir cambiar el vehículo si tiene una ruta activa.
    if (chofer.idRutaActual) {
        selectorVehiculo.disabled = true;
        selectorVehiculo.dataset.rutaActiva = "true";
    } else {
        selectorVehiculo.dataset.rutaActiva = "false";
    }

    botonGuardar.textContent = "Actualizar Datos del Chofer";
    form.elements["nombre"].focus();
}
