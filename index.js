const express = require("express");
const { router } = require("./routes/routerMain.js");
const { ValidarString } = require("./validation/clientes.js");
const { manejadorDeErrores } = require("./ErrorControl/Errores.js");


const app = express();
app.use(express.json());
app.use('/', router);
app.use(manejadorDeErrores);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});

