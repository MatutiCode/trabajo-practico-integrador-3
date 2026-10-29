import { Router } from 'express';
import { register, login, getProfile, updateProfile, logout } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, profileRules } from '../middlewares/validations/auth.validators.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, profileRules, validate, updateProfile);
router.post('/logout', authMiddleware, logout);

export default router;