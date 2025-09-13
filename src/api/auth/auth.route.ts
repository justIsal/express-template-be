import { Router } from 'express';
import {
  getProfileController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { registerSchema } from './auth.validation';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);

router.post('/logout', authMiddleware, logoutController);
router.get('/profile', authMiddleware, getProfileController);

export default router;
