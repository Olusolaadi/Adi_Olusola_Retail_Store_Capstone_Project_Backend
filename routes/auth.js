import express from 'express';
import { signUp, signIn, signOut, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController.js';



const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/verify-email', verifyEmail);

export default router;
