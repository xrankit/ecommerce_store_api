// app.js
import express, { static as expressStatic, urlencoded, json } from "express";
import cors from "cors";
import { join, dirname } from "path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { fileURLToPath } from "url";

// routes
import productRoute from "./routes/product.js";
import homeRoute from "./routes/home.js";
import cartRoute from "./routes/cart.js";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";

// Load env
const myEnv = config();
expand(myEnv);

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB once
import "./db.js"; // ensures single connection

// App setup
const app = express();

// Middleware
app.use(cors());
app.use(expressStatic(join(__dirname, "/public")));
app.use(urlencoded({ extended: true }));
app.use(json());

// View engine
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.disable("view cache");

// Routes
app.use("/", homeRoute);
app.use("/products", productRoute);
app.use("/carts", cartRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

export default app;
