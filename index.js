const express = require("express");
const { router } = require("./routes/routerMain.js");
const { manejadorDeErrores } = require("./ErrorControl/Errores.js");

const app = express();

// Configuración de Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Middleware para recibir JSON
app.use(express.json());

// Rutas de la API
app.use("/", router);

// Manejo de errores
app.use(manejadorDeErrores);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});

