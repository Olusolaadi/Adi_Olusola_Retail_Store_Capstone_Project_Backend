import { Router } from "express";
import { getUser } from "../controllers/user.js";
import { validateUser, validate } from "../middlewares/validator.js";
import { login } from "../controllers/user.js";

const router = new Router();


router.post("/create", validateUser, validate, getUser);
router.post("/login", login);





export default router;