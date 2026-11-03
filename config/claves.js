import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// scrypt sirve para guardar contraseñas de forma segura.
const scryptAsync = promisify(scrypt);
const LARGO_HASH = 64;

// Devuelve "sal:hash" (los dos en hexadecimal). Es lo que se guarda en la base.
// La sal es un valor aleatorio distinto por usuario: dos usuarios con la misma clave tienen hashes distintos.
export async function hashearClave(clave) {
    const sal = randomBytes(16).toString('hex');
    const hash = await scryptAsync(clave, sal, LARGO_HASH);
    return `${sal}:${hash.toString('hex')}`;
}

// Recalcula el hash con la misma sal y lo compara con el guardado.
export async function verificarClave(clave, guardada) {
    const [sal, hashGuardado] = String(guardada).split(':');
    if (!sal || !hashGuardado) return false; // formato inválido 

    const hash = await scryptAsync(clave, sal, LARGO_HASH);
    const esperado = Buffer.from(hashGuardado, 'hex');

    // timingSafeEqual compara en tiempo constante, para no filtrar información por cuánto tarda la comparación
    return hash.length === esperado.length && timingSafeEqual(hash, esperado);
}