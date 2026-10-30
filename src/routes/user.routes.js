import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  userIdValidator,
  updateUserValidator,
} from "../middlewares/validations/user.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

// todas las rutas de usuarios son solo para admin
router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id", userIdValidator, validate, getUserById);
router.put("/:id", userIdValidator, updateUserValidator, validate, updateUser);
router.delete("/:id", userIdValidator, validate, deleteUser);

export default router;
