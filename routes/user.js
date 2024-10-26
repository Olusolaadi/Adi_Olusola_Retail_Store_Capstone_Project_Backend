import express from "express";
import { getUser, login } from "../controllers/user.js";
import { validateUser, validate } from "../middlewares/validator.js";

const router = express.Router();


router.post("/create", validateUser, validate, getUser);
router.post("/login", login);





export default router;