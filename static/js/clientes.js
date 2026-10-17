console.log("vinculado js de clientes");

const botonAgregarCliente = document.querySelector("#formIngresoClientes button");
console.log(botonAgregarCliente ? "boton obtenido" : "no se ha encontrado boton");
const form = document.querySelector("#formIngresoClientes");
const tabla = document.querySelector("#tablaClientes");

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
    const { id, ...datosCliente } = Object.fromEntries(new FormData(form));

    try {
        if (id !== "") {
            await actualizarCliente(id, datosCliente);
        } else {
            await guardarNuevoCliente(datosCliente);
        }
        location.reload(); 
    } catch (error) {
        console.log(error.message); // el formulario conserva lo que escribió el usuario
    }
});

async function guardarNuevoCliente(datosCliente) {
    const response = await fetch(ENDPOINT, cuerpo(datosCliente, 'POST'));
    if (!response.ok) { throw new Error("Existió un error con la petición al servidor.-") }
    const data = await response.json();
    return data;
}


tabla.addEventListener("click", async function (e) {
    console.log(e.target);
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = boton.dataset.id;

    switch (accion) {
        case "editar":
            console.log("obteniendo cliente...");
            const cliente = await obtenerCliente(id);
            console.log(cliente);
            cargarDatosAForm(cliente);
            break;
        case "eliminar":
            console.log("eliminando cliente");
            await eliminarCliente(id);
            break;
        default:
            console.log("accion no válida seleccionada a través del botón");
            break;
    }
});

async function obtenerCliente(id) {
    console.log(`${ENDPOINT}${id}`);
    const response = await fetch(`${ENDPOINT}${id}`);
    console.log("codigo de respuesta: ", response.ok, "\nEstado de respuesta: ", response.status);

    if (!response.ok) {
        throw new Error("Existe un error al obtener los datos del cliente.-");
    };

    const datos = await response.json();
    return datos;
};

async function actualizarCliente(id, datosCliente) {
    const response = await fetch(`${ENDPOINT}${id}`, cuerpo(datosCliente, "PUT"));
    if (!response.ok) throw new Error("Existió un error con la petición al servidor.-");
    return await response.json()
};

async function eliminarCliente(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log("codigo de respuesta: ", response.ok, "\nEstado de respuesta: ", response.status);
    const data = await response.json();
    console.log(data);
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

