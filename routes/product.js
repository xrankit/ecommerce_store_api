import { Router } from "express";
import rateLimit from "express-rate-limit";
const router = Router();

// Set up rate limiter: 100 requests per 15 mins per IP for sensitive routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
import {
  getAllProducts,
  getProductCategories,
  getProductsInCategory,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct
} from "../controller/product.js";

// Get all categories
router.get("/categories", limiter, getProductCategories);

// Get products in a specific category
router.get("/category/:category", getProductsInCategory);

// Get single product by numeric id
router.get("/:id", getProduct);

// Add new product
router.post("/", addProduct);

// Update product by numeric id (full or partial)
router.put("/:id", editProduct);
router.patch("/:id", editProduct);

// Delete product by numeric id
router.delete("/:id", limiter, deleteProduct);

export default router;
