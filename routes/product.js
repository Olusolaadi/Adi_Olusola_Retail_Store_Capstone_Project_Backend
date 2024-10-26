import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/product.js";
import { adminRoute } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", adminRoute, getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", adminRoute, createProduct);
router.delete("/:id", adminRoute, deleteProduct);

export default router;
