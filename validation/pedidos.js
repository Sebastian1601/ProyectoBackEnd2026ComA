
//aca quiero verificar en la request, si las propiedades del objeto pasado son las 

const { ValidationError } = require("../ErrorControl/Errores");

//correspondientes de la clase Pedido.
const validarDatosPedido = (req, res, next) => {
    const propiedadesValidas = [
        //"id", -> Mismo motivo que abajo en if (typeof...)
        "cliente",
        "fecha",
        "productos",
        "estado",
    ];
    const datos = req.body;

    const propiedadesAEvaluar = Object.keys(datos);

    const propiedadesInvalidas = propiedadesAEvaluar.filter(prop => !propiedadesValidas.includes(prop));

    if (propiedadesInvalidas.length > 0) throw new ValidationError("Existen propiedades que no corresponden a un pedido en la request.", propiedadesInvalidas);

    //if (typeof datos.id !== "number") throw new ValidationError("El id debe ser de tipo Number"); -> No lo validamos acá porque lo genera el propio controller, no el cliente
    if (typeof datos.cliente !== "string") throw new ValidationError("El valor cliente debe ser de tipo String");
    if (typeof datos.fecha !== "string") throw new ValidationError("La fecha debe ser de tipo String");
    if (!Array.isArray(datos.productos)) throw new ValidationError("La lista de productos debe ser de tipo Array");

    next();
};

module.exports = {
    validarDatosPedido
}