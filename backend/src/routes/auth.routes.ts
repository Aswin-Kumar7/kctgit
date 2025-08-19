import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, requestOtp, verifyOtp, me, updateMe, deleteMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const otpLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many OTP requests. Please try again later.' },
});

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', otpLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);

export default router;
