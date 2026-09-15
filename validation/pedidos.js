
//aca quiero verificar en la request, si las propiedades del objeto pasado son las 

const { ValidationError } = require("../ErrorControl/Errores");

//correspondientes de la clase Pedido.
const validarDatosPedido = (req, res, next) => {
    const propiedadesValidas = [
        "id",
        "cliente",
        "fecha",
        "productos",
        "estado",
    ];
    const datos = req.body;

    const propiedadesAEvaluar = Object.keys(datos);

    const propiedadesInvalidas = propiedadesAEvaluar.filter(prop => !propiedadesValidas.includes(prop));

    if (propiedadesInvalidas.length > 0) throw new ValidationError("Existen propiedades que no corresponden a un pedido en la request.", propiedadesInvalidas);

    if (typeof propiedadesAEvaluar.id !== "number") throw new ValidationError("El id debe ser de tipo Number");
    if (typeof propiedadesAEvaluar.cliente !== "string") throw new ValidationError("El valor cliente debe ser de tipo String");
    if (typeof propiedadesAEvaluar.fecha !== "string") throw new ValidationError("La fecha debe ser de tipo String");
    if (typeof !Array.isArray(propiedadesAEvaluar.productos)) throw new ValidationError("La lista de productos debe ser de tipo Array");

    next();
};

module.exports = {
    validarDatosPedido
}