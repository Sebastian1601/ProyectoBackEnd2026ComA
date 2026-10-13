import app from "./config/expressApp.js";
import conectarDB from "./config/db.js";
import CrearAdminInicial from "./config/bootstrapAdmin.js";

let dbClient;



(async function IniciarServer() {
    try {
        dbClient = await conectarDB();

        await CrearAdminInicial();

        const PORT = process.env.PORT;

        const server = app.listen(PORT, () => {
            console.log(`server running on http://localhost:${PORT}`);
        });


        process.on("SIGINT", async () => {

            server.close(async () => {

                try {
                    await dbClient.close();
                    console.log("conexión con MongoDB cerrada.-");
                } catch (e) {
                    console.log("existió un error al intentar cerrar la conexión con MongoDB.-")
                }
            });
        })
    } catch (e) {
        console.error("Error al iniciar el servidor.-", e);
        process.exitCode = 1;
    }
})();
