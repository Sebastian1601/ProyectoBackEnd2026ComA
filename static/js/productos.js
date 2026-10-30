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
    const datosProducto = Object.fromEntries(formdata1)

    if (datosProducto.id !== "") {
        await actualizarProducto(datosProducto);
        location.reload();
        return;
    };

    console.log("guardando nuevo producto...");
    await guardarProducto(datosProducto);
    location.reload();
});

async function guardarProducto(datosProducto) {
    const response = await fetch(ENDPOINT, cuerpo(datosProducto, 'POST'));
    if (!response.ok) {
        console.error("Existió un error al guardar nuevo producto.-");
    }
};

async function actualizarProducto(producto) {
    const { id } = producto;
    const response = await fetch(`${ENDPOINT}${id}`, cuerpo(producto, 'PUT'));
    if (!response.ok) {
        console.error("Existió un error al actualizar producto.-");
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

            const producto = await obtenerProducto(id);
            cargarDatosAForm(producto.data);
            btnAgregarProducto.textContent = "- Actualizar Producto -";
            btnAgregarProducto.classList.add("actualizando");
            break;
        case "eliminar":

            await eliminarProducto(id);
            location.reload();
            break;
        default:

            console.log("accion no válida seleccionada a través del botón");
            break;
    };
})

async function obtenerProducto(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    if (!response.ok) {
        console.error("Existe un error al obtener el producto seleccionado.-");
    };
    const producto = await response.json();
    return producto;
};

async function eliminarProducto(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    let mensaje;
    if (!response.ok) {
        mensaje = "Existe un error al eliminar producto.-";
    };
    mensaje = "Producto eliminado con éxito.-"

    console.log(mensaje, response);
};

async function cargarDatosAForm(producto) {
    formulario.elements["id"].value = producto._id;
    formulario.elements["nombre"].value = producto.nombre;
    formulario.elements["descripcion"].value = producto.descripcion;
    formulario.elements["precio"].value = producto.precio;
    formulario.elements["categoria"].value = producto.categoria;
    formulario.elements["nombre"].focus();
};
