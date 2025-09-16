import { Router } from "express";
const router = Router();
import {
  getAllProducts,
  getProductCategories,
  getProductsInCategory,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct
} from "../controller/product.js";

// Get all products
router.get("/", getAllProducts);

// Get all categories
router.get("/categories", getProductCategories);

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
router.delete("/:id", deleteProduct);

export default router;
