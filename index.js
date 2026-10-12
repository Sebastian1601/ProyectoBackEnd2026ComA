import app from "./config/expressApp.js";
import { conectarDB } from "./config/db.js";

conectarDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});


