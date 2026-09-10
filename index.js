const express = require("express");
const { ClienteController } = require("./controllers/clientesController.js");
const { Cliente } = require("./models/Cliente.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Petición ok."
    });
});

app.get("/clientes", (req, res) => {
    ClienteController.obtenerClientes(req, res);
});

app.get("/clientes/:id", (req, res)=> ClienteController.obtenerClientePorId(req, res));


const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});

