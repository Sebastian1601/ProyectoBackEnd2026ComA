import { Router } from "express";
const router = Router();
import path from "path";

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/index", (req, res) => {
    res.render("index");
});

export default router;