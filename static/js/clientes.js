console.log("vinculado js de clientes");

const botonAgregarCliente = document.querySelector("#formIngresoClientes button");
console.log(botonAgregarCliente ? "boton obtenido" : "no se ha encontrado boton");
const form = document.querySelector("#formIngresoClientes");
const tabla = document.querySelector("#tablaClientes");

botonAgregarCliente.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("guardando cliente en la base de datos...");
    let inputs = form.querySelectorAll("input");

    const nuevoCliente = {
        nombre: inputs[0].value,
        telefono: inputs[1].value,
        direccion: inputs[2].value
    };

    console.log(nuevoCliente);

    const response = await fetch("/apiV1/clientes/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoCliente)
    });
    const data = await response.json();
    location.reload();
});


tabla.addEventListener("click", function (e) {
    console.log(e.target);
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = boton.dataset.id;

    console.log(boton);
    console.log(accion, id);
});