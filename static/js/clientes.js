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
    console.log("guardando cliente en la base de datos MongoDB...");
    let inputs = form.querySelectorAll("input");
    const nuevoCliente = {
        nombre: inputs[0].value,
        telefono: inputs[1].value,
        direccion: inputs[2].value
    };

    const response = await fetch(ENDPOINT, cuerpo(nuevoCliente, "POST"));
    console.log("codigo de respuesta: ", response.ok, "\nEstado de respuesta: ", response.status);
    const data = await response.json();
    console.log("datos guardados correctamente. respuesta: ", data);
    location.reload();
});


tabla.addEventListener("click", async function (e) {
    console.log(e.target);
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = boton.dataset.id;

    switch (accion) {
        case "editar":
            console.log("obteniendo cliente...");
            await obtenerCliente(id);
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

    const datos = await response.json();
    //falta implementar la carga de los datos en los inputs para editarlos.
};

async function editarCliente(id, cliente) {
    const response = await fetch(`${ENDPOINT}${id}`, cuerpo(cliente, "PUT"));
    console.log("codigo de respuesta: ", response.ok, "\nEstado de respuesta: ", response.status);
    const data = await response.json();
    console.log(data);
    location.reload();
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

