console.log("view productos vinculada a js");
const $q = (query) => document.querySelector(query);
const btnAgregarProducto = $q('#form-Ingreso-Productos button');
const tablaProductos = $q('#tabla-productos');
const formulario = $q("#form-Ingreso-Productos");
const ENDPOINT = `/apiV1/productos/`;

const cuerpo = (datos, metodo) => {
    return {
        method: `${metodo}`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }
};

btnAgregarProducto.addEventListener('click', async (e) => {
    e.preventDefault();
    const formdata1 = new FormData(formulario);
    const datosProducto = {
        producto: Object.fromEntries(formdata1)
    };

    let respuesta;
    if (datosProducto.producto.id !== "") {
        console.log("actualizando producto...");
        try {
            respuesta = await actualizarProducto(datosProducto);
        } catch (e) {
            console.log(e.message);
        } finally {
            formulario.reset();
            formulario.elements["nombre"].focus();
        };
    } else {
        console.log("guardando nuevo producto...")
        await guardarProducto(datosProducto);
        formulario.reset();
        formulario.elements["nombre"].focus();

    };
    location.reload();
});

async function guardarProducto(datosProd) {
    try {
        const response = await fetch(ENDPOINT, cuerpo(datosProd, 'POST'));
        if (!response.ok) {
            throw new Error("Error en el fetch de datos.-");
        };
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error.message);
    };
    console.log("guardar datos finalizado.");
};

async function actualizarProducto(producto) {
    const response = await fetch(`${ENDPOINT}${producto.id}`, cuerpo(producto, 'PUT'));
    if (!response.ok) { throw new Error("Existe algun error con la petición de actualizacion al servidor") };
    console.log(response.status);
    const data = await response.json();
    return data;
};

tablaProductos.addEventListener("click", async function (e) {
    e.stopPropagation();
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    console.log(boton);
    const accion = boton.dataset.action;
    const id = boton.dataset.id;
    switch (accion) {
        case "editar":
            console.log("obteniendo producto...");
            const producto = await obtenerProducto(id);
            console.log(producto);
            cargarDatosAForm(producto);
            break;
        case "eliminar":
            console.log("eliminando cliente");
            await eliminarProducto(id);
            break;
        default:
            console.log("accion no válida seleccionada a través del botón");
            break;
    };
})


async function obtenerProducto(id) {
    console.log(`${ENDPOINT}${id}`);
    const response = await fetch(`${ENDPOINT}${id}`);
    console.log("respuesta al obtener producto del backend ", response.status);
    if (!response.ok) {
        throw new Error("Existe un error al obtener el producto seleccionado.-");
    };

    const producto = await response.json();
    return producto
};


async function cargarDatosAForm(producto) {
    console.log("datos antes de cargar form: ", producto);
    formulario.elements["id"].value = producto._id;
    formulario.elements["nombre"].value = producto.nombre;
    formulario.elements["descripcion"].value = producto.descripcion;
    formulario.elements["precio"].value = producto.precio;
    formulario.elements["categoria"].value = producto.categoria;
    formulario.elements["nombre"].focus();
};
