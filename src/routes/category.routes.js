import { Router } from "express";
import {
  createCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  categoryValidator,
  idParamValidator,
} from "../middlewares/validations/category.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryValidator,
  validate,
  createCategory,
);
router.get("/", authMiddleware, getCategories);
router.get("/:id", authMiddleware, idParamValidator, validate, getCategoryById);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idParamValidator,
  categoryValidator,
  validate,
  updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idParamValidator,
  validate,
  deleteCategory,
);

export default router;
