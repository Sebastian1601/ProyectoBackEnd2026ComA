const express = require("express");
const routeClientes = require("./routes/routeclientes.js");

const app = express();

app.use(express.json());

app.use('/clientes', routeClientes);

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});

