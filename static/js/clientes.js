console.log("vinculado js de clientes");

const botonAgregarCliente = document.querySelector("#formIngresoClientes button");
console.log(botonAgregarCliente ? "boton obtenido" : "no se ha encontrado boton");

const form = document.querySelector("#formIngresoClientes");
form.elements["nombre"].focus();

const tabla = document.querySelector("#tabla-clientes");

const ENDPOINT = '/apiV1/clientes/';
const cuerpo = (datos, metodo) => {
    return {
        method: `${metodo}`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(datos)
    }
};


botonAgregarCliente.addEventListener("click", async (e) => {
    e.preventDefault();
    const formdata1 = new FormData(form);
    const datosCliente = Object.fromEntries(formdata1);
    console.log(datosCliente);

    if (datosCliente.id !== "") {
        console.log("actualizando datos del cliente...");
        try {
            await actualizarCliente(datosCliente);
            location.reload();
        } catch (e) {
            console.log(e.message);
        }
    } else {
        console.log("guardando nuevo cliente en MongoDB...");
        try {
            await guardarNuevoCliente(datosCliente);
            location.reload();
        } catch (e) {
            console.log(e.message);
        }
    };
});

async function guardarNuevoCliente(datosCliente) {
    const response = await fetch(ENDPOINT, cuerpo(datosCliente, 'POST'));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { throw new Error(data.error || data.mensaje || "Existió un error con la petición al servidor.-") }
    return data;
};


async function actualizarCliente(cliente) {
    const response = await fetch(`${ENDPOINT}${cliente.id}`, cuerpo(cliente, "PUT"));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { throw new Error(data.error || data.mensaje || "Existió un error con la petición al servidor.-") }
    return data;
};


tabla.addEventListener("click", async function (e) {
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = boton.dataset.id;

    switch (accion) {
        case "editar": {
            console.log("obteniendo cliente...");
            const cliente = await obtenerCliente(id);
            cargarDatosAForm(cliente.data);
            break;
        }
        case "eliminar":
            await eliminarCliente(id);
            break;
        default:
            console.log("accion no válida seleccionada a través del botón");
            break;
    }
});

async function obtenerCliente(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    const datos = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(datos.error || datos.mensaje || "Existe un error al obtener los datos del cliente.-");
    };
    return datos;
};

async function eliminarCliente(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        alert(data.error || data.mensaje || "Existe un error al eliminar el cliente.-");
        return;
    }
    location.reload();
};


function cargarDatosAForm(cliente) {
    console.log("datos antes de cargar form:", cliente)
    form.elements["id"].value = cliente._id;
    form.elements["nombre"].value = cliente.nombre;
    form.elements["telefono"].value = cliente.telefono;
    form.elements["direccion"].value = cliente.direccion;
    form.elements["nombre"].focus();
};

