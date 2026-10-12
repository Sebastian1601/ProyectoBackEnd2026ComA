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

const { MONGO_URI } = process.env;
if (!MONGO_URI) throw new Error("Falta configurar mongo_uri en el entorno");

export const conectarDB = async ()=>{
  console.log(MONGO_URI);
  try {
    await mongoose.connect(`${MONGO_URI}`);
    console.log("Conectado a MongoDB Atlas(cloud)");
  } catch (error) {
    console.error("Hubo un error al conectar a MongoDB Atlas", error.message);
    process.exit(1);
  }
}


