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
const MONGO_URI = mongoLocalAddress || process.env.MONGO_URI;

if (!MONGO_URI) throw new DBConnectionError("Falta configurar mongo_uri en el entorno");

const conectarDB = async () => {
  mongoose.connect(`${MONGO_URI}`, {
    dbName: "FreshRoute_B2B"
  })
    .then(() => {
      console.log("Conectado a MongoDB Atlas(cloud)");
      return mongoose.connection;
    })
    .catch(error => {
      throw new DBConnectionError(error);
    })

}

export default conectarDB;