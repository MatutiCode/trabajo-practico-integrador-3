import { Router } from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import {
  eventValidator,
  eventIdValidator,
} from "../middlewares/validations/event.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";

const router = Router();

router.post("/", authMiddleware, eventValidator, validate, createEvent);
router.get("/", authMiddleware, getEvents);
router.get("/my", authMiddleware, getMyEvents);
router.get("/:id", authMiddleware, eventIdValidator, validate, getEventById);
router.put(
  "/:id",
  authMiddleware,
  eventIdValidator,
  validate,
  ownerOrAdminMiddleware,
  eventValidator,
  validate,
  updateEvent,
);

router.delete(
  "/:id",
  authMiddleware,
  eventIdValidator,
  validate,
  ownerOrAdminMiddleware,
  deleteEvent,
);
export default router;
