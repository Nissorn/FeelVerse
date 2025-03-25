import express from 'express'
import { isAuthenticated,register, login, logout, verifyEmail, sendResetOtp, resetPassword,verifyOTPreset} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-account',verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/OTPverify',verifyOTPreset);
authRouter.post('/reset-password',resetPassword);

export default authRouter;
