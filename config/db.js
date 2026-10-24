import mongoose from 'mongoose';
import { DBConnectionError } from '../ErrorControl/Errores.js';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new DBConnectionError("Falta configurar mongo_uri en el entorno");

const esLocal = MONGO_URI.includes("127.0.0.1");

// Cambié la conexión a Mongo para que haga el async/await pedido para que no arranque el server si no se conecta a la base de datos
// en vez de tirar un timeout genérico.
const conectarDB = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}`, { dbName: "FreshRoute_B2B" });
    const conectado = esLocal
      ? "Conectado a Mongodb Localmente."
      : "Conectado a Mongodb Atlas Online";
    console.log(conectado);
    return mongoose.connection;
  } catch (error) {
    throw new DBConnectionError(error.message);
  }
}

export default conectarDB;