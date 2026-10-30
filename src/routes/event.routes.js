import { Router } from 'express';
import { createEvent, getEvents, getMyEvents, getEventById } from '../controllers/event.controller.js';
import { eventValidator, eventIdValidator } from '../middlewares/validations/event.validators.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, eventValidator, validate, createEvent);
router.get('/', authMiddleware, getEvents);
router.get('/my', authMiddleware, getMyEvents);
router.get('/:id', authMiddleware, eventIdValidator, validate, getEventById);

export default router;