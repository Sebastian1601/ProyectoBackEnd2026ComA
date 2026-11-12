// Funciones auxiliares compartidas por los middlewares de validación.
// Todas lanzan ValidationError (400) para que el error llegue al manejador
// central de errores en lugar de responderse desde el middleware.

import { ValidationError } from "../ErrorControl/Errores.js";

const presente = (valor) => valor !== undefined && valor !== null;

// Valida un campo de texto.
//  - Si el campo no viene: error solo cuando es `requerido`.
//  - Si viene vacío (""): error solo cuando es `requerido` (se ignora si es opcional).
//  - Si viene con contenido: debe ser texto de al menos `min` caracteres.
export function validarTexto(campo, valor, { requerido = false, min = 1 } = {}) {
    if (!presente(valor)) {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    if (typeof valor !== "string") {
        throw new ValidationError(`El campo ${campo} debe ser un texto.`, campo);
    }
    if (valor.trim() === "") {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    if (valor.trim().length < min) {
        throw new ValidationError(`El campo ${campo} debe tener al menos ${min} caracteres.`, campo);
    }
}

// Valida un campo numérico. Acepta números y textos numéricos ("1500").
//  - Vacío o ausente: error solo cuando es `requerido`.
//  - Presente: debe ser convertible a número y, si hay `min`, no menor que ese valor.
export function validarNumero(campo, valor, { requerido = false, min = null } = {}) {
    if (!presente(valor) || (typeof valor === "string" && valor.trim() === "")) {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    if (typeof valor === "boolean" || (typeof valor !== "number" && typeof valor !== "string")) {
        throw new ValidationError(`El campo ${campo} debe ser un número.`, campo);
    }
    const numero = Number(valor);
    if (Number.isNaN(numero)) {
        throw new ValidationError(`El campo ${campo} debe ser un número válido.`, campo);
    }
    if (min !== null && numero < min) {
        throw new ValidationError(`El campo ${campo} no puede ser menor que ${min}.`, campo);
    }
}

// Valida que un campo pertenezca a una lista de valores permitidos.
export function validarEnum(campo, valor, valores, { requerido = false } = {}) {
    if (!presente(valor) || (typeof valor === "string" && valor.trim() === "")) {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    if (typeof valor !== "string" || !valores.includes(valor)) {
        throw new ValidationError(
            `El campo ${campo} debe ser uno de los siguientes valores: ${valores.join(", ")}.`,
            campo
        );
    }
}

// Valida que un campo sea una fecha interpretable.
export function validarFecha(campo, valor, { requerido = false } = {}) {
    if (!presente(valor) || (typeof valor === "string" && valor.trim() === "")) {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    const fecha = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
        throw new ValidationError(`El campo ${campo} debe ser una fecha válida.`, campo);
    }
}

// Valida que un campo sea un identificador válido de MongoDB.
export function validarObjectId(campo, valor, { requerido = false } = {}) {
    if (!presente(valor)) {
        if (requerido) throw new ValidationError(`El campo ${campo} es obligatorio.`, campo);
        return;
    }
    if (typeof valor !== "string" || !/^[0-9a-fA-F]{24}$/.test(valor.trim())) {
        throw new ValidationError(`El campo ${campo} debe ser un identificador válido de MongoDB.`, campo);
    }
}
