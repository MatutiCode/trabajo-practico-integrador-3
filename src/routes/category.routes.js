import { Router } from "express";
import { createCategory, getCategories } from "../controllers/category.controller.js";
import { categoryValidator } from "../middlewares/validations/categody.validators.js";
import { validate } from "moongose/models/user_model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.post('/', authMiddleware, adminMiddleware, categoryValidator, validate, createCategory)
router.get('/', authMiddleware, getCategories)

export default router;