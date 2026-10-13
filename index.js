import app from "./config/expressApp.js";
import conectarDB from "./config/db.js";
import CrearAdminInicial from "./config/bootstrapAdmin.js";

let dbClient;

async function IniciarServer() {
    try {
        dbClient = await conectarDB();

        await CrearAdminInicial();

        const PORT = process.env.PORT;

        app.listen(PORT, () => {
            console.log(`server running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("Error al iniciar el servidor.-", e);
        process.exitCode = 1;
    }
}

IniciarServer();

app.on("close", async () => {
    // Call this only when your application terminates
    await dbClient.close();
})