const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/index", (req, res) => {
    res.render("index");
});

module.exports = router;