import Usuario from '../models/Usuario.js';
import { AuthenticationError } from '../ErrorControl/Errores.js';

async function CrearAdminInicial() {
    //verifica si existe algún documento en la coleccion usuarios
    const existeAdmin = await Usuario.countDocuments();

    if (existeAdmin > 0) {
        console.log("Ya existe registro inicial de administrador.-");
        return;
    }

    const { ADMIN_USER, ADMIN_PASS } = process.env;

    if (!ADMIN_USER || !ADMIN_PASS) {
        throw new AuthenticationError("Faltan credenciales para inicializar usuario Administrador en la base de datos.-");
    }

    await Usuario.create({
        usuario: ADMIN_USER,
        claveHash: ADMIN_PASS,
        rol: 'admin'
    })
        .then(() => {
            console.log("Registro de usuario Admin exitoso.-");
        })
        .catch(error => {
            console.log("hubo un error al crear el usuario admin principal.-", error);
        })
}

export default CrearAdminInicial;