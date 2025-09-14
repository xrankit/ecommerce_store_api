import { Router } from "express";
const router = Router();
import { getAllProducts, getProductCategories, getProductsInCategory, getProduct, addProduct, editProduct, deleteProduct } from "../controller/product";

router.get("/", getAllProducts);
router.get("/categories", getProductCategories);
router.get("/category/:category", getProductsInCategory);
router.get("/:id", getProduct);
router.post("/", addProduct);
router.put("/:id", editProduct);
router.patch("/:id", editProduct);
router.delete("/:id", deleteProduct);

export default router;
