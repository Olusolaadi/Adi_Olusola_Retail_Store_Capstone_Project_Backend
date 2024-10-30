import express from "express";

import {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const router = express.Router();

router.get("/", fetchAllProducts);
router.get("/:id", fetchProductById);
router.get("/category/:category", fetchProductsByCategory);
router.post("/products", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
