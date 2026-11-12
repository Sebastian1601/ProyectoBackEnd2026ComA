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

// Lee la respuesta del servidor y lanza un Error si la petición falló.
async function leerRespuesta(response, mensajePorDefecto) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || mensajePorDefecto);
    }
    return data;
};

btnReset.addEventListener("click", function () {
    btnAgregarProducto.textContent = "Guardar nuevo producto";
    btnAgregarProducto.classList.remove("actualizando");
});

btnAgregarProducto.addEventListener('click', async (e) => {
    e.preventDefault();
    const formdata1 = new FormData(formulario);
    const datosProducto = Object.fromEntries(formdata1)

    try {
        if (datosProducto.id !== "") {
            await actualizarProducto(datosProducto);
        } else {
            console.log("guardando nuevo producto...");
            await guardarProducto(datosProducto);
        }
        location.reload();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

async function guardarProducto(datosProducto) {
    const response = await fetch(ENDPOINT, cuerpo(datosProducto, 'POST'));
    return leerRespuesta(response, "Existió un error al guardar nuevo producto.-");
};

async function actualizarProducto(producto) {
    const { id } = producto;
    const response = await fetch(`${ENDPOINT}${id}`, cuerpo(producto, 'PUT'));
    return leerRespuesta(response, "Existió un error al actualizar producto.-");
};

tablaProductos.addEventListener("click", async function (e) {
    e.stopPropagation();
    const boton = e.target.closest('button[data-action]');
    if (!boton) return;
    const accion = boton.dataset.action;
    const id = boton.dataset.id;

    try {
        switch (accion) {
            case "editar": {
                const producto = await obtenerProducto(id);
                cargarDatosAForm(producto.data);
                btnAgregarProducto.textContent = "- Actualizar Producto -";
                btnAgregarProducto.classList.add("actualizando");
                break;
            }
            case "eliminar":
                await eliminarProducto(id);
                location.reload();
                break;
            default:
                console.log("accion no válida seleccionada a través del botón");
                break;
        };
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
})

async function obtenerProducto(id) {
    const response = await fetch(`${ENDPOINT}${id}`);
    return leerRespuesta(response, "Existe un error al obtener el producto seleccionado.-");
};

async function eliminarProducto(id) {
    const response = await fetch(`${ENDPOINT}${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return leerRespuesta(response, "Existe un error al eliminar producto.-");
};

async function cargarDatosAForm(producto) {
    formulario.elements["id"].value = producto._id;
    formulario.elements["nombre"].value = producto.nombre;
    formulario.elements["descripcion"].value = producto.descripcion;
    formulario.elements["precio"].value = producto.precio;
    formulario.elements["categoria"].value = producto.categoria;
    formulario.elements["nombre"].focus();
};
