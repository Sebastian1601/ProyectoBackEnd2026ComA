/*
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://dbAdmin01:<db_password>@mongodbfreecluster01.mjhkdia.mongodb.net/?appName=MongoDBfreeCluster01");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}
*/
import mongoose from 'mongoose';
import { DBConnectionError } from '../ErrorControl/Errores.js';

const mongoLocalAddress = "" //si usamos una base local de mongo, ponemos la direcció aca.
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new DBConnectionError("Falta configurar mongo_uri en el entorno");

// Cambié la conexión a Mongo para que haga el async/await pedido para que no arranque el server si no se conecta a la base de datos
// en vez de tirar un timeout genérico.
const conectarDB = async () => {
  //console.log("string de conexión mongo:\n", MONGO_URI); -> Muestra credenciales si lo dejamos
  //console.log("");
  try {
    await mongoose.connect(`${MONGO_URI}`, {dbName: "FreshRoute_B2B"});
    console.log("Conectado a MongoDB");
    return mongoose.connection;
  } catch (error) {
    throw new DBConnectionError(error.message);
  }
}

export default conectarDB;