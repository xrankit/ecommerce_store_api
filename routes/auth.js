import { Router } from "express";
const router = Router();
import { login } from "../controller/auth.js";

router.post("/login", login);

export default router;
