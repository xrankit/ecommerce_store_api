import { Router } from "express";
import rateLimit from "express-rate-limit";
const router = Router();
import { login } from "../controller/auth.js";

// Rate limiter for login endpoint: max 5 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);

export default router;
