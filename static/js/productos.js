console.log("view productos vinculada a js");
const $q = (query) => document.querySelector(query);
const btnAgregarProducto = $q('#form-Ingreso-Productos button');
const btnReset = $q("#form-Ingreso-Productos .btn-reset")
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

btnReset.addEventListener("click", function () {
    btnAgregarProducto.textContent = "Guardar nuevo producto";
    btnAgregarProducto.classList.remove("actualizando");
});

btnAgregarProducto.addEventListener('click', async (e) => {
    e.preventDefault();
    const formdata1 = new FormData(formulario);
    const datosProducto = {
        producto: Object.fromEntries(formdata1)
    };

    if (datosProducto.producto.id !== "") {
        console.log("actualizando producto...");
        await actualizarProducto(datosProducto);
        location.reload();
    } else {
        console.log("guardando nuevo producto...");
        await guardarProducto(datosProducto);
    };
});

async function guardarProducto(datosProd) {
    try {
        const response = await fetch(ENDPOINT, cuerpo(datosProd, 'POST'));
        if (!response.ok) {
            const data = await response.json();
            console.log("mensaje de error de respuesta: \n", data.message);
            console.log(data.rawMessage);
            throw new Error("Hubo un error al guardar los datos. Verifiquelos");
        };
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.log("Existió un error al contactar al servidor.-");
    };
};

async function actualizarProducto(producto) {
    const { id } = producto.producto;
    try {
        const response = await fetch(`${ENDPOINT}${id}`, cuerpo(producto, 'PUT'));
        if (!response.ok) {
            const data = await response.json();
            console.log(data.message);
            console.log(data.rawMessage);
            return data;
        };
    } catch (error) {
        console.log("Existió un error al contactar al servidor.-");
    };

};

tablaProductos.addEventListener("click", async function (e) {
    e.stopPropagation();
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;

    const accion = boton.dataset.action;
    const id = boton.dataset.id;
    switch (accion) {
        case "editar":
            console.log("obteniendo producto...");
            const producto = await obtenerProducto(id);
            cargarDatosAForm(producto);
            btnAgregarProducto.textContent = "- Actualizar Producto -";
            btnAgregarProducto.classList.add("actualizando");
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
    formulario.elements["id"].value = producto._id;
    formulario.elements["nombre"].value = producto.nombre;
    formulario.elements["descripcion"].value = producto.descripcion;
    formulario.elements["precio"].value = producto.precio;
    formulario.elements["categoria"].value = producto.categoria;
    formulario.elements["nombre"].focus();
};
