const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.render("login");
});

router.get("/index", (req, res)=>{
    res.render("index");
});

router.use("", (req, res)=>{
    res.send("<h1> 404. Página web no encontrada - Fresh B2B</H1>");
});


module.exports = router;